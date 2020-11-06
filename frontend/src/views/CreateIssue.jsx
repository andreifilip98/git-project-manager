import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { FilePond, File, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import Axios from "axios"
import FormData from 'form-data'


registerPlugin(FilePondImagePreview);

let uuidv4 = require('uuid/v4');
let uuid = uuidv4();

let selectedColour;
let selectedPriority;
let issueTemporaryTitle='';

const colours = [
    'Green', 'Yellow', 'Red'
];

const priorities = [
    'Low', 'Mid', 'High'
];

const base_url = 'http://127.0.0.1:8000/';
const deploy_url = 'https://7753864ba8a6.ngrok.io/';

function getTitle () {
    return document.getElementById("title").value;
}

function getDescription () {
    return document.getElementById("description").value;
}

function getAffectedVersion () {
    return document.getElementById("affectedversion").value;
}

function getVersionToFix () {
    return document.getElementById("versiontofix").value;
}

function getColour() {
    return selectedColour;
}

function getPriority() {
    return selectedPriority;
}

function emptyFields() {
    document.getElementById("title").value = null;
    document.getElementById("description").value = null;
    document.getElementById("affectedversion").value = null;
    document.getElementById("versiontofix").value = null;
}

function presentApp() {

    let path = '/home/user';
    window.location.href=path
}

function updateIssueFromDb(title, description, affected, fix, colour, priority) {

    if (issueTemporaryTitle !== '') {
        Axios.post(base_url + 'attachment/update_attachments/', {
            'old_created_by' : issueTemporaryTitle,
            'new_created_by' : title
        })
            .then(response => {
                console.log(response);
                console.log(response.status + " " + response.statusText);
            })
            .then(res => {
                Axios.post(base_url + 'issue/update_issue/', {
                    'issueTemporaryTitle': issueTemporaryTitle,
                    'newTitle': title.replace(/[^\w\s]/gi, ' '),
                    'description': description,
                    'affected': affected,
                    'fix': fix,
                    'colour': colour,
                    'priority': priority
                })
                    .then(response => {
                        console.log(response);
                        console.log(response.status + " " + response.statusText);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })

    }
    else {
        console.log("TO DO: Add issue without attachment")
        console.log(title, description, affected, fix, colour)

        let projectName = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1);
        let finalProjectName = projectName.split('%20').join(' ');

        fetch(base_url + 'project/project/get_project_pk', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({name: finalProjectName}),
        })
            .then(res => res.json())
            .then(project_pk => {
                console.log(project_pk);
                Axios.post(base_url + 'issue/create_issue/', {
                    'issue': {
                        'created_by' : project_pk.toString(),
                        'title': title.replace(/[^\w\s]/gi, ' '),
                        'description': description,
                        'affected': affected,
                        'fix': fix,
                        'colour': colour,
                        'priority': priority
                    }
                })
                    .then(response => {
                        console.log(response);
                        console.log(response.status + " " + response.statusText);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
    }
}

function waitTime(title, description, affected, fix, colour, priority) {

    updateIssueFromDb(title, description, affected, fix, colour, priority);

    setTimeout(function(){
        emptyFields();
    }, 2000);
    setTimeout(function(){
        presentApp();
    }, 3000);

}

class CreateIssue extends Component {

    _onSelectColour = (option) => {
        selectedColour = option.label;
        console.log(selectedColour);
    };

    _onSelectPriority = (option) => {
        selectedPriority = option.label;
        console.log(selectedPriority);
    };

    addIssueToDb(file, title, description, affected, fix, colour, priority, attachments) {

        // Create Attachment and save in db
        let data = new FormData();
        data.append('created_by', file.name);
        data.append('file', file, file.fileName);
        issueTemporaryTitle = file.name;

        Axios.post(base_url + 'attachment/create_attachment/', data, {
            headers: {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data`,
            }
        })
            .then(() => {
                console.log("Attachment created!")
            })
            .then(() => {
                fetch(base_url + 'attachment/attachments/get_last_attachment', {
                    crossDomain : true,
                    method : 'GET',
                    headers : {
                        Authorization : `JWT ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(attachments);
                        console.log("data ", data);

                        let projectName = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1);
                        let finalProjectName = projectName.split('%20').join(' ');

                        fetch(base_url + 'project/project/get_project_pk', {
                            crossDomain : true,
                            method : 'POST',
                            headers : {
                                Authorization : `JWT ${localStorage.getItem('token')}`,
                                'accept': 'application/json',
                                'Accept-Language': 'en-US,en;q=0.8',
                                "Content-Type": "application/json; charset=UTF-8"
                            },
                            body: JSON.stringify({name: finalProjectName}),
                        })
                            .then(res => res.json())
                            .then(project_pk => {
                                console.log(project_pk);
                                Axios.post(base_url + 'issue/create_issue_with_filepond/', {
                                    'issue' : {
                                        'created_by' : project_pk.toString(),
                                        'title' : title,
                                        'description' : description,
                                        'affected' : affected,
                                        'fix' : fix,
                                        'colour' : colour,
                                        'priority' : priority,
                                        'attachments' : [res]
                                    }})
                                    .then(response => {
                                        console.log(response.config.data)
                                        console.log(response.status + " " + response.statusText)
                                    })
                                    .then(res => {
                                        this.pond.removeFile()
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            })
                    })
            })

    }

    constructor(props) {
        super(props);

        this.state = {
            files: [],
            uploadValue: 0,
            filesMetadata:[],
            rows:  [],
            message: "",
            picture: "",
            userProject: ""
        };

        this.handleProcessing = this.handleProcessing.bind(this);
    }

    handleInit() {
        // handle init file upload here
        console.log('now initialised', this.pond);
    }

    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        // handle file upload here
        console.log(" handle file upload here");
        console.log(file);

        const task = this.addIssueToDb(file, file.name,'None','None','None','None','None',file.name)

        task.on(`state_changed` , (snapshot) => {
            console.log(snapshot.bytesTransferred, snapshot.totalBytes)
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //Process
            this.setState({
                uploadValue:percentage,
            })
        } , (error) => {
            //Error
            this.setState({
                message:`Upload error : ${error.message}`
            })
        } , () => {
            //Success
            this.setState({
                message: "Upload Success",
                // picture: storageRef2.child(`${getUid()}/${file.name}`).getDownloadURL() //task.snapshot.downloadURL
            })
            console.log("Success!!!!!");
            this.pond.removeFile(); // remove file from view so you can know when it's uploaded
        })
    }

    render() {

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Create Issue"
                                content={
                                    <form>
                                        <Row>
                                            <Col md={10}>
                                                <FormInputs
                                                    ncols={["col-md-8"]}
                                                    properties={[
                                                        {
                                                            label: "Title",
                                                            type: "text",
                                                            id: "title",
                                                            bsClass: "form-control",
                                                            placeholder: "Title",
                                                        }
                                                    ]}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Dropdown options={colours} onChange={this._onSelectColour} placeholder="Colour" />
                                            </Col>
                                            <Col md={2}>
                                                <Dropdown options={priorities} onChange={this._onSelectPriority} placeholder="Priority" />
                                            </Col>
                                        </Row>
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlTextarea1">
                                                Project Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                rows="5"
                                                placeholder="Enter your description here..."
                                            />
                                        </div>
                                        <FormInputs
                                            ncols={["col-md-2", "col-md-2"]}
                                            properties={[
                                                {
                                                    label: "Affected",
                                                    type: "character",
                                                    id: "affectedversion",
                                                    bsClass: "form-control",
                                                    placeholder: "Version"
                                                },
                                                {
                                                    label: "To fix",
                                                    type: "character",
                                                    id: "versiontofix",
                                                    bsClass: "form-control",
                                                    placeholder: "Version"
                                                }
                                            ]}
                                        />

                                        <div className="Browse">
                                            <div className="Margin-25">
                                                <FilePond allowMultiple={true}
                                                          maxFiles={10}
                                                          ref= {ref => this.pond = ref}
                                                          server={{ process: this.handleProcessing.bind(this) }}
                                                          oninit={() => this.handleInit()}
                                                >

                                                    {this.state.files.map(file => (
                                                        <File key={file} source={file} />
                                                    ))}

                                                </FilePond>
                                            </div>
                                        </div>

                                        <Button bsStyle="info" pullRight fill
                                                onClick={() => waitTime(getTitle(), getDescription(), getAffectedVersion(), getVersionToFix(), getColour(), getPriority())}>
                                            Create Issue
                                        </Button>

                                        <div className="clearfix" />
                                    </form>
                                }

                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default CreateIssue;
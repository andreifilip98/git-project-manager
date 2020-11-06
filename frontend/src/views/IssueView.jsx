import React, { Component, useState } from "react";
import {Grid, Row, Col, Table} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { Tasks } from "components/Tasks/Tasks.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { thMember, tdMember } from "variables/Variables.jsx";
import {tasks_title} from "../components/Tasks/Tasks";
import Axios from "axios";
import Dropdown from "react-dropdown";
import {SolarSystemLoading} from "react-loadingg";

const Input = props => {
    return (
        <div>
            <input type="text" ref={props.inputRef} />
        </div>
    );
};

let text = [];
let currentText;

const currentIssue = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1).replace('%20', ' ');
const issueTitle = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1);

const colours = [
    'Green', 'Yellow', 'Red'
];

const priorities = [
    'Low', 'Mid', 'High'
];

const base_url = 'http://127.0.0.1:8000/';
const deploy_url = 'https://7753864ba8a6.ngrok.io/';

let addTrigger = false;

const edit = <Tooltip id="edit_tooltip">Edit</Tooltip>;

function updateProject(description) {

    Axios.patch(base_url + 'issue/update_issue_description/' + issueTitle +'/', {'description': description})
        .then(response => {
            console.log(response.data['description']);
        })
        .catch(error => {
            console.log(error.response)
        })
}


class IssueView extends Component {

    constructor(props){
        super(props);

        this.state={
            loading: true,
            issueTitle: '',
            issueDescription: '',
            issueColor: '',
            issuePriority: '',
        };

    };

    fetchIssueData() {

        fetch(base_url + 'issue/get_issue/' + currentIssue + '/', {method: 'GET'})
            .then(res => {return res.json()})
            .then(data => {
                this.setState({ loading:false });
                this.setState({ issueTitle:data.title });
                this.setState({ issueDescription:data.description });
                this.setState({ issueColor:data.colour });
                this.setState({ issuePriority:data.priority });
            })
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    state = {
        value: '',
    };

    addText = event =>
    {
        document.getElementById("textarea").disabled = false;
        document.getElementById("textarea").hidden = false;
        document.getElementById("savebutton").disabled = false;

        currentText = this.state.issueDescription;
        addTrigger = true;

        this.setState({ issueDescription: currentText });
        this.state.textareaVal = "";

    };

    activateEdit = event =>
    {
        document.getElementById("textarea").disabled = false;
        document.getElementById("textarea").hidden = false;
        document.getElementById("savebutton").disabled = false;
        document.getElementById("addtext").disabled = true;

        this.fetchIssueData();

        this.state.textareaVal = this.state.issueDescription;
        currentText = this.state.issueDescription;
        this.state.savedIssueDescription = "";
        this.setState({ issueDescription: this.state.issueDescription });
    };

    saveText = event =>
    {
        text = this.state.textareaVal;

        this.setState({ issueDescription: text });
        document.getElementById("textarea").disabled = true;
        document.getElementById("textarea").hidden = true;
        document.getElementById("savebutton").disabled = true;

        if(addTrigger)
        {
            console.log(this.state.issueDescription);

            this.state.issueDescription += this.state.textareaVal;

            console.log(this.state.textareaVal);

            this.setState({ savedIssueDescription: this.state.issueDescription});

            addTrigger = false;

            this.setState({ issueDescription: currentText + this.state.textareaVal});
            this.setState({textareaVal: currentText + this.state.textareaVal})
            updateProject(this.state.issueDescription);
            console.log('pe add');
        }else
        {
            this.setState({ issueDescription: this.state.textareaVal});
            updateProject(this.state.textareaVal);
            console.log('pe save');
        }

        console.log(this.state.textareaVal);
        console.log(this.state.issueDescription);

        document.getElementById("addtext").disabled = false;
    };

    componentDidMount() {
        this.fetchIssueData();
    }

    downloadAttachments() {

        let file = this.state.issueTitle;

        fetch(base_url + 'attachment/attachments/get_attachments_related_to_issueTitle', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({issueTitle: file}),
        })
            .then(res => res.json())
            .then(result =>
                fetch('http://127.0.0.1:8000/attachments/attachments/' + result.file.slice(25) + '/')
                    .then(response => {
                        console.log('http://127.0.0.1:8000/attachments/attachments/' + result.file.slice(25) + '/')
                        response.blob().then(blob => {
                            let url = window.URL.createObjectURL(blob);
                            let a = document.createElement('a');
                            a.href = url;
                            let downloadedFileName = result.file.slice(25);
                            a.download = downloadedFileName;
                            a.click();
                        });
                    }))
    }

    setIssueTitle() {
        const { issueTitle } = this.state
    }

    render() {

        let content;

        if (this.state.loading) {
            content = <SolarSystemLoading style={{position:'fixed', top:'50%', left:'60%'}}/>;
        } else {
            content =
                <div className="content">
                    {this.setIssueTitle()}
                    <Grid fluid>
                        <Col md={7}>
                            <Row md={6}>
                                <Card
                                    title={issueTitle}
                                    category="Issue name"
                                    content={
                                        <div className="table-full-width">
                                            <table className="table">
                                            </table>
                                        </div>
                                    }
                                />
                            </Row>
                            <Row md={8}>
                                <Card rowsMax={20} onSubmit={this.submitText}
                                      id="chartHours"
                                      title="Description"
                                      category="Issue details"
                                      content={
                                          <div >
                                              <tr>
                                                  <td>{this.state.issueDescription}</td>
                                                  <OverlayTrigger placement="top" overlay={edit}>
                                                      <Button bsStyle="info" simple type="button" bsSize="md" onClick={this.activateEdit}>
                                                          <i className="fa fa-edit" />
                                                      </Button>
                                                  </OverlayTrigger>
                                              </tr>
                                              <textarea style={{width: '100%', height: '100%'}} id="textarea"
                                                        value = {this.state.textareaVal}
                                                        onChange={(event)=>{
                                                            this.setState({
                                                                textareaVal:event.target.value
                                                            });
                                                        }}
                                              />
                                              <Button style={{marginTop: 10, marginLeft:10, _height: 20, _weigh: 30, bsSizes:'large', fontSize: 13}} onClick={this.saveText} id="savebutton">
                                                  Save
                                              </Button>
                                              <Button style={{marginTop: 10, marginLeft:10, _height: 20, _weigh: 30, bsSizes:'large', fontSize: 13}} onClick={this.addText} id="addtext">
                                                  Add
                                              </Button>
                                          </div>
                                      }
                                />
                            </Row>
                        </Col>

                        <Col md={4} style={{marginLeft: 50}}>
                            <Row sm={4}>
                                <Card
                                    title="Priorities"
                                    content={
                                        <div>
                                            <Table striped hover style={{marginTop: 2, marginLeft: -9}}>
                                                <thead>
                                                </thead>
                                                <tbody>
                                                {/*TO DO: 2 dropdowns*/}
                                                <Col md={6}>
                                                    <Dropdown options={colours} onChange={this._onSelectColour} placeholder={this.state.issueColor} />
                                                </Col>
                                                <Col md={6}>
                                                    <Dropdown options={priorities} onChange={this._onSelectPriority} placeholder={this.state.issuePriority} />
                                                </Col>
                                                </tbody>
                                            </Table>
                                        </div>
                                    }

                                />
                            </Row>
                            <Row md={4}>
                                <Card
                                    title="Attachments"
                                    content={
                                        <div>
                                            <Table striped hover style={{marginTop: 2, marginLeft: -9}}>
                                                <thead>

                                                </thead>
                                                <tbody>
                                                {tdMember.map((prop, key) => {
                                                    return (
                                                        <tr onClick={() => {console.log(prop[1])}}>
                                                            {prop.map((prop, key) => {
                                                                return <td key={key}>{prop}</td>;
                                                            })}

                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </Table>
                                            <Button style={{marginRight:0, marginTop:0, _height: 20, _weigh: 50, bsSizes:'large', fontSize: 13, backgroundColor: 'white'}} onClick={() => this.downloadAttachments()}>
                                                Download
                                            </Button>
                                        </div>
                                    }

                                />
                            </Row>
                        </Col>

                        <Row>
                        </Row>
                    </Grid>
                </div>
        }

        return (
            <div className="content">
                {content}
            </div>
        );
    }
}

export default IssueView;

import React, {Component} from "react";
import {Col, Grid, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import {Card} from "components/Card/Card.jsx";
import {Tasks} from "components/Tasks/Tasks.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {FormInputs} from "components/FormInputs/FormInputs.jsx";
import {tdMember, thMember} from "variables/Variables.jsx";
import {tasks_title} from "../components/Tasks/Tasks";
import Axios from "axios";
import { SolarSystemLoading } from 'react-loadingg';
import until from "@material-ui/core/test-utils/until";

const Input = props => {
    return (
        <div>
            <input type="text" ref={props.inputRef} />
        </div>
    );
};

let text = [];
let currentText;

const createIssuePath = '/home/createissue';
const base_url = 'http://127.0.0.1:8000/';

let addTrigger = false;

const edit = <Tooltip id="edit_tooltip">Edit</Tooltip>;
const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;


function updateProject() {

    console.log(localStorage.getItem('currentProjectName'));
    console.log(localStorage.getItem('currentProjectDescription'));

    Axios.patch(base_url + 'project/update_project/' + localStorage.getItem('currentProjectName') +'/', {'description': localStorage.getItem('currentProjectDescription')})
        .then(response => {
            console.log(response.data['description']);
        })
        .catch(error => {
            console.log(error.response)
        })
}

function deleteMember(project, member) {
    fetch(base_url + 'profile/delete_member/' + project + '/' + member + '/', {
        crossDomain : true,
        method : 'DELETE',
        headers : {
            Authorization : `JWT ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json',
        }})
        .then(res => console.log(res))
        .then(() => window.location.href = '/home/projects')
}

function DeleteMembers(member){
    console.log(localStorage.getItem('username') + '   ' + member.i);
    console.log(localStorage.getItem('priority'));

    if(localStorage.getItem('priority') == 'normal') {
        if (localStorage.getItem('username') == member.i) {
            return (
                <OverlayTrigger placement="top" overlay={remove}>
                    <Button bsStyle="danger" simple type="button" bsSize="xl"
                            onClick={() => deleteMember(localStorage.getItem('currentProjectName'), localStorage.getItem('currentMember'))}>
                        <i className="fa fa-times"/>
                    </Button>
                </OverlayTrigger>
            );
        } else {
            return (
                <div></div>
            );
        }
    }else{
        return (
            <OverlayTrigger placement="top" overlay={remove}>
                <Button bsStyle="danger" simple type="button" bsSize="xl"
                        onClick={() => deleteMember(localStorage.getItem('currentProjectName'), localStorage.getItem('currentMember'))}>
                    <i className="fa fa-times"/>
                </Button>
            </OverlayTrigger>
        );
    }
}

class ProjectView extends Component {

    addMember() {

        let email = document.getElementById("user_email").value;
        if(email === '') {
            alert("Please complete the field to add an user!")
            return;
        }
        let projectName = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1);
        let finalProjectName = projectName.split('%20').join(' ');

        fetch(base_url + 'profile/update_project/add_member', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({name: finalProjectName, email: email}),
        })
            .then(res => res.json())
            .then(pk => {
                alert("Member added successfully!")
                document.getElementById("user_email").value = ''
            })
            .then(this.forceUpdateHandler = this.forceUpdateHandler.bind(this))
            .catch(error =>
            {
                alert("Please enter a valid email!")
                document.getElementById("user_email").value = ''
            })
    }

    async fetchIssues() {

        let projectName = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1);
        let finalProjectName = projectName.split('%20').join(' ');

        await fetch(base_url + 'issue/issue/get_issues', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({name: finalProjectName}),
        })
            .then(res => res.json())
            .then(result => {
                console.log("Issues: ", result)
                let i = 0;

                while(i < result.length)
                {
                    console.log(result[i]);

                    tasks_title.push( [] );
                    tasks_title[i][0] = result[i]['title'];
                    tasks_title[i][1] = result[i]['colour'];

                    console.log(tasks_title);

                    i++;
                }
            })
            .then(this.forceUpdateHandler = this.forceUpdateHandler.bind(this))
    }

    async fetchMembers() {

        let projectName = (window.location.href).slice((window.location.href).lastIndexOf('/') + 1);
        let finalProjectName = projectName.split('%20').join(' ');

        localStorage.setItem('fetchInProgress','true')

        await fetch(base_url + 'profile/update_project/get_project_members', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({name: finalProjectName}),
        })
            .then(res => res.json())
            .then(result => {
                this.setState({
                    loading: false
                });
                console.log("Members: ", result)

                localStorage.setItem('fetchInProgress','false')

                let i = 0;
                while(i < result.length)
                {
                    console.log(result[i]);
                    tdMember.push([i, result[i]['username'], result[i]['email']]);
                    i++;
                }

            })
            .then(this.forceUpdateHandler = this.forceUpdateHandler.bind(this))
    }

    checkElementsVisibility() {
        document.getElementById("textarea").disabled = true;
        document.getElementById("textarea").hidden = true;
        document.getElementById("savebutton").disabled = true;
        document.getElementById("addtext").disabled = false;
    }

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            value: '',
            savedValue: localStorage.getItem('currentProjectDescription')
        };

    };

    forceUpdateHandler(){
        this.forceUpdate();
    };

    addText = event =>
    {
        document.getElementById("textarea").disabled = false;
        document.getElementById("textarea").hidden = false;
        document.getElementById("savebutton").disabled = false;

        currentText = this.state.savedValue;
        addTrigger = true;

        this.setState({ value: this.state.textareaVal });
        this.state.textareaVal = "";

    };

    activateEdit = event =>
    {
        // document.getElementById("textarea").disabled = false;
        document.getElementById("textarea").visible= true;
        document.getElementById("textarea").hidden = false;
        document.getElementById("savebutton").disabled = false;
        document.getElementById("addtext").disabled = true;

        console.log(this.state.savedValue);
        this.state.textareaVal = this.state.savedValue;
        currentText = this.state.savedValue;
        console.log(this.state.textareaVal);
        // this.state.savedValue = "";
        this.setState({ value: this.state.textareaVal });
        console.log(this.state.value);
        console.log(this.state.textareaVal);
    };

    saveText = event =>
    {
        text = this.state.textareaVal;

        this.setState({ savedValue: text });
        document.getElementById("textarea").disabled = true;
        document.getElementById("textarea").hidden = true;
        document.getElementById("savebutton").disabled = true;

        if(addTrigger)
        {
            console.log(this.state.savedValue);
            this.state.savedValue += this.state.textareaVal;
            console.log(this.state.textareaVal);
            this.setState({ savedValue: this.state.savedValue});
            addTrigger = false;
            localStorage.setItem('currentProjectDescription', currentText + this.state.textareaVal);
        }else
        {
            localStorage.setItem('currentProjectDescription', this.state.textareaVal);
        }

        document.getElementById("addtext").disabled = false;
        updateProject();
    };

    createLegend(json) {
        var legend = [];
        for (var i = 0; i < json["names"].length; i++) {
            var type = "fa fa-circle text-" + json["types"][i];
            legend.push(<i className={type} key={i} />);
            legend.push(" ");
            legend.push(json["names"][i]);
        }
        return legend;
    }

    componentDidMount() {
        this.fetchMembers().then(r => console.log("Fetched Members"));
        this.fetchIssues().then(r => console.log("Fetched Issues"));
    }


    render() {

        let content;

        if (this.state.loading) {
            content = <SolarSystemLoading style={{position:'fixed', top:'50%', left:'60%'}}/>;
        } else
        {
            content =

                <div className="content">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>

                    <Grid fluid>

                        <Col md={7}>
                            <Row md={8}>
                                <Card rowsMax={20} onSubmit={this.submitText}
                                      id="chartHours"
                                      title="Description"
                                      category="Project details"
                                      content={
                                          <div>
                                              <tr>
                                                  <td>{this.state.savedValue}</td>
                                                  <OverlayTrigger placement="top" overlay={edit}>
                                                      <Button bsStyle="info" simple type="button" bsSize="md"
                                                              onClick={this.activateEdit}>
                                                          <i className="fa fa-edit"/>
                                                      </Button>
                                                  </OverlayTrigger>
                                              </tr>
                                              <textarea style={{width: '100%', height: '100%'}} id="textarea"
                                                        value={this.state.textareaVal}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                textareaVal: event.target.value
                                                            });
                                                        }}
                                              />
                                              <Button style={{
                                                  marginTop: 10,
                                                  marginLeft: 10,
                                                  _height: 20,
                                                  _weigh: 30,
                                                  bsSizes: 'large',
                                                  fontSize: 13
                                              }} onClick={this.saveText} id="savebutton">
                                                  Save
                                              </Button>
                                              <Button style={{
                                                  marginTop: 10,
                                                  marginLeft: 10,
                                                  _height: 20,
                                                  _weigh: 30,
                                                  bsSizes: 'large',
                                                  fontSize: 13
                                              }} onClick={this.addText} id="addtext">
                                                  Add
                                              </Button>
                                          </div>
                                      }
                                />
                            </Row>
                            <Row md={6}>
                                <Card
                                    title="Issues"
                                    category="Project issues"
                                    content={
                                        <div className="table-full-width">
                                            <Button style={{marginTop: -100, marginLeft: 120}} onClick={() => {
                                                window.location.href = createIssuePath + "/" + (window.location.href).slice((window.location.href).lastIndexOf('/') + 1)
                                            }}>
                                                Add Issue
                                            </Button>
                                            <table className="table">
                                                <Tasks/>
                                            </table>
                                        </div>
                                    }
                                />
                            </Row>

                        </Col>

                        <Col md={4} style={{marginLeft: 50}}>
                            <Row md={4}>
                                <Card
                                    title="Members"
                                    content={
                                        <div>
                                            <Table striped hover style={{marginTop: 2, marginLeft: -9}}>
                                                <thead>
                                                <tr>
                                                    {thMember.map((prop, key) => {
                                                        return <th key={key}>{prop}</th>;
                                                    })}
                                                </tr>

                                                </thead>
                                                <tbody>
                                                {tdMember.map((prop, key) => {
                                                    return (
                                                        <tr onClick={() => {
                                                            console.log(prop[1]);
                                                            localStorage.setItem('currentMember', prop[1])
                                                        }}>
                                                            {prop.map((prop, key) => {
                                                                return <td key={key}>{prop}</td>;
                                                            })}
                                                            <DeleteMembers i={prop[1]}/>
                                                        </tr>
                                                    );

                                                })}
                                                </tbody>
                                            </Table>
                                            <div
                                                style={{display: localStorage.getItem('priority') == 'owner' ? 'block' : 'none'}}>
                                                <Col md={8}>
                                                    <FormInputs
                                                        ncols={["col-lg-30"]}
                                                        properties={[
                                                            {
                                                                type: "text",
                                                                id: "user_email",
                                                                bsClass: "form-control",
                                                                placeholder: "User email",
                                                            },
                                                        ]}
                                                    />
                                                </Col>
                                                <Col md={1}>
                                                    <Button style={{
                                                        marginRight: 0,
                                                        marginTop: 21,
                                                        _height: 20,
                                                        _weigh: 50,
                                                        bsSizes: 'large',
                                                        fontSize: 13,
                                                        backgroundColor: 'white'
                                                    }} onClick={() => this.addMember()}>
                                                        Add
                                                    </Button>

                                                </Col>
                                            </div>
                                        </div>
                                    }

                                />
                            </Row>
                        </Col>

                    </Grid>

                </div>
        }

        return (
            <div className="content">
                {content}
            </div>
        )
    }

}

export default ProjectView;

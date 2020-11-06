import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Axios from "axios"
import FormData from "form-data";


const base_url = 'http://127.0.0.1:8000/';
const deploy_url = 'https://7753864ba8a6.ngrok.io/';

function getDescription () {
    return document.getElementById("exampleFormControlTextarea1").value;
}

function getName () {
    return document.getElementById("name").value;
}

function addProjectToDb() {

    fetch(base_url + 'project/create_project/', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({name: getName(), description: getDescription()}),
        })
        .then((response) => {
            console.log(response.data)
            console.log(response.status + " " + response.statusText)
        })
        .then(() => {
            presentApp()
        })
        .catch(error => {
            console.log(error)
        })
}

function emptyFields() {
    document.getElementById("exampleFormControlTextarea1").value = null;
    document.getElementById("name").value = null;
}

function presentApp() {

    let path = '/home/projects';
    window.location.href=path
}

function waitTime() {

    addProjectToDb();
}

class CreateProject extends Component{

    render(){
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={10}>
                            <Card
                                title="Add Project"
                                content={
                                    <form>
                                        <FormInputs
                                            ncols={["col-md-6"]}
                                            properties={[
                                                {
                                                    label: "Project Name",
                                                    id: "name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Name",
                                                },
                                            ]}
                                        />
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlTextarea1">
                                                Project Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="5"
                                                placeholder="Enter your description here..."
                                            />
                                        </div>

                                        <Button onClick={() => waitTime()} bsStyle="info" pullRight fill>
                                            Create Project
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

export default CreateProject

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
import Dropdown from "react-dropdown";

import request from 'superagent';


const base_url = 'http://127.0.0.1:8000/';
const host_url = 'http://localhost:3000/';
const git_url = 'https://cors-anywhere.herokuapp.com/https://api.github.com/user/';

let selectedPriority;

const priorities = [
    'Public', 'Private'
];

function getPriority() {
    return selectedPriority;
}

function getDescription () {
    return document.getElementById("description").value;
}

function getName () {
    return document.getElementById("name").value;
}

function getVisibility () {
    return document.getElementById("visibility");
}

function postRepo() {

    request
        .post( git_url + `repos`)
        .send({
            name: getName(),
            description: getDescription(),
            visibility: getVisibility(),
        })
        .set('Authorization', `Bearer ${localStorage.getItem('gitToken')}`)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/vnd.github.nebula-preview+json')
        .then((result) => {
            console.log(result);
            alert(result.body.name + ' repository has been created!');
            window.location.href = host_url + 'home/repos';
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

class CreateRepo extends Component{

    _onSelectPriority = (option) => {
        selectedPriority = option.label;
        console.log(selectedPriority);
    };

    render(){
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={10}>
                            <Card
                                title="Create Repository"
                                content={
                                    <form>
                                        <Row>
                                            <div className="form-group">
                                                <Col md={8}>
                                                    <FormInputs
                                                        ncols={["col-md-15"]}
                                                        properties={[
                                                            {
                                                                label: "Name",
                                                                id: "name",
                                                                type: "text",
                                                                bsClass: "form-control",
                                                                placeholder: "Name",
                                                            },
                                                        ]}
                                                    />
                                                </Col>
                                                <Col style={{paddingTop: '38px'}} md={2}>
                                                    <Dropdown id="visibility" options={priorities} onChange={this._onSelectPriority} placeholder="Visibility" />
                                                </Col>
                                            </div>
                                        </Row>
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlTextarea1">
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                rows="5"
                                                placeholder="Enter your description here..."
                                            />
                                        </div>

                                        <Button onClick={() => postRepo()} bsStyle="info" pullRight fill>
                                            Create Repository
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

export default CreateRepo

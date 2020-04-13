import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import Axios from "axios"

import SignIn from "./SignIn";

const base_url = 'http://127.0.0.1:8000/';
const GITHUB_URL = 'https://api.github.com/users/';


function getFirstName() {

    return localStorage.getItem('first_name');
}

function getLastName() {

    return localStorage.getItem('last_name');
}

function getUsername() {

    return localStorage.getItem('username');
}

function getOldUsername() {

    return document.getElementById("username").placeholder;
}

function getEmail() {

    return localStorage.getItem('email');
}

function getGithubAccount() {

    return localStorage.getItem('gitUsername');
}


function getNewUsername() {

    if (document.getElementById("username").value.length === 0)
        return document.getElementById("username").placeholder;
    else
        return document.getElementById("username").value;
}

function getNewFirstName() {

    if (document.getElementById("firstName").value.length === 0)
        return document.getElementById("firstName").placeholder;
    else
        return document.getElementById("firstName").value;

}

function getNewLastName() {

    if (document.getElementById("lastName").value.length === 0)
        return document.getElementById("lastName").placeholder;
    else
        return document.getElementById("lastName").value;

}

function getNewEmail() {

    if (document.getElementById("email").value.length === 0)
        return document.getElementById("email").placeholder;
    else
        return document.getElementById("email").value;

}

function getNewGithubAccount() {

    if (document.getElementById("github").value.length === 0)
        return document.getElementById("github").placeholder;
    else
        return document.getElementById("github").value;

}

function getGitHubAccount() {
    fetch(GITHUB_URL + localStorage.getItem('gitUsername'), {
        method : 'GET',
        headers : {
            Authorization : `JWT ${localStorage.getItem('token')}`
        }
    }).then(result =>  result.json())
        .then( res =>  {
            localStorage.setItem('userAvatar', res.avatar_url);
            localStorage.setItem('gitUsername', res.login);
            localStorage.setItem('gitProfileUrl', res.html_url);
        });
}

function updateCurrentUserData()
{
    Axios.post(base_url + 'user/update_user/', {
        'old_username': getOldUsername(),
        'username': getNewUsername(),
        'first_name': getNewFirstName(),
        'last_name': getNewLastName(),
        'email': getNewEmail(),
        'github': getNewGithubAccount(),
    })
        .then(response => {
            console.log(response);
            console.log(response.status + " " + response.statusText);
            alert("User updated successfully!");
        })
        .catch(error => {
            console.log(error)
        })

    localStorage.setItem('username', getNewUsername());
    localStorage.setItem('first_name', getNewFirstName());
    localStorage.setItem('last_name', getNewLastName());
    localStorage.setItem('email', getNewEmail());
    localStorage.setItem('gitUsername', getNewGithubAccount());

}

class UserProfile extends Component {

    componentDidMount() {
        fetch(base_url + 'profile/update_profile/get_current_profile', {
            method : 'GET',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(profile => {
                console.log('id user curent:' + profile['user']);
                localStorage.setItem('current_user', profile['user']);
                localStorage.setItem('gitUsername', profile['github_account']);
                console.log(localStorage.getItem('gitUsername'));
            })

        getGitHubAccount();
        console.log(getGithubAccount());
    }

    render() {

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Edit Profile"
                                content={
                                    <form>
                                        <FormInputs
                                            ncols={["col-md-6", "col-md-6"]}
                                            properties={[
                                                {
                                                    label: "Username",
                                                    type: "text",
                                                    id: "username",
                                                    bsClass: "form-control",
                                                    placeholder: getUsername(),
                                                },
                                                {
                                                    label: "Email address",
                                                    type: "email",
                                                    id: "email",
                                                    bsClass: "form-control",
                                                    placeholder: getEmail(),
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols={["col-md-6", "col-md-6"]}
                                            properties={[
                                                {
                                                    label: "First name",
                                                    type: "text",
                                                    id: "firstName",
                                                    bsClass: "form-control",
                                                    placeholder: getFirstName(),
                                                },
                                                {
                                                    label: "Last name",
                                                    type: "text",
                                                    id: "lastName",
                                                    bsClass: "form-control",
                                                    placeholder: getLastName(),
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols={["col-md-12"]}
                                            properties={[
                                                {
                                                    label: "GitHub account",
                                                    type: "character",
                                                    id: "github",
                                                    bsClass: "form-control",
                                                    placeholder: getGithubAccount(),
                                                }
                                            ]}
                                        />
                                        <Button onClick={() => updateCurrentUserData()}
                                                style={{marginTop: 20, marginLeft: 20, _height: 30, _weigh: 40, bsSizes: 'large'}}
                                                pullRight>
                                            Update Profile
                                        </Button>
                                        <div className="clearfix"/>
                                    </form>
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <UserCard
                                name={localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name')}
                                userName={localStorage.getItem('username')}
                                description={
                                    <div>
                                        <br />
                                        <span>
                                        {'GitHub username: ' + localStorage.getItem('gitUsername')}
                                    </span>
                                    </div>
                                }
                                image={
                                    <img src={localStorage.getItem('userAvatar')} alt="Logo" />
                                }
                                socials={
                                    <div>
                                        <Button simple onClick={() => {
                                            window.open(localStorage.getItem('gitProfileUrl'))
                                        }}>
                                            <i className="fa fa-github-square fa-lg"/>
                                        </Button>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default UserProfile

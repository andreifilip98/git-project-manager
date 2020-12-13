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
import request from 'superagent';

const base_url = 'http://127.0.0.1:8000/';
const deploy_url = 'https://7753864ba8a6.ngrok.io/';

let userGitCode;

const client_id = '8829089279a0bad3e69c';
const client_secret  = '2cb6f6ae182a54c3e435ff6ff66403d9fb131dd6';

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

function getGitUserhubUsername() {

    return localStorage.getItem('gitUsername');
}

function getGitUserToken() {
    return localStorage.getItem('gitToken');
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

function updateCurrentUserData()
{
    Axios.post(base_url + 'user/update_user/', {
        'old_username': getOldUsername(),
        'username': getNewUsername(),
        'first_name': getNewFirstName(),
        'last_name': getNewLastName(),
        'email': getNewEmail(),
    })
        .then(response => {

            console.log(response);
            console.log(response.status + " " + response.statusText);

            alert("User updated successfully!");

        })
        .catch(error => {
            console.log(error)
        });

    localStorage.setItem('username', getNewUsername());
    localStorage.setItem('first_name', getNewFirstName());
    localStorage.setItem('last_name', getNewLastName());
    localStorage.setItem('email', getNewEmail());

}

function gitAuthRedirect()
{
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=8829089279a0bad3e69c&scope=repo%20delete_repo';
}

function gitAccesToken(gitCode)
{
    let client_token;

    request
        .post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token')
        .send({
            client_id: client_id,
            client_secret: client_secret,
            code: gitCode,
        })
        .set('X-Requested-With', 'XMLHttpRequest')
        .then(function(result){

            console.log(result.body);
            client_token = result.body.access_token;
            console.log(client_token + ' token response');
            localStorage.setItem('gitToken', client_token);
        }).then(response => {
            Axios.post(base_url + 'user/update_user/', {
                'old_username': getOldUsername(),
                'username': getNewUsername(),
                'first_name': getNewFirstName(),
                'last_name': getNewLastName(),
                'email': getNewEmail(),
                'git_token': localStorage.getItem('gitToken'),
            });
            alert('GitHub account authorized!');
            window.location.href = window.location.href.split('callback')[0];
        }
    ).then(result => {
        console.log("Axios post done!    " + localStorage.getItem('gitToken'));
    })
        .catch(error => {
            console.log(error)
        })
}

class UserProfile extends Component {

    getGitUser()
    {
        request
            .get('https://cors-anywhere.herokuapp.com/https://api.github.com/user')
            .set('Authorization', `Bearer ${localStorage.getItem('gitToken')}`)
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .set('X-GitHub-Media-Type', 'github.v3')
            .then(result => result.body)
            .then(result => {

                console.log(result.login);

                localStorage.setItem('gitUsername', result.login);
                localStorage.setItem('userAvatar', result.avatar_url);
                localStorage.setItem('gitUsername', result.login);
                localStorage.setItem('gitProfileUrl', result.html_url);
            })
            .then(this.forceUpdateHandler = this.forceUpdateHandler.bind(this))
            .catch(error => {
                console.log(error)
            })
    }

    constructor(props) {
        super(props);
        this.state={};

        this.getGitUser();
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    componentDidMount() {


        if(window.location.href.match('callback'))
        {
            let callbackURL = window.location.href;
            let splitCallback = callbackURL.split('=');
            userGitCode = splitCallback[1];

            console.log(userGitCode);

            gitAccesToken(userGitCode);

        }else
        {
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
                    localStorage.setItem('gitToken', profile['git_token']);
                    console.log( ' *CURRENT PROFILE TOKEN*  ' + profile['git_token']);
                });
        }

        console.log(getGitUserToken());
    }

    render() {

        return (
            <div data-testid="button" className="content">
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
                                        <Button onClick={() => updateCurrentUserData()}
                                                style={{marginTop: 20, marginLeft: 20, _height: 30, _weigh: 40, bsSizes: 'large'}}
                                                pullRight>
                                            Update Profile
                                        </Button>
                                        <Button onClick={() => gitAuthRedirect()} id='gitButton'
                                                style={{marginTop: 20, marginLeft: 20, _height: 30, _weigh: 40, bsSizes: 'large'}}
                                                pullRight>
                                            Authorize GitHub
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
                                        { localStorage.getItem('gitUsername') !== '' ? 'GitHub username: ' + localStorage.getItem('gitUsername') : ''}
                                    </span>
                                    </div>
                                }
                                image={
                                    <img
                                        src={localStorage.getItem('userAvatar')} alt="Logo"/>
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

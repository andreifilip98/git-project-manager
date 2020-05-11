import React, { Component } from "react";
import {Grid, Row, Col, Table, OverlayTrigger, Tooltip, Popover, Overlay} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { thArray, tdArray, repoArray } from "variables/Variables.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {SolarSystemLoading} from "react-loadingg";
import request from "superagent";

let projectPath = '/home/repos/';
let createProjectPath = '/home/createrepo';

let projectsArray = [];
let otherProjectsArray = [];

const base_url = 'http://127.0.0.1:8000/'

const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;

function deleteProject(project) {
    fetch(base_url + 'project/delete_project/' + project + '/',{
        crossDomain : true,
        method : 'DELETE',
        headers : {
            Authorization : `JWT ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json',
        }
    })
        .then(res => console.log(res))
}

let repos;

let loading = true;



class Repositories extends Component {

    getRepos()
    {
        request
            .get(`https://cors-anywhere.herokuapp.com/http://api.github.com/users/${localStorage.getItem('gitUsername')}/repos`)
            .set('Authorization', `Bearer ${localStorage.getItem('gitToken')}`)
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .set('X-GitHub-Media-Type', 'github.v3')
            .then((result) => result.body)
            .then((result) => {
                repos = result;
                console.log(repos);
                this.setState({
                    loading: false
                });
            })
            .then(this.forceUpdateHandler = this.forceUpdateHandler.bind(this))
            .catch(error => {
                console.log(error)
            })
    }

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            userProjects: ""
        };


    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    componentDidMount() {
        this.getRepos();
    }

    render() {

        let content;

        if (this.state.loading) {
            content = <SolarSystemLoading style={{position:'fixed', top:'50%', left:'60%'}}/>;
        } else {
            content = <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Repositories"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                        <tr >
                                            {repoArray.map((prop, key) => {
                                                return <th key={key}>{prop}</th>;
                                            })}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {repos.map((prop, key) => {
                                            return (
                                                <tr >
                                                    <td key={key}>{key}</td>
                                                    <td key={key}>{repos[key].name}</td>
                                                    <td key={key}>{repos[key].owner.login}</td>

                                                    <OverlayTrigger placement="top" overlay={remove}>
                                                        <Button bsStyle="danger" simple type="button" bsSize="xl" onClick={(event) => {deleteProject(prop[1]);event.stopPropagation()}}>
                                                            <i className="fa fa-times" />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </tr>

                                            );

                                        })}


                                        </tbody>

                                        <Button style={{marginTop: 20, marginLeft: 20, _height: 30, _weigh: 40, bsSizes: 'large'}}
                                                onClick={() => {
                                                    window.location.href = createProjectPath
                                                }}>
                                            Create Repository
                                        </Button>
                                    </Table>

                                }
                            />
                        </Col>


                    </Row>
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

export default Repositories;

import React, { Component } from "react";
import {Grid, Row, Col, Table, OverlayTrigger, Tooltip, Popover, Overlay} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import {SolarSystemLoading} from "react-loadingg";

let projectPath = '/home/projects/projectview/';
let createProjectPath = '/home/createproject';

let projectsArray = [];
let otherProjectsArray = [];

const base_url = 'http://127.0.0.1:8000/'
const deploy_url = 'https://7753864ba8a6.ngrok.io/';

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

class Projects extends Component {


    fetchProjects() {

        // Fetch other projects
        fetch(base_url + 'project/project/get_other_projects', {
            crossDomain : true,
            method : 'POST',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({user: localStorage.getItem('current_user')}),
        })
            .then(res => res.json())
            .then(profile => {
                console.log(profile);

                console.log("Projects I'm member on");
                console.log(profile);

                let i = 0;
                let j = 0;

                while(i < profile.length)
                {

                    console.log(profile[i]);

                    //push an array on next position of initial array
                    otherProjectsArray.push( [] );

                    otherProjectsArray[j][0] = j+1;
                    otherProjectsArray[j][1] = profile[i]['name'];
                    otherProjectsArray[j][2] = profile[i]['description'];

                    j++;
                    i++;
                }
            })
            .then((res) => {
                // Fetch project created by the current user
                fetch(base_url + 'project/project/get_projects', {
                    method : 'GET',
                    headers : {
                        Authorization : `JWT ${localStorage.getItem('token')}`
                    }
                })
                    .then(res => res.json())
                    .then(profile => {

                        this.setState({
                            loading: false
                        });

                        console.log("Projects created by me");
                        console.log(profile);

                        let i = 0;
                        let j = 0;

                        while(i < profile.length)
                        {
                            if(profile[i]['created_by'] == localStorage.getItem('current_user'))
                            {

                                console.log(profile[i]);

                                //push an array on next position of initial array
                                projectsArray.push( [] );

                                projectsArray[j][0] = j+1;
                                projectsArray[j][1] = profile[i]['name'];
                                projectsArray[j][2] = profile[i]['description'];

                                j++;
                            }
                            i++;
                        }
                    })
                    .then(this.forceUpdateHandler = this.forceUpdateHandler.bind(this))
            })
    }

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            userProjects: ""
        }
    }

    forceUpdateHandler(){
        this.forceUpdate();
    };

    componentDidMount() {
        this.fetchProjects();
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
                                title="Personal Projects"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                        <tr >
                                            {thArray.map((prop, key) => {
                                                return <th key={key}>{prop}</th>;
                                            })}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {projectsArray.map((prop, key) => {
                                            return (
                                                <tr key={key} onClick={() => {
                                                    window.location.href = projectPath + prop[1]

                                                    localStorage.setItem('currentProjectOwner', prop[0]);
                                                    localStorage.setItem('currentProjectName', prop[1]);
                                                    localStorage.setItem('currentProjectDescription', prop[2]);
                                                    localStorage.setItem('priority', 'owner');

                                                    console.log(prop);
                                                }}>

                                                    {

                                                        prop.map((prop, key) => {
                                                            return <td key={key}>{prop}</td>;
                                                            console.log(prop);
                                                        })
                                                    }
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
                                            Create Project
                                        </Button>
                                    </Table>

                                }
                            />
                        </Col>

                        <Col md={12}>
                            <Card
                                title="Other Projects"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table hover>
                                        <thead>
                                        <tr>
                                            {thArray.map((prop, key) => {
                                                return <th key={key}>{prop}</th>;
                                            })}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {otherProjectsArray.map((prop, key) => {
                                            return (
                                                <tr key={key} onClick={() => {
                                                    window.location.href = projectPath + prop[1]
                                                    localStorage.setItem('currentProjectOwner', prop[0]);
                                                    localStorage.setItem('currentProjectName', prop[1]);
                                                    localStorage.setItem('currentProjectDescription', prop[2]);
                                                    localStorage.setItem('priority', 'normal');
                                                }}>
                                                    {prop.map((prop, key) => {
                                                        return <td key={key}>{prop}</td>;
                                                    })}
                                                </tr>
                                            );
                                        })}
                                        </tbody>
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

export default Projects;

import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from "../SignIn";
import CreateIssue from "../CreateIssue";
import CreateProject from "../CreateProject";
import CreateRepo from "../CreateRepo";
import ForgotPassword from "../Forgot password";
import Icons from "../Icons";
import IssueView from "../IssueView";
import Projects from "../Projects";
import ProjectView from "../ProjectView";
import Repositories from "../Repositories";
import SignUp from "../SignUp";
import Typography from "../Typography";
import UserProfile from "../UserProfile";

import "@testing-library/jest-dom/extend-expect";

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<SignIn></SignIn>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<CreateProject></CreateProject>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<CreateIssue></CreateIssue>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<CreateRepo></CreateRepo>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<ForgotPassword></ForgotPassword>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<Icons></Icons>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<IssueView></IssueView>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<Projects></Projects>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<ProjectView></ProjectView>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<Repositories></Repositories>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<SignUp></SignUp>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<Typography></Typography>, div)
});

it('renders without crashing', () =>{
   const div = document.createElement("div");
    ReactDOM.render(<UserProfile></UserProfile>, div)
});
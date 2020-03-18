import React from "react";
import ReactDOM from "react-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import { Component } from "react";
import AdminLayout from "layouts/Admin.jsx";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import CreateProject from "./views/CreateProject";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


ReactDOM.render(

    <BrowserRouter>
        <Switch>
            <Route path="/home" render={props => <AdminLayout {...props} />} />
            {/*<Redirect from="/" to='/signup' />*/}
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            {/*<Route path="/resetpassword" component={ResetPassword} />*/}
            {/*<Route path="/home/user" component={Dashboard} />*/}
            <Route path='/createproject' component={CreateProject} />
            {/*<Route path="/createissue" component={CreateIssue} />*/}
            <Redirect to='/signin' />
        </Switch>
    </BrowserRouter>,

document.getElementById("root")
);

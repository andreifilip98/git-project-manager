import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import SignIn from "./SignIn";
import Axios from 'axios';
import {handleLogin} from "../App";

const base_url = 'http://127.0.0.1:8000/';
const deploy_url = 'https://7753864ba8a6.ngrok.io/';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function getFirstName() {
    return document.getElementById("firstName").value;
}

function getLastName() {
    return document.getElementById("lastName").value;
}

function getUsername() {
    return document.getElementById("username").value;
}

function getEmail() {
    return document.getElementById("email").value;
}


function getPassword() {
    return document.getElementById("password").value;
}

function register() {
    Axios.post(base_url + 'user/create_user/', {
        'user' : {
            'first_name' : getFirstName(),
            'last_name' : getLastName(),
            'username' :  getUsername(),
            'email' : getEmail(),
            'password' : getPassword()
        }})
        .then(response => {
            console.log(response)
            console.log(response.status + " " + response.statusText)
        })
        .then(function(){
			window.location.href = "/signin";
		})
        .catch(error => {
            console.log(error)
        })
}


class SignUp extends Component {

    render() {

        const classes = this.props;

        return (

            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <div className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"

                                />
                            </Grid>
                        </Grid>
                        <Button onClick={() => register()}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Container>
        );
    }
}

export default SignUp;

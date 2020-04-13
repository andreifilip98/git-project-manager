import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import App, {handleLogin} from "../App";

const base_url = 'http://127.0.0.1:8000/';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function getUsername() {
    return document.getElementById("username").value;
}

function getPassword() {
    return document.getElementById("password").value;
}

function onSignIn() {

    getGitUsername();

     handleLogin({
        username : getUsername(),
        password : getPassword(),
    })
}

function getGitUsername()
{
    let data = {
        username: getUsername(),
        password: getPassword(),
    };

    fetch(base_url + 'token-auth/', {
		crossDomain : true,
		withCredentials : true,
		async : true,
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json',
		},
		body : JSON.stringify(data)
	})
		.then(response => response.json())
		.then(json => {
			localStorage.setItem('token', json.token);
			localStorage.setItem('logged_in', true);
			localStorage.setItem('username', json.user.username);
			localStorage.setItem('first_name', json.user.first_name);
			localStorage.setItem('last_name', json.user.last_name);
			localStorage.setItem('email', json.user.email);
			//getGitUsername();
			console.log(localStorage.getItem('gitUsername'));
			console.log(localStorage.getItem('token'));
		})
		.then(function(){
            window.location.href = "/home/user";
        	console.log(localStorage)
		});
}

class SignIn extends Component{

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        const classes = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <div className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"

                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            onClick={() => onSignIn()}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/resetpassword" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Container>
        );
    }
}

export default SignIn

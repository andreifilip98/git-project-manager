import React, { Component } from 'react';
import './App.css';
import Axios from "axios";

const base_url = 'http://127.0.0.1:8000/';

export function handleLogout() {
	// localStorage.clear()
	localStorage.removeItem('token');
	localStorage.setItem('logged_in', false);
	localStorage.setItem('username', '');
	localStorage.setItem('first_name', '');
	localStorage.setItem('last_name', '');
	localStorage.setItem('gitUsername', '');
}

export function handleLogin(data) {

	console.log(data);

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
			getGitUsername();
			console.log(localStorage.getItem('gitUsername'));
			console.log(localStorage.getItem('token'));
		})
		.then(function(){
			getGitUsername();
			window.location.href = "/home/user";
        	console.log(localStorage)
		})

}

function getGitUsername()
{
	fetch(base_url + 'profile/update_profile/get_current_profile', {
            method : 'GET',
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(profile => {
                localStorage.setItem('gitUsername', profile['github_account']);
            })
}

class App extends Component {

	constructor(props) {
		super(props)

		this.state = {
			 logged_in : localStorage.getItem('token') ? true : false,
			 username : '',
			 displayed_form : ''
		}

	}

	componentDidMount() {
		if(this.state.logged_in){
			fetch(base_url + 'user/user/get_current_user', {
				method : 'GET',
				headers : {
					Authorization : `JWT ${localStorage.getItem('token')}`
				}
			})
			.then(res => res.json())
			.then(resp => {
				this.setState({ username : resp.username })
			})
			.catch(err => console.log(err));
		}
	}

	handleLoginChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        })
	}

	handleLogout = () => {
		localStorage.removeItem('token');
		this.setState({logged_in : false, username : ''})
	}
}

export default App;

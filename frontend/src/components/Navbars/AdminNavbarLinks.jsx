import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import * as firebase from "firebase";
import {handleLogout} from "../../App";

function logOut() {
    handleLogout();
}

function presentSignOut() {
    let path = '/signin';
    window.location.href=path
}

class AdminNavbarLinks extends Component {
  render() {
    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">5</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );
    return (
      <div>
        <Nav pullRight>
            <NavItem eventKey={1} onClick={() => {logOut(); presentSignOut(); }}>
                Log out
            </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;

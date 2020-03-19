import React, { Component } from "react";

export class UserCard extends Component {
  render() {
    return (
      <div className="card card-user">
        <div className="image">
          {/*<img src={this.props.bgImage} alt="..." />*/}
        </div>
        <div className="content">
          <div className="author">
            <a href="#pabloesco">
              {/*<img*/}
              {/*  className="avatar border-gray"*/}
              {/*  src={this.props.avatar}*/}
              {/*  alt="..."*/}
              {/*/>*/}
              <img src={'https://avatars1.githubusercontent.com/u/48677174?v=4'} alt="Logo" style={{height:"1", weight:"1"}}/>
              <h4 className="title">
                {this.props.name}
                <br />
                <small>{this.props.userName}</small>
              </h4>
            </a>
          </div>
          <p className="description text-center">{this.props.description}</p>
        </div>
        <hr />
        <div className="text-center">{this.props.socials}</div>
      </div>
    );
  }
}

export default UserCard;

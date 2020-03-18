import React, { Component, useState } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

export const tasks_title = [];

const issueLabels = [
    ['Red', '#ff5222'],
    ['Yellow', '#ffef00'],
    ['Green', '#05a500'],
];

const base_url = 'http://127.0.0.1:8000/';

function KeepIssueTitle(props){
  function onClick(){
    issueView += tasks_title[props.i][0];
    window.location.href = issueView;
  }

  return(
      <Button bsStyle="info" simple type="button" bsSize="xl" onClick={() =>{onClick()}}>
        <i className="fa fa-edit" />
      </Button>
  );
}

function DeleteIssue(props) {

  const [issueName, setIssueName] = useState('');

  function onClick(){
    deleteIssue(tasks_title[props.i][0]);
    console.log(tasks_title[props.i][0]);
  }

  return(
      <Button bsStyle="danger" simple type="button" bsSize="xl" onClick={() => {onClick()}}>
        <i className="fa fa-times" />
      </Button>
  );
}

function deleteIssue(issueName) {

  if(window.confirm("Are you sure?")){
    fetch(base_url + 'issue/delete_issue/' + issueName + '/', {method: 'DELETE'})
        .then(res => res.json())
        .then(data => console.log(data))
  }
}

function IssueLabel(props){

  let colour;

  if(tasks_title[props.i][1] == issueLabels[0][0]){
    colour = issueLabels[0][1];
  }else if(tasks_title[props.i][1] == issueLabels[1][0]){
    colour = issueLabels[1][1];
  }else{
    colour = issueLabels[2][1];
  }

  return (
      <td width="20px"><div style={{border: '2px', backgroundColor:colour, margin: '10px', borderRadius: '5px', padding: '10px'}}/></td>
  );
}

let issueView = '/home/issueview/';

export class Tasks extends Component {

  static issueTitle(currentIssueTitle){return currentIssueTitle};

  handleCheckbox = event => {
    const target = event.target;
    console.log(event.target);
    this.setState({
      [target.name]: target.checked,
    });
  };
  render() {
    const edit = <Tooltip id="edit_tooltip">Edit Task</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;
    var tasks = [];
    var number;
    for (var i = 0; i < tasks_title.length; i++) {
      console.log(tasks_title[i] + ' ' + i);
      number = "checkbox" + i;
      tasks.push(
          <tr key={i}>
            <td>
              <IssueLabel i={i}>
              </IssueLabel>
            </td>
            <td>{tasks_title[i][0]}</td>
            <td className="td-actions text-right">
              <OverlayTrigger placement="top" overlay={edit}>
                <KeepIssueTitle i={i}>
                </KeepIssueTitle>
              </OverlayTrigger>

              <OverlayTrigger placement="top" overlay={remove}>
                <DeleteIssue i={i}>
                </DeleteIssue>
              </OverlayTrigger>
            </td>
          </tr>
      );
    }
    return <tbody>{tasks}</tbody>;
  }
}

export default Tasks;

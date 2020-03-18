import ProjectView from "views/ProjectView.jsx";
import UserProfile from "views/UserProfile.jsx";
import Projects from "views/Projects.jsx";
import SignUp from "./views/SignUp";
import SignIn from "./views/SignIn";
import CreateProject from "views/CreateProject.jsx";
import CreateIssue from "./views/CreateIssue";
import IssueView from "./views/IssueView";

const dashboardRoutes = [
  {
    path: "/projects/projectview",
    name: "Project View",
    component: ProjectView,
    layout: "/home",
  },
  {
    path: "/issueview",
    name: "Issue View",
    component: IssueView,
    layout: "/home",
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/home"
  },
  {
    path: "/projects",
    name: "Projects",
    icon: "pe-7s-note2",
    component: Projects,
    layout: "/home"
  },
  {
    path: "/createproject",
    name: "New Project",
    component: CreateProject,
    layout: "/home"
  },
  {
    path: "/createissue",
    name: "New Issue",
    component: CreateIssue,
    layout: "/home"
  },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "pe-7s-news-paper",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "pe-7s-science",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "pe-7s-map-marker",
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications,
  //   layout: "/admin"
  // },
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "pe-7s-rocket",
  //   component: Upgrade,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;

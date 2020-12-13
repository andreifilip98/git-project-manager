import React from 'react';
import ReactDOM from 'react-dom';
import "@testing-library/jest-dom/extend-expect";
import {
    render,
    fireEvent,
    cleanup,
} from "@testing-library/react";
import SignIn from "../../SignIn";
import SignUp from "../../SignUp";

afterEach(cleanup);

test("make sure sign in submit button works", async () => {
   const { getByTestId } = render(
       <SignIn />
       );

    const submitButton = getByTestId("submit");

   fireEvent.click(submitButton);
});

test("make sure sign up button works", async () => {
   const { getByTestId } = render(
       <SignUp />
       );

    const signUpButton = getByTestId("signup");

   fireEvent.click(signUpButton);
});

test("make sure there is a username field in sign up", async () => {
   const { getByTestId } = render(
       <SignUp />
       );

    const signUpUsername = getByTestId("username");

   expect(signUpUsername).toHaveTextContent('Username');
});

test("make sure there is a password field in sign up", async () => {
   const { getByTestId } = render(
       <SignUp />
       );

    const signUpPass = getByTestId("pass");

   expect(signUpPass).toHaveTextContent('Password');
});

test("make sure there is a username field in sign in", async () => {
   const { getByTestId } = render(
       <SignIn />
       );

    const signInUsername = getByTestId("username");

   expect(signInUsername).toHaveTextContent('Username');
});

test("make sure there is a password field in sign in", async () => {
   const { getByTestId } = render(
       <SignIn />
       );

    const signInPass = getByTestId("pass");

   expect(signInPass).toHaveTextContent('Password');
});
import React from "react";
import Auth from "../../shared/Auth";
import {Redirect} from "react-router-dom";

export function Logout() {
    Auth.logout();
    return (
      <Redirect to="/login"/>
    );
}
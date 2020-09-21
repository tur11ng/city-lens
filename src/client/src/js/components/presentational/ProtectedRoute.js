import React from "react";
import { Route, Redirect } from "react-router-dom";

export const ProtectedRoute = ({
  component: Component,
  authCheck,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (authCheck()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
/*              to={{
                pathname: "/login",
                state: {
                  from: props.location
                }
              }}*/
                to="/login"
            /> 
          );
        }
      }}
    />
  );
};

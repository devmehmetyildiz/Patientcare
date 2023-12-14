import { AuthContext } from '../../Provider/AuthProvider';
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, location, ...rest }) => {
    const context = useContext(AuthContext);
   
    return (
        <Route
            {...rest}
            render={(props) => {
                if (context.token) return <Component {...props} />;
                if (!context.token)
                    return (
                        location && location?.pathname !== "/Login" ?
                            <Redirect to={`/Login?redirecturl=${location.pathname}`} /> :
                            <Redirect to={{ pathname: "/Login", state: { from: location } }} />
                    );
            }}
        />
    );
};

export default ProtectedRoute;
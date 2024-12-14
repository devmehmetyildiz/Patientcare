import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute, Spinner } from './Components'


const Departments = lazy(() => import('./Containers/Departments/Departments'));

const PasswordReset = lazy(() => import('./Containers/Auth/PasswordReset'));

const Notfoundpage = lazy(() => import('./Components/Notfoundpage'));

class Routes extends Component {
  render() {

    const routes = [
      { exact: true, path: "/", auth: false, component: PasswordReset },
      { exact: true, path: "/Create", auth: false, component: Departments },
      { exact: false, path: "*", auth: false, component: Notfoundpage }
    ]

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {routes.map((route, index) => {
            return route.auth === true ? (((roles || []).includes('admin') || (roles || []).includes(route.permission)) ? <ProtectedRoute key={index} exact={route.exact} path={route.path} component={route.component} /> : null) :
              <Route key={index} exact={route.exact} path={route.path} component={route.component} />
          })}
        </Switch>
      </Suspense>
    );
  }
}

export default Routes;

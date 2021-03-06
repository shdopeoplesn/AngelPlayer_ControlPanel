import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

import {UIList,UIDetail, UISearch} from './Connection';

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
const routes = [
  {
    path: "/list",
    component: UIList
  },
  {
    path: "/detail/:id",
    component: Detail,
  },
  {
    path: "/search/:id",
    component: Search,
  }
];

export default function RouteConfigExample() {
  return (
    <Router>
      <div>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Route exact path="/">
            <UIList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

function Detail() {
  let { id } = useParams();
  return <UIDetail cid={id}/>;
}

function Search() {
  let { id } = useParams();
  return UISearch(id);
}
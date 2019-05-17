import React from "react";
import MainPage from "./MainPage";
import OtherPage from "./OtherPage";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Pge</Link>
        </header>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/otherpage" component={OtherPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;

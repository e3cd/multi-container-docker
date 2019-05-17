import React from "react";
import { shallow } from "enzyme";
import App from "./../App";
import MainPage from "components/MainPage";

let wrapped;

beforeEach(() => {
  wrapped = shallow(<App />);
});

it("shows the main page", () => {});

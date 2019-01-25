import React, { Component } from "react";
import { Route } from "react-router";
import Layout from "./layout/Layout";
import Home from "./home/Home";
import Workspace from "./workspace/Workspace";

class App extends Component {
    render() {
        return (
            <Layout>
                <Route exact path="/" component={Home} />
                <Route path="/workspace" component={Workspace} />
                {/* <Route path="/fetch-data" component={FetchData} /> */}
            </Layout>
        );
    }
}

export default App;

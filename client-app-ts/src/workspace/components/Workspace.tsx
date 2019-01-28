import React, { Component } from "react";
import { Route, Switch } from "react-router";
import WorkspaceDashboard from "./dashboard/WorkspaceDashboard";
import WorkspaceList from "./list/WorkspaceList";

interface IProps {}
interface IState {}

class Workspace extends Component<IProps, IState> {
    public render(): JSX.Element {
        return (
            <div>
                <Switch>
                    <Route
                        path="/workspace/:workspaceName"
                        component={WorkspaceDashboard}
                    />
                    <Route path="/workspace" component={WorkspaceList} />
                </Switch>
            </div>
        );
    }
}

export default Workspace;

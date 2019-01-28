import React, { Component } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import { autobind } from "../../../shared/Autobind";
import { eventService } from "../../../shared/EventService";
import { TerminalWindow } from "../../../terminal/Terminal";
import { sendWorkspaceCommandToServer } from "../../command/SendWorkspaceCommandToServer";
import {
    getWorkspaceList,
    startWorkspaceConnection
} from "../../connection/WorkspaceConnectionActions";
import { IWorkspace } from "../../model/IWorkspaceState";
import {
    getWorkspaceByName,
    WORKSPACE_STORE_CHANGED
} from "../../store/WorkspaceStore";
import WorkspaceTerminal from "../terminal/WorkspaceTerminal";
import WorkspaceEditor from "../editor/WorkspaceEditor";
import { NavLink } from "react-router-dom";
import { Terminal } from "../../../shared/Terminal";

interface IProps extends RouteComponentProps<{ workspaceName: string }> {}
interface IState {
    workspace: IWorkspace;
}

class WorkspaceDashboard extends Component<IProps, IState> {
    state: IState = {
        workspace: getWorkspaceByName(this.props.match.params.workspaceName)
    };
    public async componentDidMount() {
        eventService.on(
            WORKSPACE_STORE_CHANGED,
            this.onWorkspaceStoreChanged,
            this
        );
        await startWorkspaceConnection();
        await getWorkspaceList();
    }
    public render(): JSX.Element {
        const { workspace } = this.state;
        if (!workspace) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                <h1>{workspace.name} - Workspace Dashboard</h1>
                <div>
                    <NavLink to={`/workspace/${workspace.name}`} exact>
                        Editor
                    </NavLink>
                    {" | "}
                    <NavLink to={`/workspace/${workspace.name}/terminal`}>
                        Terminal
                    </NavLink>
                </div>
                <Switch>
                    <Route
                        path={`/workspace/${workspace.name}/terminal`}
                        render={() => (
                            <WorkspaceTerminal workspace={workspace} />
                        )}
                    />
                    <Route
                        path={[`/workspace/${workspace.name}`]}
                        render={() => <WorkspaceEditor workspace={workspace} />}
                    />
                </Switch>
                <pre>{JSON.stringify(this.state, null, 4)}</pre>
            </div>
        );
    }
    private onWorkspaceStoreChanged() {
        this.setState({
            workspace: getWorkspaceByName(this.props.match.params.workspaceName)
        });
    }
    @autobind
    private onCommand(
        command: string,
        onResponse: (response: string) => void,
        onStartTerminal: () => void
    ) {
        sendWorkspaceCommandToServer({
            workspace: this.state.workspace.name,
            command
        }).then(response => {
            onResponse(response);
            onStartTerminal();
        });
    }
}

export default WorkspaceDashboard;

import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { eventService } from "../../../shared/EventService";
import {
    getWorkspaceList,
    startWorkspaceConnection
} from "../../connection/WorkspaceConnectionActions";
import { IWorkspace } from "../../model/IWorkspaceState";
import WorkspaceStore, {
    WORKSPACE_STORE_CHANGED
} from "../../store/WorkspaceStore";

interface IProps {}
interface IState {
    workspaceList: IWorkspace[];
}

class WorkspaceList extends Component<IProps, IState> {
    state: IState = {
        workspaceList: WorkspaceStore.get().workspaceList
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
        const { workspaceList } = this.state;
        return (
            <div>
                <h1>Workspace List</h1>
                {workspaceList.map(workspace => (
                    <NavLink
                        key={workspace.name}
                        to={`/workspace/${workspace.name}`}
                    >
                        ({workspace.name})
                    </NavLink>
                ))}
            </div>
        );
    }
    private onWorkspaceStoreChanged() {
        const { workspaceList } = WorkspaceStore.get();
        this.setState({
            workspaceList
        });
    }
}

export default WorkspaceList;

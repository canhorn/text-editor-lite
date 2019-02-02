import React, { Component, MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { eventService } from "../../../shared/EventService";
import {
    getWorkspaceList,
    startWorkspaceConnection,
    deleteWorkspace
} from "../../connection/WorkspaceConnectionActions";
import { IWorkspace } from "../../model/IWorkspaceState";
import WorkspaceStore, {
    WORKSPACE_STORE_CHANGED
} from "../../store/WorkspaceStore";
import { autobind } from "../../../shared/Autobind";
import { createWorkspace } from "../../connection/WorkspaceConnectionActions";
import { IWorkspaceCommandResponse } from "../../model/IWorkspaceCommandResponse";
import {
    showMessage,
    showErrorMessage
} from "../../../shared/components/toaster/ToasterActions";

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
                <a href="#create-workspace" onClick={this.onCreateWorkspace}>
                    Create
                </a>
                {workspaceList.map(workspace => (
                    <div>
                        <NavLink
                            className="nav-link"
                            key={workspace.name}
                            to={`/workspace/${workspace.name}`}
                        >
                            ({workspace.name})
                        </NavLink>{" "}
                        <a
                            href="#delete-workspace"
                            onClick={event =>
                                this.onDeleteWorkspace(event, workspace)
                            }
                        >
                            Delete
                        </a>
                    </div>
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
    @autobind
    private onCreateWorkspace(event: MouseEvent) {
        event.preventDefault();
        var workspace = window.prompt("Name of workspace");
        if (typeof workspace === "string") {
            createWorkspace(workspace).then(this.onCreatedWorkspace);
        }
    }
    @autobind
    private onDeleteWorkspace(event: MouseEvent, workspace: IWorkspace) {
        event.preventDefault();
        var doDelete = window.confirm(
            `Are you sure you want to delete workspace ${workspace.name}?`
        );
        if (doDelete) {
            deleteWorkspace(workspace.name).then(this.onDeletedWorkspace);
        }
    }
    @autobind
    private onCreatedWorkspace(response: IWorkspaceCommandResponse) {
        if (response.success) {
            showMessage("Successfully Created Workspace");
            getWorkspaceList();
        } else if (response.errorCode === "workspace_already_exists") {
            showErrorMessage("Cannot create workspace, already exists.");
        } else {
            showErrorMessage(`Cannot create workspace, ${response.errorCode}`);
        }
    }
    @autobind
    private onDeletedWorkspace(response: IWorkspaceCommandResponse) {
        if (response.success) {
            showMessage("Successfully Deleted Workspace");
            getWorkspaceList();
        } else if (response.errorCode === "workspace_not_found") {
            showErrorMessage("Cannot delete workspace, not found.");
        } else {
            showErrorMessage(`Cannot delete workspace, ${response.errorCode}`);
        }
    }
}

export default WorkspaceList;

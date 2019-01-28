import React, { Component } from "react";
import { autobind } from "../../../shared/Autobind";
import { TerminalWindow } from "../../../terminal/Terminal";
import { sendWorkspaceCommandToServer } from "../../command/SendWorkspaceCommandToServer";
import { IWorkspace } from "../../model/IWorkspaceState";

interface IProps {
    workspace: IWorkspace;
}
interface IState {}

export default class WorkspaceTerminal extends Component<IProps, IState> {
    public render(): JSX.Element {
        return (
            <div>
                <h2>Terminal Service</h2>
                <TerminalWindow onCommand={this.onCommand} />
            </div>
        );
    }
    @autobind
    private onCommand(
        command: string,
        onResponse: (response: string) => void,
        onStartTerminal: () => void
    ) {
        sendWorkspaceCommandToServer({
            workspace: this.props.workspace.name,
            command
        }).then(response => {
            onResponse(response);
            onStartTerminal();
        });
    }
}

import React, { Component } from "react";
import { IWorkspaceFileContent } from "../../../model/IWorkspaceState";
import { TextContentEditor } from "../../../../editor/TextContentEditor";
import { autobind } from "../../../../shared/Autobind";
import { eventService } from "../../../../shared/EventService";
import {
    SET_WORKSPACE_FILE_CONTENT_EVENT,
    SET_WORKSPACE_PENDING_SAVE_EVENT
} from "../../../store/WorkspaceStore";

interface IProps {
    fileContent: IWorkspaceFileContent | undefined;
}
interface IState {}

export default class WorkspaceFileEdit extends Component<IProps, IState> {
    public render(): JSX.Element {
        const { fileContent } = this.props;
        if (!fileContent) {
            return <div>NO FILE SELECTED</div>;
        }

        return (
            <div>
                <TextContentEditor
                    initialValue={fileContent.content}
                    onChange={this.onContentChanged}
                />
            </div>
        );
    }
    @autobind
    private onContentChanged(newValue: string) {
        const { fileContent } = this.props;
        if (fileContent && fileContent.content !== newValue) {
            fileContent.content = newValue;
            eventService.publish({
                name: SET_WORKSPACE_FILE_CONTENT_EVENT,
                data: fileContent
            });
            eventService.publish({
                name: SET_WORKSPACE_PENDING_SAVE_EVENT
            });
        }
    }
}

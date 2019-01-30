import React, { Component } from "react";
import { eventService } from "../../../shared/EventService";
import {
    getWorkspaceEditorExplorer,
    getWorkspaceFileContent
} from "../../connection/WorkspaceConnectionActions";
import {
    IWorkspace,
    IWorkspaceEditorExplorer,
    IWorkspaceFileContent
} from "../../model/IWorkspaceState";
import WorkspaceStore, {
    getWorkspaceEditorExplorerByWorkspace,
    getWorkspaceFileContentByWorkspaceFoldersFile,
    WORKSPACE_STORE_CHANGED
} from "../../store/WorkspaceStore";
import WorkspaceFileExplorer, { ISelectedFile } from "./WorkspaceFileExplorer";
import { autobind } from "../../../shared/Autobind";
import WorkspaceFileEdit from "./content/WorkspaceFileEdit";
import { CLEAR_WORKSPACE_PENDING_SAVE_EVENT } from "../../store/WorkspaceStore";
import { saveWorkspacePendingFileContent } from "../../connection/WorkspaceConnectionActions";

interface IProps {
    workspace: IWorkspace;
}
interface IState {
    editorExplorer: IWorkspaceEditorExplorer | undefined;
    selectedFile: ISelectedFile | undefined;
    fileContent: IWorkspaceFileContent | undefined;
}

export default class WorkspaceEditor extends Component<IProps, IState> {
    private saveContentHandler: number | undefined;
    state: IState = {
        editorExplorer: getWorkspaceEditorExplorerByWorkspace(
            this.props.workspace.name
        ),
        selectedFile: undefined,
        fileContent: undefined
    };

    public async componentDidMount() {
        eventService.on(WORKSPACE_STORE_CHANGED, this.onStoreChanged, this);
        await getWorkspaceEditorExplorer(this.props.workspace.name);
        this.enableAutoSave();
    }
    public componentWillUnmount() {
        eventService.off(WORKSPACE_STORE_CHANGED, this.onStoreChanged, this);
        this.disableAutoSave();
    }
    private enableAutoSave() {
        this.saveContentHandler = window.setInterval(
            () => this.saveFileContent(),
            5000
        );
    }
    private disableAutoSave() {
        window.clearInterval(this.saveContentHandler);
    }
    public render(): JSX.Element {
        const { editorExplorer, fileContent } = this.state;
        if (!editorExplorer) {
            return <div>Loading Explorer...</div>;
        }

        return (
            <div>
                <h2>Editor</h2>
                <div
                    style={{
                        display: "inline-grid",
                        gridTemplateColumns: "25% 75%",
                        width: "100%"
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            borderWidth: "thin 0px thin thin",
                            borderStyle: "solid",
                            borderColor: "gray",
                            padding: "0.1em",
                            minHeight: "20em"
                        }}
                    >
                        <WorkspaceFileExplorer
                            editorExplorer={editorExplorer}
                            onFileSelected={this.onFileSelected}
                        />
                    </div>
                    <div
                        style={{
                            height: "100%",
                            borderWidth: "thin thin thin 0px",
                            borderStyle: "solid",
                            borderColor: "gray",
                            padding: "0.1em",
                            minHeight: "20em"
                        }}
                    >
                        <WorkspaceFileEdit fileContent={fileContent} />
                    </div>
                </div>
                <pre>{JSON.stringify(editorExplorer, null, 4)}</pre>
                <pre>{JSON.stringify(fileContent, null, 4)}</pre>
            </div>
        );
    }
    @autobind
    private onStoreChanged() {
        this.setState({
            editorExplorer: getWorkspaceEditorExplorerByWorkspace(
                this.props.workspace.name
            ),
            fileContent: this.getFileContent(this.state.selectedFile)
        });
    }
    @autobind
    private onFileSelected(selectedFile: ISelectedFile): void {
        if (WorkspaceStore.get().pendingSave) {
            const { fileContent } = this.state;
            if (fileContent) {
                const savePending = confirm("Pending save");
                if (savePending) {
                    saveWorkspacePendingFileContent(fileContent);
                }
            }
            eventService.publish({
                name: CLEAR_WORKSPACE_PENDING_SAVE_EVENT
            });
        }
        getWorkspaceFileContent(
            selectedFile.workspace,
            selectedFile.folderList,
            selectedFile.fileName
        );
        this.setState({
            selectedFile,
            fileContent: this.getFileContent(selectedFile)
        });
    }
    private getFileContent(
        selectedFile: ISelectedFile | undefined
    ): IWorkspaceFileContent | undefined {
        if (!selectedFile) {
            return undefined;
        }
        return getWorkspaceFileContentByWorkspaceFoldersFile(
            selectedFile.workspace,
            selectedFile.folderList,
            selectedFile.fileName
        );
    }
    private saveFileContent() {
        if (WorkspaceStore.get().pendingSave) {
            const { fileContent } = this.state;
            if (fileContent) {
                saveWorkspacePendingFileContent(fileContent);
            }
            eventService.publish({
                name: CLEAR_WORKSPACE_PENDING_SAVE_EVENT
            });
        }
    }
}

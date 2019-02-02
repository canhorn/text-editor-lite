import React, { Component } from "react";
import { resizeEditors } from "../../../editor/EditorActions";
import { autobind } from "../../../shared/Autobind";
import { eventService } from "../../../shared/EventService";
import {
    getWorkspaceEditorExplorer,
    getWorkspaceFileContent,
    saveWorkspacePendingFileContent
} from "../../connection/WorkspaceConnectionActions";
import {
    IWorkspace,
    IWorkspaceEditorExplorer,
    IWorkspaceFileContent
} from "../../model/IWorkspaceState";
import WorkspaceStore, {
    CLEAR_WORKSPACE_PENDING_SAVE_EVENT,
    getWorkspaceEditorExplorerByWorkspace,
    getWorkspaceFileContentByWorkspaceFoldersFile,
    WORKSPACE_STORE_CHANGED
} from "../../store/WorkspaceStore";
import WorkspaceFileEdit from "./content/WorkspaceFileEdit";
import WorkspaceFileExplorer, { ISelectedFile } from "./WorkspaceFileExplorer";

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
        const maxHeight = "45em";
        const { editorExplorer, fileContent } = this.state;
        if (!editorExplorer) {
            return <div>Loading Explorer...</div>;
        }

        return (
            <div style={{ padding: ".3em" }}>
                <div
                    style={{
                        display: "inline-grid",
                        gridTemplateColumns: "25% 75%",
                        width: "100%",
                        height: "100%",
                        borderWidth: "thin",
                        borderStyle: "solid",
                        borderColor: "gray",
                        maxHeight,
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            padding: "0.1em",
                            minHeight: "20em",
                            maxHeight,
                            overflowY: "auto"
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
                            padding: "0.1em",
                            minHeight: "20em"
                        }}
                    >
                        <WorkspaceFileEdit fileContent={fileContent} />
                    </div>
                </div>
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
        resizeEditors();
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

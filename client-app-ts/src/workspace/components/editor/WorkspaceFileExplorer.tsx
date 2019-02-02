import React, { Component } from "react";
import { resizeEditors } from "../../../editor/EditorActions";
import { autobind } from "../../../shared/Autobind";
import TreeView from "../../../shared/components/my-tree-view/TreeView";
import { ITreeNode } from "../../../shared/components/my-tree-view/TreeViewModel";
import {
    showErrorMessage,
    showMessage
} from "../../../shared/components/toaster/ToasterActions";
import {
    createNewWorkspaceFile,
    createNewWorkspaceFolder,
    getWorkspaceEditorExplorer,
    removeWorkspaceFile,
    removeWorkspaceFolder
} from "../../connection/WorkspaceConnectionActions";
import { IWorkspaceCommandResponse } from "../../model/IWorkspaceCommandResponse";
import { IWorkspaceEditorExplorer } from "../../model/IWorkspaceState";
import ContextMenu, {
    getMousePosition,
    IContentMenuItem,
    IMousePosition
} from "./contextMenu/ContextMenu";
import {
    createTreeData,
    IWorkspaceFileNode,
    splitTreeDataParentFolder
} from "./CreateTreeData";

interface IProps {
    editorExplorer: IWorkspaceEditorExplorer;
    onFileSelected(selectedFile: ISelectedFile): void;
}
interface IState {
    treeData: any;
    hoverCursor?: ITreeNode<IWorkspaceFileNode>;
    cursor?: ITreeNode<IWorkspaceFileNode>;
    contextMenuOpenedAt?: IWorkspaceFileNode;
    contextMenuOpenedPosition?: IMousePosition;
    contextMenuOpenedTarget?: any;
}

export default class WorkspaceFileExplorer extends Component<IProps, IState> {
    state: IState = {
        treeData: createTreeData(this.props.editorExplorer, undefined)
    };
    public componentWillReceiveProps(nextProps: Readonly<IProps>) {
        if (this.props.editorExplorer !== nextProps.editorExplorer) {
            this.setState({
                treeData: createTreeData(
                    nextProps.editorExplorer,
                    this.state.treeData
                )
            });
        }
    }
    public render(): JSX.Element {
        const {
            treeData,
            contextMenuOpenedAt,
            contextMenuOpenedPosition,
            contextMenuOpenedTarget
        } = this.state;
        return (
            <>
                <TreeView
                    treeData={treeData}
                    onToggle={this.onToggle}
                    onHover={this.onHover}
                    onOpenContextMenu={this.onOpenContextMenu}
                    onMouseLeave={this.onMouseLeave}
                />
                <ContextMenu
                    open={!!contextMenuOpenedAt}
                    items={this.getContextMenuItems()}
                    position={contextMenuOpenedPosition}
                    target={contextMenuOpenedTarget}
                    onClose={() =>
                        this.setState({ contextMenuOpenedAt: undefined })
                    }
                />
            </>
        );
    }

    private getContextMenuItems(): IContentMenuItem[] {
        const contextMenuList: IContentMenuItem[] = [
            {
                key: "menu-item-1",
                type: "ITEM",
                label: "New Folder",
                onClick: this.onCreateNewFolder
            },
            {
                key: "menu-item-2",
                type: "ITEM",
                label: "New File",
                onClick: this.createNewFile
            }
        ];
        const { contextMenuOpenedAt } = this.state;
        if (
            contextMenuOpenedAt === undefined ||
            (contextMenuOpenedAt !== undefined &&
                contextMenuOpenedAt.name !== contextMenuOpenedAt.parentFolder)
        ) {
            contextMenuList.push(
                {
                    key: "menu-spacer-1",
                    type: "SPACER"
                },
                {
                    key: "menu-item-3",
                    type: "ITEM",
                    label: "Delete",
                    onClick: this.deleteNode
                }
            );
        }
        return contextMenuList;
    }

    @autobind
    private onCreateNewFolder() {
        const { contextMenuOpenedAt } = this.state;
        const folderName = prompt("Name of new Folder?");
        if (folderName !== null && contextMenuOpenedAt !== undefined) {
            // Split up the parentFolder by token
            let folderList = splitTreeDataParentFolder(
                contextMenuOpenedAt.parentFolder
            );
            // Get Workspace folderList[0]
            const workspace = folderList[0];
            // Get Folder List, -Workspace
            folderList = folderList.slice(1);
            createNewWorkspaceFolder(workspace, folderList, folderName).then(
                this.onWorkspaceFolderCreated
            );
        }
    }

    @autobind
    private createNewFile() {
        const { contextMenuOpenedAt } = this.state;
        const fileName = prompt("Name of new File?");
        if (fileName !== null && contextMenuOpenedAt !== undefined) {
            // Split up the parentFolder by token
            let folderList = splitTreeDataParentFolder(
                contextMenuOpenedAt.parentFolder
            );
            // Get Workspace folderList[0]
            const workspace = folderList[0];
            // Get Folder List, minus Workspace root folder
            folderList = folderList.slice(1);
            createNewWorkspaceFile(workspace, folderList, fileName).then(
                this.onWorkspaceFileCreated
            );
        }
    }

    @autobind
    private deleteNode() {
        const { contextMenuOpenedAt } = this.state;
        if (contextMenuOpenedAt !== undefined) {
            if (
                confirm(
                    `Are you sure want to delete, ${contextMenuOpenedAt.name}?`
                )
            ) {
                // Split up the parentFolder by token
                let folderList = splitTreeDataParentFolder(
                    contextMenuOpenedAt.parentFolder
                );
                // Get Workspace folderList[0]
                const workspace = folderList[0];
                // Get Folder List, minus Workspace root folder
                folderList = folderList.slice(1);

                const nodeName = contextMenuOpenedAt.name;
                if (folderList[folderList.length - 1] === nodeName) {
                    // Remove Folder
                    removeWorkspaceFolder(workspace, folderList)
                        .then(this.onWorkspaceParseCommandMessage)
                        .then((response: IWorkspaceCommandResponse) => {
                            if (response.success) {
                                showMessage("Successfully deleted folder.");
                                getWorkspaceEditorExplorer(
                                    this.props.editorExplorer.workspace
                                );
                            }
                        });
                    return;
                }
                // Remove File
                removeWorkspaceFile(workspace, folderList, nodeName)
                    .then(this.onWorkspaceParseCommandMessage)
                    .then((response: IWorkspaceCommandResponse) => {
                        if (response.success) {
                            showMessage("Successfully deleted file.");
                            getWorkspaceEditorExplorer(
                                this.props.editorExplorer.workspace
                            );
                        }
                    });
            }
        }
    }

    @autobind
    private onWorkspaceFolderCreated(response: IWorkspaceCommandResponse) {
        if (response.success) {
            showMessage("Successfully Created Workspace Folder");
            getWorkspaceEditorExplorer(this.props.editorExplorer.workspace);
        } else if (response.errorCode === "workspace_contains_file") {
            showErrorMessage("Workspace already contains a file by that name.");
        } else if (response.errorCode === "workspace_folder_exists") {
            showErrorMessage(
                "Workspace already contains a folder by that name."
            );
        } else if (response.errorCode === "workspace_folder_invalid_name") {
            showErrorMessage("Workspace folder name invalid.");
        } else {
            showErrorMessage(
                `Cannot create workspace folder, ${response.errorCode}`
            );
        }
    }
    @autobind
    private onWorkspaceFileCreated(response: IWorkspaceCommandResponse) {
        if (response.success) {
            showMessage("Successfully Created Workspace File");
            getWorkspaceEditorExplorer(this.props.editorExplorer.workspace);
        } else if (response.errorCode === "workspace_contains_file") {
            showErrorMessage("Workspace already contains a file by that name.");
        } else if (response.errorCode === "workspace_folder_exists") {
            showErrorMessage(
                "Workspace already contains a folder by that name."
            );
        } else if (response.errorCode === "workspace_file_invalid_name") {
            showErrorMessage("Workspace file name invalid.");
        } else {
            showErrorMessage(
                `Cannot create workspace file, ${response.errorCode}`
            );
        }
    }
    @autobind
    private onWorkspaceParseCommandMessage(
        response: IWorkspaceCommandResponse
    ) {
        if (!response.success) {
            showErrorMessage("Failed to delete folder.");
        }
        return response;
    }

    @autobind
    private onToggle(
        selectedNode: ITreeNode<IWorkspaceFileNode>,
        toggled: boolean
    ): void {
        this.validateNode(selectedNode, toggled);

        const workspaceNode = selectedNode as IWorkspaceFileNode;
        if (!workspaceNode.children || workspaceNode.children.length === 0) {
            // Split up the parentFolder by token
            let folderList = splitTreeDataParentFolder(
                workspaceNode.parentFolder
            );
            // Get Workspace folderList[0]
            const workspace = folderList[0];
            // Get Folder List, -Workspace
            folderList = folderList.slice(1);
            // Get FileName
            const fileName = workspaceNode.name;
            this.props.onFileSelected({
                workspace,
                folderList,
                fileName
            });
        } else {
            resizeEditors();
        }
    }
    @autobind
    private onHover(selectedNode: ITreeNode<IWorkspaceFileNode>): void {
        this.validateHoverNode(selectedNode);
    }
    @autobind
    private onOpenContextMenu(
        node: ITreeNode<IWorkspaceFileNode>,
        event: React.MouseEvent
    ): void {
        event.preventDefault();
        showMessage("onOpenContextMenu");
        this.setState({
            contextMenuOpenedAt: node as IWorkspaceFileNode,
            contextMenuOpenedPosition: getMousePosition(event),
            contextMenuOpenedTarget: event.target
        });
    }
    @autobind
    private onMouseLeave() {
        const { hoverCursor } = this.state;
        if (hoverCursor) {
            hoverCursor.hover = false;
        }
        this.setState({
            hoverCursor
        });
    }
    private validateNode(
        node: ITreeNode<IWorkspaceFileNode>,
        toggled: boolean
    ): void {
        const { cursor } = this.state;
        if (cursor) {
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({
            cursor: node
        });
    }
    private validateHoverNode(node: ITreeNode<IWorkspaceFileNode>): void {
        const { hoverCursor } = this.state;
        if (hoverCursor) {
            hoverCursor.hover = false;
        }
        node.hover = true;
        this.setState({
            hoverCursor: node
        });
    }
}

export interface ISelectedFile {
    workspace: string;
    folderList: string[];
    fileName: string;
}

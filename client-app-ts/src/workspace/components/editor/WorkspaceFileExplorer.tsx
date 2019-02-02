import React, { Component } from "react";
import { autobind } from "../../../shared/Autobind";
import TreeView from "../../../shared/components/my-tree-view/TreeView";
import { ITreeNode } from "../../../shared/components/my-tree-view/TreeViewModel";
import { IWorkspaceEditorExplorer } from "../../model/IWorkspaceState";
import {
    showMessage,
    showErrorMessage
} from "../../../shared/components/toaster/ToasterActions";
import ContextMenu from "./contextMenu/ContextMenu";
import {
    createNewWorkspaceFolder,
    getWorkspaceEditorExplorer
} from "../../connection/WorkspaceConnectionActions";
import { IWorkspaceCommandResponse } from "../../model/IWorkspaceCommandResponse";
import {
    IContentMenuItem,
    getMousePosition,
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
    cursor?: ITreeNode;
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
                    onOpenContextMenu={this.onOpenContextMenu}
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
        return [
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
                onClick: () => showMessage("Menu Item 2 Clicked")
            },
            {
                key: "menu-spacer-1",
                type: "SPACER"
            },
            {
                key: "menu-item-3",
                type: "ITEM",
                label: "Delete",
                onClick: () => showMessage("Delete")
            }
        ];
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
        } else {
            showErrorMessage(
                `Cannot create workspace folder, ${response.errorCode}`
            );
        }
    }

    @autobind
    private onToggle(selectedNode: ITreeNode, toggled: boolean): void {
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
        }
    }
    @autobind
    private onOpenContextMenu(node: ITreeNode, event: React.MouseEvent): void {
        showMessage("onOpenContextMenu");
        this.setState({
            contextMenuOpenedAt: node as IWorkspaceFileNode,
            contextMenuOpenedPosition: getMousePosition(event),
            contextMenuOpenedTarget: event.target
        });
    }
    private validateNode(node: ITreeNode, toggled: boolean): void {
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
}

export interface ISelectedFile {
    workspace: string;
    folderList: string[];
    fileName: string;
}

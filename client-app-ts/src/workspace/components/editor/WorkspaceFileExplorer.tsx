import React, { Component } from "react";
import { autobind } from "../../../shared/Autobind";
import TreeView from "../../../shared/components/my-tree-view/TreeView";
import { ITreeNode } from "../../../shared/components/my-tree-view/TreeViewModel";
import { IWorkspaceEditorExplorer } from "../../model/IWorkspaceState";
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
}

export default class WorkspaceFileExplorer extends Component<IProps, IState> {
    state: IState = {
        treeData: createTreeData(this.props.editorExplorer)
    };
    public componentWillReceiveProps(nextProps: Readonly<IProps>) {
        if (this.props.editorExplorer !== nextProps.editorExplorer) {
            this.setState({
                treeData: createTreeData(nextProps.editorExplorer)
            });
        }
    }
    public render(): JSX.Element {
        const { treeData } = this.state;
        return <TreeView treeData={treeData} onToggle={this.onToggle} />;
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

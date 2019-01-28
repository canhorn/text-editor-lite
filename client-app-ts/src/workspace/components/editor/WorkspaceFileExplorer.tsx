import React, { PureComponent } from "react";
import { autobind } from "../../../shared/Autobind";
import TreeView, {
    ITreeViewNode
} from "../../../shared/components/tree-view/TreeView";
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
}

export default class WorkspaceFileExplorer extends PureComponent<
    IProps,
    IState
> {
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

        return <TreeView treeData={treeData} onClick={this.onToggle} />;
    }

    @autobind
    private onToggle(selectedNode: ITreeViewNode): void {
        var workspaceNode = selectedNode as IWorkspaceFileNode;
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
}

export interface ISelectedFile {
    workspace: string;
    folderList: string[];
    fileName: string;
}

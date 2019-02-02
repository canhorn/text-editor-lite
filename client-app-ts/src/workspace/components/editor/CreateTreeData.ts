import { ITreeNode } from "../../../shared/components/my-tree-view/TreeViewModel";
import {
    IEditorFolder,
    IWorkspaceEditorExplorer
} from "../../model/IWorkspaceState";

const PARENT_FOLDER_TOKEN = "|||";
export const createTreeData = (
    editorExplorer: IWorkspaceEditorExplorer,
    treeData?: IWorkspaceFileNode
): IWorkspaceFileNode =>
    getFolderChildren(editorExplorer.root, editorExplorer.workspace, treeData);

const getFolderChildren = (
    folder: IEditorFolder,
    parentFolder: string,
    treeData?: IWorkspaceFileNode
): IWorkspaceFileNode => {
    const children: any[] = [];
    // TODO: Using existing TreeData keep state; toggled, active
    // Add Sub Folders
    folder.folderList.forEach(folder =>
        children.push(
            getFolderChildren(
                folder,
                `${parentFolder}${PARENT_FOLDER_TOKEN}${folder.name}`
            )
        )
    );
    // Add Files
    children.push(
        ...folder.fileNameList.map(name => ({
            parentFolder,
            name
        }))
    );
    return {
        parentFolder,
        name: folder.name,
        children
    };
};

export const splitTreeDataParentFolder = (parentFolder: string): string[] => {
    return parentFolder.split("|||");
};
export interface IWorkspaceFileNode extends ITreeNode {
    parentFolder: string;
}

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
    const children: IWorkspaceFileNode[] = [];
    // Using existing TreeData to keep state, if any; toggled, active
    // Add Sub Folders
    folder.folderList.forEach(folder =>
        children.push(
            getFolderChildren(
                folder,
                `${parentFolder}${PARENT_FOLDER_TOKEN}${folder.name}`,
                getFileNode(
                    folder.name,
                    `${parentFolder}${PARENT_FOLDER_TOKEN}${folder.name}`,
                    treeData
                )
            )
        )
    );
    // Add Files
    children.push(
        ...folder.fileNameList.map(name => ({
            parentFolder,
            name,
            active: getFileActive(parentFolder, name, treeData)
        }))
    );
    return {
        parentFolder,
        name: folder.name,
        children,
        active: treeData ? treeData.active : false,
        toggled: treeData ? treeData.toggled : false
    };
};

export const splitTreeDataParentFolder = (parentFolder: string): string[] => {
    return parentFolder.split("|||");
};
export interface IWorkspaceFileNode extends ITreeNode<IWorkspaceFileNode> {
    parentFolder: string;
}
const getFileActive = (
    name: string,
    parentFolder: string,
    treeData?: IWorkspaceFileNode
) => {
    const file = getFileNode(name, parentFolder, treeData);
    if (file) {
        return file.active;
    }
};
const getFileNode = (
    name: string,
    parentFolder: string,
    treeData?: IWorkspaceFileNode
) => {
    if (!treeData || !treeData.children) {
        return undefined;
    }
    return treeData.children.filter(
        node => node.parentFolder === parentFolder && node.name === name
    )[0];
};

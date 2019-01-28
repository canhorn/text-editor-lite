import { ITreeViewNode } from "../../../shared/components/tree-view/TreeView";
import {
    IEditorFolder,
    IWorkspaceEditorExplorer
} from "../../model/IWorkspaceState";
const PARENT_FOLDER_TOKEN = "|||";
export const createTreeData = (
    editorExplorer: IWorkspaceEditorExplorer
): IWorkspaceFileNode =>
    getFolderChildren(editorExplorer.root, editorExplorer.workspace);
const getFolderChildren = (
    folder: IEditorFolder,
    parentFolder: string
): IWorkspaceFileNode => {
    const children: any[] = [];
    // TODO: Add Sub Folders
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
export interface IWorkspaceFileNode extends ITreeViewNode {
    parentFolder: string;
}

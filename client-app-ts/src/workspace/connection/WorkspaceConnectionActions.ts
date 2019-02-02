import { IWorkspaceFileContent } from "../model/IWorkspaceState";
import { WorkspaceConnection } from "./WorkspaceConnection";

export const startWorkspaceConnection = () => WorkspaceConnection.start();
export const stopWorkspaceConnection = () => WorkspaceConnection.stop();
export const getWorkspaceList = () => WorkspaceConnection.getWorkspaceList();
export const createWorkspace = (workspace: string) =>
    WorkspaceConnection.createWorkspace(workspace);
export const createNewWorkspaceFolder = (
    workspace: string,
    folders: string[],
    folderName: string
) =>
    WorkspaceConnection.createNewWorkspaceFolder(
        workspace,
        folders,
        folderName
    );
export const createNewWorkspaceFile = (
    workspace: string,
    folders: string[],
    fileName: string
) => WorkspaceConnection.createNewWorkspaceFile(workspace, folders, fileName);
export const deleteWorkspace = (workspace: string) =>
    WorkspaceConnection.deleteWorkspace(workspace);
export const removeWorkspaceFolder = (workspace: string, folders: string[]) =>
    WorkspaceConnection.deleteWorkspaceFolder(workspace, folders);
export const removeWorkspaceFile = (
    workspace: string,
    folders: string[],
    fileName: string
) => WorkspaceConnection.deleteWorkspaceFile(workspace, folders, fileName);
export const getWorkspaceEditorExplorer = (workspace: string) =>
    WorkspaceConnection.getWorkspaceEditorExplorer(workspace);
export const getWorkspaceFileContent = (
    workspace: string,
    folders: string[],
    fileName: string
) => WorkspaceConnection.getWorkspaceFileContent(workspace, folders, fileName);
export const saveWorkspacePendingFileContent = (
    fileContent: IWorkspaceFileContent
) => WorkspaceConnection.saveWorkspacePendingFileContent(fileContent);

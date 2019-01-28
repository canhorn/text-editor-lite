export interface IWorkspaceState {
    connected: boolean;
    workspaceList: IWorkspace[];
    editorExplorerMap: Map<string, IWorkspaceEditorExplorer>;
    pendingSave: boolean;
    fileContent: Map<string, IWorkspaceFileContent>;
}

export interface IWorkspace {
    name: string;
}

export interface IWorkspaceEditorExplorer {
    workspace: string;
    root: IEditorFolder;
}
export interface IEditorFolder {
    name: string;
    folderList: IEditorFolder[];
    fileNameList: string[];
}

export interface IWorkspaceFileContent {
    fileName: string;
    folderList: string[];
    workspace: string;
    content: string;
}

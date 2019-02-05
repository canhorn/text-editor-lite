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
    languageMode?: string;
}

export const getLanguageModeFromFileName = (fileName: string): string => {
    const extension = fileName.split(".").pop() || "";

    switch (extension.toLocaleLowerCase()) {
        case "json":
            return "json";
        case "cs":
        case "csx":
            return "csharp";
        case "html":
            return "html";
        case "js":
            return "javascript";
        case "ts":
            return "typescript";
        case "xml":
            return "xml";
        case "css":
            return "css";
        case "less":
            return "less";
        case "scss":
            return "scss";
        case "sql":
            return "sql";
        case "ps1":
            return "powershell";
        case "php":
            return "php";
        case "md":
            return "markdown";
        case "java":
            return "java";
        case "dockerfile":
            return "dockerfile";
        default:
            return "plaintext";
    }
};

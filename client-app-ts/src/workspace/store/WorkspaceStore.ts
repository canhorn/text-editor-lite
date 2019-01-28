import { eventService } from "../../shared/EventService";
import {
    IWorkspace,
    IWorkspaceEditorExplorer,
    IWorkspaceFileContent,
    IWorkspaceState
} from "../model/IWorkspaceState";

const STATE: IWorkspaceState = {
    connected: false,
    workspaceList: [],
    editorExplorerMap: new Map<string, IWorkspaceEditorExplorer>(),
    pendingSave: false,
    fileContent: new Map<string, IWorkspaceFileContent>()
};
export const WORKSPACE_STORE_CHANGED: string = "WORKSPACE_STORE_CHANGED";
export const SET_WORKSPACE_LIST: string = "SET_WORKSPACE_LIST";
export const SET_WORKSPACE_EDITOR_EXPLORER: string =
    "SET_WORKSPACE_EDITOR_EXPLORER";
export const SET_WORKSPACE_FILE_CONTENT_EVENT: string =
    "SET_WORKSPACE_FILE_CONTENT_EVENT";
export const SET_WORKSPACE_PENDING_SAVE_EVENT: string =
    "SET_WORKSPACE_PENDING_SAVE_EVENT";
export const CLEAR_WORKSPACE_PENDING_SAVE_EVENT: string =
    "CLEAR_WORKSPACE_PENDING_SAVE_EVENT";
export const WORKSPACE_CONNECTED_EVENT: string = "WORKSPACE_CONNECTED_EVENT";
export const WORKSPACE_DISCONNECTED_EVENT: string =
    "WORKSPACE_DISCONNECTED_EVENT";

const setWorkspaceList = (workspaceList: IWorkspace[]) => {
    STATE.workspaceList = workspaceList;
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};
const setEditorExplorer = (editorExplorer: IWorkspaceEditorExplorer) => {
    STATE.editorExplorerMap.set(editorExplorer.workspace, editorExplorer);
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};
const createFileContentKey = (fileContent: IWorkspaceFileContent) =>
    fileContent.workspace +
    "/" +
    (fileContent.folderList || []).reduce(
        (prevFolder, currentFolder) => prevFolder + "/" + currentFolder,
        ""
    ) +
    "/" +
    fileContent.fileName;
const setFileContent = (fileContent: IWorkspaceFileContent) => {
    STATE.fileContent.set(createFileContentKey(fileContent), fileContent);
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};
const setConnectionToConnected = () => {
    STATE.connected = true;
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};
const setConnectionToDisconnected = () => {
    STATE.connected = false;
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};
const setPendingSave = () => {
    STATE.pendingSave = true;
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};
const clearPendingSave = () => {
    STATE.pendingSave = false;
    eventService.publish({ name: WORKSPACE_STORE_CHANGED });
};

eventService.on(SET_WORKSPACE_LIST, setWorkspaceList, eventService);
eventService.on(SET_WORKSPACE_EDITOR_EXPLORER, setEditorExplorer, eventService);
eventService.on(SET_WORKSPACE_FILE_CONTENT_EVENT, setFileContent, eventService);
eventService.on(
    CLEAR_WORKSPACE_PENDING_SAVE_EVENT,
    clearPendingSave,
    eventService
);
eventService.on(SET_WORKSPACE_PENDING_SAVE_EVENT, setPendingSave, eventService);
eventService.on(
    WORKSPACE_CONNECTED_EVENT,
    setConnectionToConnected,
    eventService
);
eventService.on(
    WORKSPACE_DISCONNECTED_EVENT,
    setConnectionToDisconnected,
    eventService
);

export default {
    get: () => {
        return STATE;
    }
};

export const getWorkspaceByName = (workspaceName: string): IWorkspace => {
    const { workspaceList } = STATE;
    return workspaceList.filter(
        workspace => workspace.name === workspaceName
    )[0];
};

export const getWorkspaceEditorExplorerByWorkspace = (
    workspaceName: string
): IWorkspaceEditorExplorer | undefined => {
    const { editorExplorerMap } = STATE;
    return editorExplorerMap.get(workspaceName);
};

export const getWorkspaceFileContentByWorkspaceFoldersFile = (
    workspace: string,
    folderList: string[],
    fileName: string
): IWorkspaceFileContent | undefined => {
    const key = createFileContentKey({
        workspace,
        fileName,
        folderList,
        content: ""
    });
    const { fileContent } = STATE;
    return fileContent.get(key);
};

import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { eventService } from "../../shared/EventService";
import { IWorkspaceCommandResponse } from "../model/IWorkspaceCommandResponse";
import {
    IWorkspace,
    IWorkspaceEditorExplorer,
    IWorkspaceFileContent
} from "../model/IWorkspaceState";
import {
    SET_WORKSPACE_EDITOR_EXPLORER,
    SET_WORKSPACE_FILE_CONTENT_EVENT,
    SET_WORKSPACE_LIST,
    WORKSPACE_CONNECTED_EVENT,
    WORKSPACE_DISCONNECTED_EVENT
} from "../store/WorkspaceStore";
import { getWorkspaceList } from "./WorkspaceConnectionActions";

class WorkspaceConnectionImpl {
    _connection: HubConnection | undefined = undefined;

    public async start(): Promise<void> {
        if (this._connection) {
            return;
        }
        this._connection = new HubConnectionBuilder()
            .withUrl(`/hub/workspace`, {
                accessTokenFactory: () => "super-secret-access-token"
            })
            .configureLogging(LogLevel.Information)
            .build();

        this._connection.onclose(() => this.onClose());

        try {
            const _ = await this._connection.start();
            eventService.publish({
                name: WORKSPACE_CONNECTED_EVENT
            });
            return;
        } catch (error) {
            this._connection = undefined;
            throw { code: "exception", error };
        }
    }
    public async stop() {
        if (this._connection) {
            await this._connection.stop();
        }
        this.onClose();
    }
    private onClose() {
        this._connection = undefined;
        eventService.publish({
            name: WORKSPACE_DISCONNECTED_EVENT
        });
    }

    public async getWorkspaceList(): Promise<IWorkspace[]> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const workspaceList = await this._connection.invoke("GetWorkspaceList");
        eventService.publish({
            name: SET_WORKSPACE_LIST,
            data: workspaceList
        });
        return workspaceList;
    }
    public async createWorkspace(
        workspace: string
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const workspaceCreated = await this._connection.invoke(
            "CreateWorkspace",
            workspace
        );
        // Request the updated workspace list.
        getWorkspaceList();
        return workspaceCreated;
    }
    public async createNewWorkspaceFolder(
        workspace: string,
        folders: string[],
        folderName: string
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "CreateNewWorkspaceFolder",
            workspace,
            folders,
            folderName
        );
    }
    public async createNewWorkspaceFile(
        workspace: string,
        folders: string[],
        fileName: string
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "CreateNewWorkspaceFile",
            workspace,
            folders,
            fileName
        );
    }
    public async deleteWorkspace(
        workspace: string
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const workspaceCreated = await this._connection.invoke(
            "DeleteWorkspace",
            workspace
        );
        return workspaceCreated;
    }
    public async getWorkspaceEditorExplorer(
        workspace: string
    ): Promise<IWorkspaceEditorExplorer> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const workspaceEditorExplorer = await this._connection.invoke(
            "GetWorkspaceEditorExplorer",
            workspace
        );
        eventService.publish({
            name: SET_WORKSPACE_EDITOR_EXPLORER,
            data: workspaceEditorExplorer
        });
        return workspaceEditorExplorer;
    }
    public async getWorkspaceFileContent(
        workspace: string,
        folders: string[],
        fileName: string
    ): Promise<IWorkspaceFileContent> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const workspaceFileContent = await this._connection.invoke(
            "GetWorkspaceFileContent",
            workspace,
            folders,
            fileName
        );
        eventService.publish({
            name: SET_WORKSPACE_FILE_CONTENT_EVENT,
            data: workspaceFileContent
        });
        return workspaceFileContent;
    }
    public async saveWorkspacePendingFileContent(
        fileContent: IWorkspaceFileContent
    ) {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const workspaceFileContent = await this._connection.invoke(
            "SaveWorkspaceFileContent",
            fileContent
        );
        eventService.publish({
            name: SET_WORKSPACE_FILE_CONTENT_EVENT,
            data: workspaceFileContent
        });
        return workspaceFileContent;
    }
}

export const WorkspaceConnection = new WorkspaceConnectionImpl();

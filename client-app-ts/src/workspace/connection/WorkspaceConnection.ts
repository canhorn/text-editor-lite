import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { eventService } from "../../shared/EventService";
import { IWorkspaceCommandResponse } from "../model/IWorkspaceCommandResponse";
import {
    IWorkspace,
    IWorkspaceEditorExplorer,
    IWorkspaceFileContent
} from "../model/IWorkspaceState";
import {
    WORKSPACE_CONNECTED_EVENT,
    WORKSPACE_DISCONNECTED_EVENT
} from "../store/WorkspaceStore";

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
        return await this._connection.invoke("GetWorkspaceList");
    }
    public async createWorkspace(
        workspace: string
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke("CreateWorkspace", workspace);
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
        return await this._connection.invoke("DeleteWorkspace", workspace);
    }
    public async deleteWorkspaceFolder(
        workspace: string,
        folders: string[]
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "DeleteWorkspaceFolder",
            workspace,
            folders
        );
    }
    public async deleteWorkspaceFile(
        workspace: string,
        folders: string[],
        fileName: string
    ): Promise<IWorkspaceCommandResponse> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "DeleteWorkspaceFile",
            workspace,
            folders,
            fileName
        );
    }
    public async getWorkspaceEditorExplorer(
        workspace: string
    ): Promise<IWorkspaceEditorExplorer> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "GetWorkspaceEditorExplorer",
            workspace
        );
    }
    public async getWorkspaceFileContent(
        workspace: string,
        folders: string[],
        fileName: string
    ): Promise<IWorkspaceFileContent> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "GetWorkspaceFileContent",
            workspace,
            folders,
            fileName
        );
    }
    public async saveWorkspacePendingFileContent(
        fileContent: IWorkspaceFileContent
    ): Promise<IWorkspaceFileContent> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        return await this._connection.invoke(
            "SaveWorkspaceFileContent",
            fileContent
        );
    }
}

export const WorkspaceConnection = new WorkspaceConnectionImpl();

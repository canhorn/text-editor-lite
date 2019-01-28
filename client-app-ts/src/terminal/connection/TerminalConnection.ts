import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { eventService } from "../../shared/EventService";
import {
    TERMINAL_CONNECTED_EVENT,
    TERMINAL_DISCONNECTED_EVENT
} from "../store/TerminalStore";
import { autobind } from "../../shared/Autobind";

class TerminalConnectionImpl {
    _connection: HubConnection | undefined = undefined;

    public async start(): Promise<void> {
        if (this._connection) {
            return;
        }
        this._connection = new HubConnectionBuilder()
            .withUrl(`/hub/terminal`, {
                accessTokenFactory: () => "super-secret-access-token"
            })
            .configureLogging(LogLevel.Debug)
            .build();

        this._connection.onclose(() => this.onClose());

        try {
            const _ = await this._connection.start();
            eventService.publish({
                name: TERMINAL_CONNECTED_EVENT
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
            name: TERMINAL_DISCONNECTED_EVENT
        });
    }

    @autobind
    public async sendWorkspaceCommand(
        command: IWorkspaceCommandData
    ): Promise<string> {
        if (!this._connection) {
            throw new Error("not_connected");
        }
        const response = await this._connection.invoke(
            "SendWorkspaceCommand",
            command.workspace,
            command.command
        );
        // eventService.publish({
        //     name: ADD_COMMAND_RESPONSE,
        //     data: {
        //         command,
        //         response
        //     }
        // });
        return response;
    }
}

export const TerminalConnection = new TerminalConnectionImpl();

export interface IWorkspaceCommandData {
    workspace: string;
    command: string;
}

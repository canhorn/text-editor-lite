import { IWorkspaceCommandData } from "../../terminal/connection/TerminalConnection";
import {
    startTerminalConnection,
    sendWorkspaceCommand
} from "../../terminal/connection/TerminalConnectionActions";

export const sendWorkspaceCommandToServer = async (
    command: IWorkspaceCommandData
): Promise<string> => {
    await startTerminalConnection();
    return await sendWorkspaceCommand(command);
};

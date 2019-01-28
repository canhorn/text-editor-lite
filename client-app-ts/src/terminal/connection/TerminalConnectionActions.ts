import { TerminalConnection } from "./TerminalConnection";

export const startTerminalConnection = () => TerminalConnection.start();
export const stopTerminalConnection = () => TerminalConnection.stop();
export const sendWorkspaceCommand = TerminalConnection.sendWorkspaceCommand;

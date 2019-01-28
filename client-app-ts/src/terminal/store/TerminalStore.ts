import { eventService } from "../../shared/EventService";
import { ITerminalState } from "../model/ITerminalState";

const STATE: ITerminalState = {
    connected: false
};
export const TERMINAL_STORE_CHANGED: string = "TERMINAL_STORE_CHANGED";
export const TERMINAL_CONNECTED_EVENT: string = "TERMINAL_CONNECTED_EVENT";
export const TERMINAL_DISCONNECTED_EVENT: string =
    "TERMINAL_DISCONNECTED_EVENT";

const setWorkspaceConnectionToConnected = () => {
    STATE.connected = true;
    eventService.publish({ name: TERMINAL_STORE_CHANGED });
};
const setWorkspaceConnectionToDisconnected = () => {
    STATE.connected = false;
    eventService.publish({ name: TERMINAL_STORE_CHANGED });
};

eventService.on(
    TERMINAL_CONNECTED_EVENT,
    setWorkspaceConnectionToConnected,
    eventService
);
eventService.on(
    TERMINAL_DISCONNECTED_EVENT,
    setWorkspaceConnectionToDisconnected,
    eventService
);

export default {
    get: () => {
        return STATE;
    }
};

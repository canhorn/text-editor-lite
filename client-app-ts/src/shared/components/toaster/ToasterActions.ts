import { eventService } from '../../EventService';
export const TOASTER_SHOW_MESSAGE_EVENT: string = "TOASTER_SHOW_MESSAGE_EVENT";
export const TOASTER_ENABLE_MESSAGE_EVENT: string =
    "TOASTER_ENABLE_MESSAGE_EVENT";
export const TOASTER_DISABLE_MESSAGE_EVENT: string =
    "TOASTER_DISABLE_MESSAGE_EVENT";

export const showMessage = (message: string) =>
    eventService.publish<IToasterEventData>({
        name: TOASTER_SHOW_MESSAGE_EVENT,
        data: { message, type: "info" }
    });
export const showErrorMessage = (message: string) =>
    eventService.publish<IToasterEventData>({
        name: TOASTER_SHOW_MESSAGE_EVENT,
        data: { message, type: "error" }
    });
export const enableMessages = () =>
    eventService.publish({
        name: TOASTER_ENABLE_MESSAGE_EVENT
    });
export const disableMessages = () =>
    eventService.publish({
        name: TOASTER_DISABLE_MESSAGE_EVENT
    });

export interface IToasterEventData {
    message: string;
    type: "info" | "error";
}

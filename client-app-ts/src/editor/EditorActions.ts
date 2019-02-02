import { eventService } from "../shared/EventService";
export const RESIZE_EDITOR: string = "editor.RESIZE_EDITOR";

export const resizeEditors = () =>
    eventService.publish({ name: RESIZE_EDITOR });

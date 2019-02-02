import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showMessage } from "./ToasterActions";
import { eventService } from '../../EventService';
import {
    TOASTER_ENABLE_MESSAGE_EVENT,
    TOASTER_DISABLE_MESSAGE_EVENT
} from "./ToasterActions";
import {
    IToasterEventData,
    TOASTER_SHOW_MESSAGE_EVENT
} from "./ToasterActions";

interface IState {
    messageEnabled: boolean;
}

export class ToasterContainer extends React.Component<{}, IState> {
    state: IState = {
        messageEnabled: true
    };

    public componentDidMount() {
        toast("Starting Application", {
            type: "info",
            position: "bottom-right"
        });
        eventService.on(TOASTER_SHOW_MESSAGE_EVENT, this.toastMessage, this);
        eventService.on(
            TOASTER_DISABLE_MESSAGE_EVENT,
            this.enableMessages,
            this
        );
        eventService.on(
            TOASTER_DISABLE_MESSAGE_EVENT,
            this.disableMessages,
            this
        );
    }
    public componentWillUnmount() {
        eventService.off(TOASTER_SHOW_MESSAGE_EVENT, this.toastMessage, this);
        eventService.off(
            TOASTER_ENABLE_MESSAGE_EVENT,
            this.enableMessages,
            this
        );
        eventService.off(
            TOASTER_DISABLE_MESSAGE_EVENT,
            this.disableMessages,
            this
        );
    }

    public render() {
        if (this.state.messageEnabled) {
            return <ToastContainer />;
        }
        return <span />;
    }

    private toastMessage(event: IToasterEventData) {
        toast(event.message, {
            type: event.type,
            position: "bottom-right"
        });
    }

    private enableMessages() {
        showMessage("Message Enabled");
        this.setState({
            messageEnabled: true
        });
    }

    private disableMessages() {
        showMessage("Message Disabled");
        this.setState({
            messageEnabled: false
        });
    }
}

import React, { Component } from "react";
import { autobind } from "../../../../shared/Autobind";
import { showMessage } from "../../../../shared/components/toaster/ToasterActions";
import "./ContextMenu.css";

interface IProps {
    open: boolean;
    items: IContentMenuItem[];
    position?: IMousePosition;
    target?: any | undefined;
    onClose: () => void;
}
interface IState {}

export default class ContextMenu extends Component<IProps, IState> {
    state: IState = {};
    public componentDidMount() {
        window.addEventListener("click", this.onDocumentClickCloseMenu);
        window.addEventListener(
            "contextmenu",
            this.onDocumentContextMenuCloseMenu
        );
    }
    public componentWillUnmount() {
        window.removeEventListener("click", this.onDocumentClickCloseMenu);
        window.removeEventListener(
            "contextmenu",
            this.onDocumentContextMenuCloseMenu
        );
    }
    public render(): JSX.Element {
        const { open, items, position } = this.props;
        return (
            <>
                <div
                    className={`context-menu ${open ? "active" : ""}`}
                    style={{
                        left: position ? position.x : 0,
                        top: position ? position.y : 0
                    }}
                >
                    {items.map(this.mapContextMenuItem)}
                </div>
            </>
        );
    }

    private mapContextMenuItem(item: IContentMenuItem) {
        switch (item.type) {
            case "ITEM":
                return (
                    <div
                        key={item.key}
                        className="context-menu-item"
                        onClick={item.onClick}
                    >
                        {item.label}
                    </div>
                );
            case "SPACER":
                return (
                    <div key={item.key} className="context-menu-spacer">
                        <hr />
                    </div>
                );
            default:
                return [];
        }
    }

    @autobind
    private onDocumentClickCloseMenu(event: MouseEvent) {
        event.preventDefault();
        this.props.onClose();
    }

    @autobind
    private onDocumentContextMenuCloseMenu(event: MouseEvent) {
        event.preventDefault();
        const { target } = this.props;

        if (event.target !== target) {
            this.props.onClose();
        }
    }
}

export interface IMousePosition {
    x: number;
    y: number;
}

export const getMousePosition = (event: React.MouseEvent): IMousePosition => {
    let posx = 0;
    let posy = 0;

    if (event.pageX || event.pageY) {
        posx = event.pageX;
        posy = event.pageY;
    } else if (event.clientX || event.clientY) {
        posx =
            event.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
        posy =
            event.clientY +
            document.body.scrollTop +
            document.documentElement.scrollTop;
    }

    return {
        x: posx,
        y: posy
    };
};

export interface IContentMenuItem {
    key: string;
    type: "ITEM" | "SPACER";
    label?: string;
    onClick?: () => void;
}

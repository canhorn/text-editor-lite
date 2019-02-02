import React, { Component } from "react";
import { guid } from "../shared/Guid";
import { ITerminal, Terminal } from "../shared/Terminal";
import { Logger } from "../shared/Logger";
import { autobind } from "../shared/Autobind";

interface IProps {
    onCommand: (
        message: string,
        response: (response: string) => void,
        startTerminal: () => void
    ) => void;
}
interface IState {
    id: string;
}

export class TerminalWindow extends Component<IProps, IState> {
    state = {
        id: guid()
    };
    private _logger: Logger = new Logger("TerminalWindow");
    private _terminal?: ITerminal;

    constructor(props: IProps) {
        super(props);
    }

    public componentDidMount() {
        try {
            this._terminal = new Terminal(this.state.id);
            const terminalElement = document.getElementById(this.state.id);
            if (terminalElement) {
                terminalElement.appendChild(this._terminal.html);
                this._terminal.setTextSize("1em");
                this.startTerminal();
            }
        } catch (ex) {
            this._logger.error("Exception terminal", ex);
        }
    }

    public componentWillUnmount() {
        if (this._terminal) {
            this._terminal.html.remove();
        }
    }

    public render() {
        return (
            <div
                id={this.state.id}
                style={{ height: "100%" }}
            />
        );
    }

    private onClose() {}

    private async startTerminal() {
        if (!this._terminal) {
            return;
        }
        this.onEnter(await this._terminal.input("$ Enter a command"));
    }

    @autobind
    public async onEnter(message: string): Promise<void> {
        if (!this._terminal) {
            return;
        }
        if (message === "clear") {
            this._terminal.clear();
            this.startTerminal();
            return;
        }
        this.props.onCommand(
            message,
            (response: string) => {
                if (this._terminal) {
                    this._terminal.print(response);
                }
            },
            () => this.startTerminal()
        );
    }
}

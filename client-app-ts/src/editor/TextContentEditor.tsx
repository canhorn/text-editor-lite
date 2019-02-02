import * as monaco from "monaco-editor";
import * as React from "react";
import { autobind } from "../shared/Autobind";
import { eventService } from "../shared/EventService";
import { guid } from "../shared/Guid";
import { RESIZE_EDITOR } from "./EditorActions";
import { registerEditorServiceWorker } from "./RegisterEditorServiceWorker";

registerEditorServiceWorker();

interface IProps {
    initialValue: string;
    onChange: (value: string) => void;
    language?: string;
}
interface IState {
    guid: string;
}

export class TextContentEditor extends React.Component<IProps, IState> {
    public state: IState = {
        guid: guid()
    };

    private editor: monaco.editor.IStandaloneCodeEditor | undefined;

    public componentDidMount() {
        this.editor = monaco.editor.create(
            document.getElementById(this.state.guid) as any,
            {
                theme: "vs-dark",
                value: this.props.initialValue
                // language: this.props.language || "plaintext"
            }
        );
        window.addEventListener("resize", this.onResize);
        eventService.on(RESIZE_EDITOR, this.onResize, this);
        this.editor.onDidChangeModelContent(
            (_: monaco.editor.IModelContentChangedEvent) => {
                if (this.editor) {
                    this.props.onChange(this.editor.getValue());
                }
            }
        );
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>) {
        if (!this.editor) {
            return;
        }
        if (nextProps.initialValue !== this.editor.getValue()) {
            this.editor.setValue(nextProps.initialValue);
        }
    }

    public componentWillUnmount() {
        eventService.off(RESIZE_EDITOR, this.onResize, this);
        window.removeEventListener("resize", this.onResize);
        if (this.editor) {
            this.editor.dispose();
        }
    }

    public render() {
        return <div id={this.state.guid} style={this.getStyles()} />;
    }
    private getStyles() {
        return {
            height: "98%",
            maxHeight: "800px"
        };
    }

    @autobind
    private onResize() {
        if (this.editor) {
            this.editor.layout();
        }
    }
}

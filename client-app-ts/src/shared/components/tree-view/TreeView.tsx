import React, { Component } from "react";
import { decorators, Treebeard } from "react-treebeard";
import { autobind } from "../../../shared/Autobind";
import "./TreeView.css";

export interface ITreeViewNode {
    name: string;
    children: ITreeViewNode[];
}

interface IProps {
    treeData: ITreeViewNode;
    onClick: (selectedNode: ITreeViewNode) => void;
}
interface IState {
    cursor: any | undefined;
}

decorators.Header = ({ style, node }: { style: any; node: any }) => {
    const iconType = node.children ? "folder" : "file-text";

    const iconClass = `fa fa-${iconType}`;

    const iconStyle = { marginRight: "5px" };

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle} />
                {node.name}
            </div>
        </div>
    );
};

export default class TreeView extends Component<IProps, IState> {
    state: IState = {
        cursor: undefined
    };
    public render(): JSX.Element {
        const { treeData } = this.props;

        return (
            <div className="tree-view" style={{ cursor: "pointer" }}>
                <Treebeard
                    data={treeData}
                    decorators={decorators}
                    onToggle={this.onToggle}
                />
            </div>
        );
    }

    @autobind
    onToggle(node: any, toggled: boolean) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });
        this.props.onClick(node);
    }
}

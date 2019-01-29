import PropTypes from "prop-types";
import React, { Component } from "react";
import { ITreeHeaderStyles, ITreeNode } from "../../TreeViewModel";

interface IProps {
    style: ITreeHeaderStyles;
    node: ITreeNode;
}

export default class Header extends Component<IProps, {}> {
    public static propTypes = {
        style: PropTypes.object,
        node: PropTypes.object.isRequired
    };

    render() {
        const { node, style } = this.props;
        return (
            <div style={style.base}>
                <div style={style.title}>{node.name}</div>
            </div>
        );
    }
}

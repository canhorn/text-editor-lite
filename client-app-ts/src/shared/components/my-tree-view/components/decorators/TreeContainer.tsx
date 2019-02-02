import PropTypes from "prop-types";
import React, { Component } from "react";
import { VelocityComponent } from "velocity-react";
import {
    ITreeAnimations,
    ITreeDecorators,
    ITreeNode,
    ITreeNodeStyles
} from "../../TreeViewModel";
import Header from "./TreeHeader";

interface IProps {
    style: ITreeNodeStyles;
    node: ITreeNode<any>;
    animations: ITreeAnimations;
    decorators: ITreeDecorators;
    terminal: boolean;
    onClick: () => void;
    onHover: () => void;
    onContextMenu: (event: React.MouseEvent) => void;
}

export default class Container extends Component<IProps, {}> {
    public static propTypes = {
        style: PropTypes.object.isRequired,
        decorators: PropTypes.object.isRequired,
        terminal: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        animations: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
            .isRequired,
        node: PropTypes.object.isRequired
    };
    public render() {
        const {
            style,
            terminal,
            onClick,
            onHover,
            onContextMenu,
            node
        } = this.props;

        return (
            <div
                onClick={onClick}
                onMouseEnter={onHover}
                onContextMenu={onContextMenu}
                style={style.container}
            >
                {!terminal ? this.renderToggle() : null}

                <Header node={node} style={style.header} />
            </div>
        );
    }

    renderToggle() {
        const { animations } = this.props;

        if (!animations) {
            return this.renderToggleDecorator();
        }

        return (
            <VelocityComponent
                animation={animations.toggle.animation}
                duration={animations.toggle.duration}
            >
                {this.renderToggleDecorator()}
            </VelocityComponent>
        );
    }

    renderToggleDecorator() {
        const { style, decorators } = this.props;

        return <decorators.Toggle style={style.toggle} />;
    }
}

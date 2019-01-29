import PropTypes from "prop-types";
import React, { Component } from "react";
import { VelocityComponent } from "velocity-react";
import Header from "./TreeHeader";
import {
    ITreeNodeStyles,
    ITreeAnimations,
    ITreeDecorators,
    ITreeNode
} from "../../TreeViewModel";

interface IProps {
    style: ITreeNodeStyles;
    node: ITreeNode;
    animations: ITreeAnimations;
    decorators: ITreeDecorators;
    terminal: boolean;
    onClick: () => void;
}

export default class Container extends Component<IProps, {}> {
    private clickableRef: any;
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
        const { style, terminal, onClick, node } = this.props;

        return (
            <div
                onClick={onClick}
                ref={ref => (this.clickableRef = ref)}
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

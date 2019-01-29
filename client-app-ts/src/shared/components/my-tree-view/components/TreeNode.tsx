import PropTypes from "prop-types";
import React from "react";
import { VelocityTransitionGroup } from "velocity-react";
import { autobind } from "../../../Autobind";
import {
    ITreeAnimationsFactory,
    ITreeDecorators,
    ITreeNode,
    ITreeNodeStyles
} from "../TreeViewModel";
import NodeHeader from "./TreeHeader";
import { ITreeAnimations } from "../TreeViewModel";

interface IProps {
    style: ITreeNodeStyles;
    node: ITreeNode;
    animations: ITreeAnimationsFactory | boolean;
    decorators: ITreeDecorators;
    onToggle: (node: ITreeNode, toggled: boolean) => void;
}
interface IState {}

class TreeNode extends React.Component<IProps, IState> {
    public static propTypes = {
        style: PropTypes.object.isRequired,
        node: PropTypes.object.isRequired,
        decorators: PropTypes.object.isRequired,
        animations: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
            .isRequired,
        onToggle: PropTypes.func
    };
    constructor(props: IProps) {
        super(props);
    }

    @autobind
    onClick() {
        const { node, onToggle } = this.props;
        const { toggled } = node;

        if (onToggle) {
            onToggle(node, !toggled);
        }
    }

    animations(): ITreeAnimations | false {
        const { animations, node } = this.props;

        if (animations === false) {
            return false;
        }

        const anim = Object.assign({}, animations, node.animations);
        return {
            toggle: anim.toggle(this.props),
            drawer: anim.drawer(this.props)
        };
    }

    decorators() {
        // Merge Any Node Based Decorators Into The Pack
        const { decorators, node } = this.props;
        let nodeDecorators = node.decorators || {};

        return Object.assign({}, decorators, nodeDecorators);
    }

    render() {
        const { style } = this.props;
        const decorators = this.decorators();
        const animations = this.animations();

        return (
            <li style={style.base}>
                {this.renderHeader(decorators, animations)}

                {this.renderDrawer(decorators, animations)}
            </li>
        );
    }

    renderDrawer(
        decorators: ITreeDecorators,
        animations: ITreeAnimations | false
    ): JSX.Element | any[] {
        const {
            node: { toggled }
        } = this.props;

        if (typeof animations === "boolean") {
            if (!animations && toggled) {
                return this.renderChildren(decorators);
            } else {
                return [];
            }
        }
        const { ...restAnimationInfo } = animations.drawer;
        return (
            <VelocityTransitionGroup {...restAnimationInfo}>
                {toggled ? this.renderChildren(decorators) : null}
            </VelocityTransitionGroup>
        );
    }

    renderHeader(
        decorators: ITreeDecorators,
        animations: ITreeAnimations | false
    ) {
        const { node, style } = this.props;

        return (
            <NodeHeader
                node={Object.assign({}, node)}
                animations={animations}
                decorators={decorators}
                onClick={this.onClick}
                style={style}
            />
        );
    }

    renderChildren(decorators: ITreeDecorators) {
        const {
            animations,
            decorators: propDecorators,
            node,
            style
        } = this.props;

        if (node.loading) {
            return this.renderLoading(decorators);
        }

        let children: any[] = node.children;
        if (!Array.isArray(node.children)) {
            children = [node.children];
        }

        return (
            <ul style={style.subtree}>
                {children.map((child, index) => (
                    <TreeNode
                        {...this._eventBubbles()}
                        animations={animations}
                        decorators={propDecorators}
                        key={child.id || index}
                        node={child}
                        style={style}
                    />
                ))}
            </ul>
        );
    }

    renderLoading(decorators: ITreeDecorators) {
        const { style } = this.props;

        return (
            <ul style={style.subtree}>
                <li>
                    <decorators.Loading style={style.loading} />
                </li>
            </ul>
        );
    }

    _eventBubbles() {
        const { onToggle } = this.props;

        return {
            onToggle
        };
    }
}

export default TreeNode;

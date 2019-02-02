import PropTypes from "prop-types";
import React, { CSSProperties } from "react";
import deepEqual from "../../../deep-equal/DeepEqual";
import { shallowEqualObjects } from "../../../shallow-equal/ShallowEqual";
import {
    ITreeAnimations,
    ITreeDecorators,
    ITreeNode,
    ITreeNodeStyles
} from "../TreeViewModel";

interface IProps {
    node: ITreeNode<any>;
    animations: ITreeAnimations | false;
    decorators: ITreeDecorators;
    propsData?: any;
    onClick: () => void;
    onHover: () => void;
    onContextMenu: (event: React.MouseEvent) => void;
    style: ITreeNodeStyles;
}

class NodeHeader extends React.Component<IProps, {}> {
    public static propTypes = {
        style: PropTypes.object.isRequired,
        decorators: PropTypes.object.isRequired,
        animations: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
            .isRequired,
        node: PropTypes.object.isRequired,
        onClick: PropTypes.func
    };
    shouldComponentUpdate(nextProps: any) {
        const props = this.props as any;
        const nextPropKeys = Object.keys(nextProps);

        for (let i = 0; i < nextPropKeys.length; i++) {
            const key = nextPropKeys[i];
            if (key === "animations") {
                continue;
            }

            const isEqual = shallowEqualObjects(props[key], nextProps[key]);
            if (!isEqual) {
                return true;
            }
        }

        return !deepEqual(props.animations, nextProps.animations, {
            strict: true
        });
    }

    render() {
        const {
            animations,
            decorators,
            node,
            onClick,
            onHover,
            onContextMenu,
            style
        } = this.props;
        const { hover, active, children } = node;
        const terminal = !children;
        const container = [style.link];
        if (active) {
            container.push(style.activeLink);
        }
        if (hover) {
            container.push(style.hover);
        }
        return (
            <decorators.Container
                animations={animations}
                decorators={decorators}
                node={node}
                onClick={onClick}
                onHover={onHover}
                onContextMenu={onContextMenu}
                style={this.getHeaderContainerStyles(style, container)}
                terminal={terminal}
            />
        );
    }
    private getHeaderContainerStyles(
        style: ITreeNodeStyles,
        container: (CSSProperties | null)[]
    ) {
        return Object.assign(
            {
                container: container.reduce(
                    (prevValue, currentValue) =>
                        Object.assign(prevValue, currentValue),
                    {}
                )
            },
            style
        );
    }
}

export default NodeHeader;

import PropTypes from "prop-types";
import React from "react";
import defaultDecorators from "./components/decorators/Decorators";
import defaultAnimations from "./components/defaults/TreeAnimationsDefaults";
import defaultTheme from "./components/defaults/TreeThemeDefaults";
import TreeNode from "./components/TreeNode";
import {
    ITreeAnimationsFactory,
    ITreeDecorators,
    ITreeNode,
    ITreeStyles
} from "./TreeViewModel";

interface IProps {
    style: ITreeStyles;
    treeData: any;
    animations: ITreeAnimationsFactory;
    decorators: ITreeDecorators;
    onToggle: (node: ITreeNode, toggled: boolean) => void;
}
interface IState {}

class TreeView extends React.Component<IProps, IState> {
    public static propTypes = {
        style: PropTypes.object,
        treeData: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        animations: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        onToggle: PropTypes.func,
        decorators: PropTypes.object
    };
    public static defaultProps = {
        style: defaultTheme,
        animations: defaultAnimations,
        decorators: defaultDecorators
    };
    render() {
        const {
            animations,
            decorators,
            treeData,
            onToggle,
            style
        } = this.props;
        let data = treeData;

        // Support Multiple Root Nodes. Its not formally a tree, but its a use-case.
        if (!Array.isArray(data)) {
            data = [data];
        }
        return (
            <ul style={style.base}>
                {data.map((node: ITreeNode, index: number) => (
                    <TreeNode
                        animations={animations}
                        decorators={decorators}
                        key={node.id || index}
                        node={node}
                        onToggle={onToggle}
                        style={style.node}
                    />
                ))}
            </ul>
        );
    }
}

export default TreeView;

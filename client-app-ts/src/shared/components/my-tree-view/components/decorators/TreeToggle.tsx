import PropTypes from "prop-types";
import React, { Component } from "react";
import { ITreeToggleStyles } from "../../TreeViewModel";

interface IProps {
    style: ITreeToggleStyles;
}

export default class Toggle extends Component<IProps, {}> {
    public static propTypes = {
        style: PropTypes.object
    };

    public render() {
        const { style } = this.props;
        const { height, width } = style;
        const midHeight = height * 0.5;
        const points = `0,0 0,${height} ${width},${midHeight}`;

        return (
            <div style={style.base}>
                <div style={style.wrapper}>
                    <svg height={height} width={width}>
                        <polygon points={points} style={style.arrow} />
                    </svg>
                </div>
            </div>
        );
    }
}

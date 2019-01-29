import PropTypes from "prop-types";
import React, { Component } from "react";
import { ITreeLoadingStyle } from "../../TreeViewModel";

interface IProps {
    style: ITreeLoadingStyle;
}

export default class Loading extends Component<IProps, {}> {
    public static propTypes = {
        style: PropTypes.object
    };

    public render() {
        const { className } = this.props.style;
        return <div className={className}>loading...</div>;
    }
}

import React, { ComponentType, CSSProperties } from "react";

export interface ITreeNode<T> {
    id?: string | number;
    hover?: boolean;
    active?: boolean;
    name: string;
    loading?: boolean;
    children?: T[];
    toggled?: boolean;
    animations?: ITreeAnimationsFactory;
    decorators?: ITreeDecorators;
}

export interface ITreeAnimationsFactory {
    toggle: (props: any) => ITreeAnimationToggle;
    drawer: (props: any) => ITreeAnimationDrawer;
}
export interface ITreeAnimations {
    toggle: ITreeAnimationToggle;
    drawer: ITreeAnimationDrawer;
}
export interface ITreeAnimationToggle {
    animation: { rotateZ: number };
    duration: number;
}
export interface ITreeAnimationDrawer {
    enter: {
        animation: string;
        duration: number;
    };
    leave: {
        animation: string;
        duration: number;
    };
}

export interface ITreeDecorators {
    Container: ComponentType<any>;
    Loading: React.ComponentType<any>;
    Toggle: React.ComponentType<any>;
}
export interface ITreeStyles {
    base: CSSProperties;
    node: ITreeNodeStyles;
}
export interface ITreeNodeStyles {
    base: CSSProperties;
    container?: CSSProperties;
    link: CSSProperties;
    activeLink: CSSProperties;
    hover: CSSProperties;
    toggle: ITreeToggleStyles;
    header: ITreeHeaderStyles;
    subtree: CSSProperties;
    loading: ITreeLoadingStyle;
}
export interface ITreeHeaderStyles {
    base: CSSProperties;
    container: CSSProperties;
    title: CSSProperties;
}

export interface ITreeLoadingStyle {
    className: string;
    color: string;
}
export interface ITreeToggleStyles extends ITreeStyles {
    base: CSSProperties;
    wrapper: CSSProperties;
    height: number;
    width: number;
    arrow: CSSProperties;
}

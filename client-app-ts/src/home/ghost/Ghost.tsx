import * as React from "react";
import ghost from "./Ghost.svg";
import "./Ghost.css";

export class Ghost extends React.PureComponent {
    render() {
        return (
            <div className="ghost-container">
                <img src={ghost} className="ghost" alt="ghost" />
            </div>
        );
    }
}

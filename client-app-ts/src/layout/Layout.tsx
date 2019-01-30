import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Layout extends Component {
    render() {
        return (
            <div>
                <div>
                    <NavLink className="nav-link" to="/" exact>
                        Home
                    </NavLink>
                    <NavLink className="nav-link" to="/workspace">
                        Workspace
                    </NavLink>
                </div>
                <div>{this.props.children}</div>
            </div>
        );
    }
}

export default Layout;

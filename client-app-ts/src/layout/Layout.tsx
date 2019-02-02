import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ToasterContainer } from "../shared/components/toaster/ToasterContainer";

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
                <ToasterContainer />
            </div>
        );
    }
}

export default Layout;

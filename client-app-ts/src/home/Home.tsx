import React, { Component, useState } from "react";
import "./Home.css";
import { Ghost } from "./ghost/Ghost";

class Home extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Code Editor Lite</p>
                    <a
                        className="App-link"
                        href="https://github.com/canhorn/text-editor-lite"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn About Code Editor Lite
                    </a>
                    <Ghost />
                </header>
            </div>
        );
    }
}

export default Home;

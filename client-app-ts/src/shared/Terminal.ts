/*! terminal.js v2.0 | (c) 2014 Erik Österberg | https://github.com/eosterberg/terminaljs */
export interface ITerminal {
    html: HTMLDivElement;
    setTextSize: (size: string) => void;
    setWidth: (width: string) => void;
    setHeight: (width: string) => void;
    input(command: string): Promise<string>;
    print(message: string): void;
    clear(): void;
}
// PROMPT_TYPE
const PROMPT_INPUT = 1,
    PROMPT_PASSWORD = 2,
    PROMPT_CONFIRM = 3;
const fireCursorInterval = (
    inputField: HTMLParagraphElement,
    terminal: Terminal
) => {
    var cursor = terminal.cursor;
    setTimeout(function() {
        if (inputField.parentElement && terminal.shouldBlinkCursor) {
            cursor.style.visibility =
                cursor.style.visibility === "visible" ? "hidden" : "visible";
            fireCursorInterval(inputField, terminal);
        } else {
            cursor.style.visibility = "visible";
        }
    }, 500);
};
let terminalBeep: HTMLAudioElement;
const setupTerminalBeep = () => {
    if (!terminalBeep) {
        terminalBeep = document.createElement("audio");
        var source =
            '<source src="http://www.erikosterberg.com/terminaljs/beep.';
        terminalBeep.innerHTML =
            source +
            'mp3" type="audio/mpeg">' +
            source +
            'ogg" type="audio/ogg">';
        terminalBeep.volume = 0.05;
    }
};

let firstPrompt = true;
const promptInput = (
    terminal: Terminal,
    message: string,
    PROMPT_TYPE: 1 | 2 | 3
): Promise<string> => {
    return new Promise<string>((resolve, _) => {
        var shouldDisplayInput = PROMPT_TYPE === PROMPT_INPUT;
        var inputField = document.createElement("input");

        inputField.style.position = "absolute";
        inputField.style.zIndex = "-100";
        inputField.style.outline = "none";
        inputField.style.border = "none";
        inputField.style.opacity = "0";
        inputField.style.fontSize = "0.2em";

        terminal.inputLine.textContent = "";
        terminal.inputElement.style.display = "block";
        terminal.html.appendChild(inputField);
        fireCursorInterval(inputField, terminal);

        if (message.length)
            terminal.print(
                PROMPT_TYPE === PROMPT_CONFIRM ? message + " (y/n)" : message
            );

        inputField.onblur = function() {
            terminal.cursor.style.display = "none";
        };

        inputField.onfocus = function() {
            inputField.value = terminal.inputLine.textContent as string;
            terminal.cursor.style.display = "inline";
            setTimeout(() => {
                terminal.html.scrollTop = terminal.html.scrollHeight + 10;
            }, 1);
        };

        terminal.html.onclick = function() {
            inputField.focus();
        };

        inputField.onkeydown = function(e) {
            if (
                e.which === 37 ||
                e.which === 39 ||
                e.which === 38 ||
                e.which === 40 ||
                e.which === 9
            ) {
                e.preventDefault();
            } else if (shouldDisplayInput && e.which !== 13) {
                setTimeout(function() {
                    terminal.inputLine.textContent = inputField.value;
                }, 1);
            }
        };
        inputField.onkeyup = function(e) {
            if (PROMPT_TYPE === PROMPT_CONFIRM || e.which === 13) {
                terminal.inputElement.style.display = "none";
                var inputValue = inputField.value;
                if (shouldDisplayInput)
                    terminal.print(terminal.cursorPrefix + inputValue);
                terminal.html.removeChild(inputField);
                if (PROMPT_TYPE === PROMPT_CONFIRM) {
                    resolve(
                        inputValue.toUpperCase()[0] === "Y" ? "true" : "false"
                    );
                } else {
                    resolve(inputValue);
                }
            }
        };
        if (firstPrompt) {
            firstPrompt = false;
            setTimeout(function() {
                inputField.focus();
            }, 50);
        } else {
            inputField.focus();
        }
    });
};
export const timeout = (milliseconds: number) =>
    new Promise(resolve => setTimeout(resolve, milliseconds));
export class Terminal implements ITerminal {
    get cursor(): any {
        return this._cursor;
    }
    get cursorPrefix(): string {
        return this._cursorPrefix;
    }
    get shouldBlinkCursor(): boolean {
        return this._shouldBlinkCursor;
    }
    get html() {
        return this._html;
    }
    get inputLine() {
        return this._inputLine;
    }
    get inputElement() {
        return this._input;
    }
    private _html: HTMLDivElement;
    private _cursor: HTMLSpanElement;
    private _shouldBlinkCursor: boolean;
    private _innerWindow: HTMLDivElement;
    private _output: HTMLParagraphElement;
    private _inputPrefix: HTMLSpanElement;
    private _inputLine: HTMLSpanElement;
    private _input: HTMLParagraphElement;
    private _cursorPrefix: string;

    constructor(id: string, cursorPrefix: string = "$ ") {
        this._cursorPrefix = cursorPrefix;
        setupTerminalBeep();

        this._html = document.createElement("div");
        this.html.className = "Terminal";
        this.html.id = id;

        this._innerWindow = document.createElement("div");
        this._output = document.createElement("p");
        this._inputPrefix = document.createElement("span"); //the span element where the users input is put
        this._inputLine = document.createElement("span"); //the span element where the users input is put
        this._cursor = document.createElement("span");
        this._input = document.createElement("p"); //the full element administering the user input, including cursor

        this._shouldBlinkCursor = true;

        this._input.appendChild(this._inputPrefix);
        this._input.appendChild(this._inputLine);
        this._input.appendChild(this._cursor);
        this._innerWindow.appendChild(this._output);
        this._innerWindow.appendChild(this._input);
        this.html.appendChild(this._innerWindow);

        this.setBackgroundColor("black");
        this.setTextColor("white");
        this.setTextSize("1em");
        this.setWidth("100%");
        this.setHeight("100%");

        this.html.style.fontFamily =
            'source-code-pro, Menlo, Monaco, Consolas,"Courier New", monospace';
        this.html.style.margin = "0";
        this.html.style.overflowY = "auto";
        this._innerWindow.style.height = "100%";
        this._input.style.margin = "0px 10px 10px 10px";
        this._output.style.margin = "0px 0px";
        this._inputPrefix.innerText = cursorPrefix;
        this._cursor.style.background = "white";
        this._cursor.innerHTML = "C"; //put something in the cursor..
        this._cursor.style.display = "none"; //then hide it
        this._input.style.display = "none";
    }

    public setTextSize(size: string) {
        this._output.style.fontSize = size;
        this._input.style.fontSize = size;
    }
    public setWidth(width: string) {
        this.html.style.width = width;
    }
    public setHeight(height: string) {
        this.html.style.height = height;
    }
    public blinkingCursor(bool: boolean | string) {
        bool = bool.toString().toUpperCase();
        this._shouldBlinkCursor =
            bool === "TRUE" || bool === "1" || bool === "YES";
    }
    public setTextColor(color: string) {
        this.html.style.color = color;
        this._cursor.style.background = color;
    }
    public setBackgroundColor(color: string) {
        this.html.style.background = color;
    }

    public print(message: string) {
        const newLine: HTMLPreElement = document.createElement("pre");
        newLine.style.margin = "0px 10px";
        newLine.textContent = message;
        this._output.appendChild(newLine);
    }
    public async input(message: string) {
        return await promptInput(this, message, PROMPT_INPUT);
    }
    public async password(message: string) {
        return await promptInput(this, message, PROMPT_PASSWORD);
    }
    public async confirm(message: string) {
        return await promptInput(this, message, PROMPT_CONFIRM);
    }
    public clear() {
        this._output.innerHTML = "";
    }
    public async sleep(milliseconds: number) {
        await timeout(milliseconds);
    }

    private beep() {
        terminalBeep.load();
        terminalBeep.play();
    }
}

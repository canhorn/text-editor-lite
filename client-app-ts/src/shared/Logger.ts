import dateFormat from "dateformat";

export class Logger {
    private _name: string;
    private _isDebug: boolean;

    constructor(name: string) {
        this._name = name;
        this._isDebug = true;
    }

    public log(message: string, data: any = "") {
        const messageToLog = `[${this.formattedNowDate()}] [INFO]: [${
            this._name
        }] \r\n\t${message}`;
        console.log(messageToLog, data);
    }
    public debug(message: string, data: any = "") {
        this.formattedNowDate();
        if (!this._isDebug) {
            return;
        }
        const messageToLog = `[${this.formattedNowDate()}] [DEBUG]: [${
            this._name
        }] \r\n\t${message}`;
        console.info(messageToLog, data);
    }
    public error(message: string, data: any = "") {
        const messageToLog = `[${this.formattedNowDate()}] [ERROR]: [${
            this._name
        }] \r\n\t${message}`;
        console.error(messageToLog, data);
    }
    public trace(message: string, data: any = "") {
        const messageToLog = `[${this.formattedNowDate()}] [TRACE]: [${
            this._name
        }] \r\n\t${message}`;
        console.log(messageToLog, data);
        console.trace();
    }

    /**
     * 01-14-2019 21:22:45.0123456-06:00
     */
    private formattedNowDate() {
        const now = new Date();
        const formattedOffset = dateFormat(now, "o");
        return (
            dateFormat(now, "mm-dd-yyyy HH:MM:ss.l") +
            formattedOffset.slice(0, 3) +
            ":" +
            formattedOffset.slice(3)
        );
    }
}

export const registerEditorServiceWorker = () => {
    // tslint:disable-next-line:no-string-literal
    (self as any)["MonacoEnvironment"] = {
        getWorkerUrl(_: string, label: string) {
            switch (label) {
                default:
                    return "/monaco-editor-worker-loader-proxy.js";
            }
        }
    };
};
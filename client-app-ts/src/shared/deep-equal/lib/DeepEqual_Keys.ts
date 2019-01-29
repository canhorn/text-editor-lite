export const shim = (obj: any): any => {
    var keys = [];

    for (var key in obj) keys.push(key);

    return keys;
};

export default (typeof Object.keys === "function" ? Object.keys : shim);

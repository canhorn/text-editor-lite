const supportsArgumentsClass =
    (function() {
        return Object.prototype.toString.call(arguments);
    })() == "[object Arguments]";

export const supported = (object: any) => {
    return Object.prototype.toString.call(object) == "[object Arguments]";
};
export const unsupported = (object: any) => {
    return (
        (object &&
            typeof object == "object" &&
            typeof object.length == "number" &&
            Object.prototype.hasOwnProperty.call(object, "callee") &&
            !Object.prototype.propertyIsEnumerable.call(object, "callee")) ||
        false
    );
};

export default (supportsArgumentsClass ? supported : unsupported);

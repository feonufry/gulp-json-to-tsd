"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var tsd_builder_1 = require("./tsd-builder");
function isLatinLetter(char) {
    return char >= "a" && char <= "z"
        || char >= "A" && char <= "Z";
}
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function getInterfaceName(fileName, options) {
    var result = options.useInterfacePrefix ? "I" : "";
    var upperCase = true;
    for (var _i = 0, fileName_1 = fileName; _i < fileName_1.length; _i++) {
        var char = fileName_1[_i];
        if (isDigit(char)) {
            if (result.length === 0) {
                result = "_";
            }
            result = result + char;
            upperCase = false;
            continue;
        }
        if (isLatinLetter(char)) {
            if (upperCase) {
                result = result + char.toUpperCase();
            }
            else {
                result = result + char;
            }
            upperCase = false;
            continue;
        }
        upperCase = true;
    }
    return result;
}
function transformObject(json, builder) {
    for (var key in json) {
        if (!json.hasOwnProperty(key))
            continue;
        var value = json[key];
        if (value == null) {
            builder.property(key, "null|undefined");
        }
        else if (typeof value === "number") {
            builder.property(key, "number");
        }
        else if (typeof value === "string") {
            builder.property(key, "string");
        }
        else if (typeof value === "boolean") {
            builder.property(key, "boolean");
        }
        else if (typeof value === "object") {
            builder.beginObjectProperty(key);
            transformObject(value, builder);
            builder.endObjectProperty();
        }
    }
}
function transform(file, json, encoding, options) {
    var builder = new tsd_builder_1.TsdBuilder(encoding, options.identStyle || "tab", options.identSize || 1);
    var fullFileName = path.parse(file.path);
    var interfaceName = getInterfaceName(fullFileName.name, options);
    if (options.namespace) {
        builder.beginNamespace(options.namespace, true);
    }
    builder.beginInterface(interfaceName, !options.namespace);
    transformObject(json, builder);
    builder.end();
    if (options.namespace) {
        builder.end();
    }
    file.path = path.join(fullFileName.dir, fullFileName.name + ".d.ts");
    file.contents = builder.toBuffer();
    return file;
}
exports.transform = transform;

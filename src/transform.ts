
import * as path from "path";
import { Options } from "./options";
import { TsdBuilder } from "./tsd-builder";

function isLatinLetter(char: string) {
    return char >= "a" && char <= "z"
        || char >= "A" && char <= "Z";
}

function isDigit(char: string) {
    return char >= "0" && char <= "9";
}

function getInterfaceName(fileName: string, options: Options): string {
    let result = options.useInterfacePrefix ? "I" : "";
    let upperCase = true;
    for (const char of fileName) {
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
            } else {
                result = result + char;
            }
            upperCase = false;
            continue;
        }
        upperCase = true;
    }
    return result;
}

function transformObject(json: any, builder: TsdBuilder) {
    for (let key in json) {
        if (!json.hasOwnProperty(key)) continue;
        const value = json[key];
        if (value == null) {
            builder.property(key, "null|undefined")
        } else if (typeof value === "number") {
            builder.property(key, "number")
        } else if (typeof value === "string") {
            builder.property(key, "string")
        } else if (typeof value === "boolean") {
            builder.property(key, "boolean")
        } else if (typeof value === "object") {
            builder.beginObjectProperty(key);
            transformObject(value, builder);
            builder.endObjectProperty();
        }
    }
}

export function transform(file: any, json: any, encoding: string, options: Options): any {
    const builder = new TsdBuilder(encoding, options.identStyle || "tab", options.identSize || 1);
    const fullFileName = path.parse(file.path);
    const interfaceName = getInterfaceName(fullFileName.name, options);

    if (options.namespace) {
        builder.beginNamespace(options.namespace, true /*declared*/);
    }
    builder.beginInterface(interfaceName, !options.namespace /*declared*/);
    transformObject(json, builder);
    builder.end();
    if (options.namespace) {
        builder.end();
    }
    file.path = path.join(fullFileName.dir, `${fullFileName.name}.d.ts`);
    file.contents = builder.toBuffer();

    return file;
}
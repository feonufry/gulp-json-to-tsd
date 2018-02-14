
import * as through2 from "through2";
import * as gutil from "gulp-util";
import * as path from "path";
import { Options } from "./options";
import { transform } from "./transform";

type TransformCallback = (err?: any, data?: any) => void;

const PLUGIN_NAME = "gulp-json-to-tsd";

export = function (options: Options) {
    function generate(file: any, encoding: string, callback: TransformCallback) {
        if (file.isNull()) {
            this.push(transform(file, {}, encoding, options));
            return callback();
        }

        if (file.isStream()) {
            callback(new gutil.PluginError(PLUGIN_NAME, "Streaming not supported"));
            return;
        }

        try {
            const json = JSON.parse(file.contents);
            this.push(transform(file, json, encoding, options));
        } catch (ex) {
            this.emit("error", new gutil.PluginError(PLUGIN_NAME, ex));
        }

        callback();
    }

    options = options || {};
    options.useInterfacePrefix = options.useInterfacePrefix || false;
    options.declareVariable = options.declareVariable || false;
    options.identStyle = options.identStyle || "tab";
    options.identSize = options.identSize || 1;
    
    return through2.obj(generate);
}
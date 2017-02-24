"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ident(style, size, level) {
    return level <= 0
        ? ""
        : Array(level * (size + 1)).join(style === "tab" ? "\t" : " ");
}
var TsdBuilder = (function () {
    function TsdBuilder(encoding, identStyle, identSize) {
        this.encoding = encoding;
        this.identStyle = identStyle;
        this.identSize = identSize;
        this.chunks = [];
        this.currentIdentation = 0;
    }
    TsdBuilder.prototype.beginNamespace = function (name) {
        var statement = "namespace " + name + " {";
        this.putStatement(statement);
        this.beginIdentation();
        return this;
    };
    TsdBuilder.prototype.beginInterface = function (name, exported) {
        if (exported === void 0) { exported = true; }
        var statement = (exported ? "export " : "") + "interface " + name + " {";
        this.putStatement(statement);
        this.beginIdentation();
        return this;
    };
    TsdBuilder.prototype.end = function () {
        this.endIdentation();
        this.putStatement("}");
        return this;
    };
    TsdBuilder.prototype.property = function (name, type) {
        this.putStatement("\"" + name + "\": " + type + ";");
        return this;
    };
    TsdBuilder.prototype.beginObjectProperty = function (name) {
        var statement = "\"" + name + "\": {";
        this.putStatement(statement);
        this.beginIdentation();
        return this;
    };
    TsdBuilder.prototype.endObjectProperty = function () {
        this.endIdentation();
        this.putStatement("};");
        return this;
    };
    TsdBuilder.prototype.declareConstant = function (name, type) {
        this.putStatement("declare const " + name + ": " + type + ";");
        return this;
    };
    TsdBuilder.prototype.putStatement = function (statement) {
        this.chunks.push(new Buffer("" + ident(this.identStyle, this.identSize, this.currentIdentation) + statement + "\n", this.encoding));
    };
    TsdBuilder.prototype.beginIdentation = function () {
        ++this.currentIdentation;
    };
    TsdBuilder.prototype.endIdentation = function () {
        --this.currentIdentation;
    };
    TsdBuilder.prototype.toBuffer = function () {
        return Buffer.concat(this.chunks);
    };
    return TsdBuilder;
}());
exports.TsdBuilder = TsdBuilder;


function ident(style: string, size: number, level: number) {
    return level <= 0
        ? ""
        : Array(level * (size + 1)).join(style === "tab" ? "\t" : " ");
}

export class TsdBuilder {
    private readonly chunks: Buffer[] = [];
    private currentIdentation: number = 0;

    constructor(
        private readonly encoding: string,
        private readonly identStyle: "tab" | "space",
        private readonly identSize: number) {
    }

    public beginNamespace(name: string): TsdBuilder {
        const statement = `namespace ${name} {`;
        this.putStatement(statement);
        this.beginIdentation();
        return this;
    }

    public beginInterface(name: string, exported: boolean = true): TsdBuilder {
        const statement = `${exported ? "export " : ""}interface ${name} {`;
        this.putStatement(statement);
        this.beginIdentation();
        return this;
    }

    public end(): TsdBuilder {
        this.endIdentation();
        this.putStatement("}");
        return this;
    }

    public property(name: string, type: string): TsdBuilder {
        this.putStatement(`"${name}": ${type};`);
        return this;
    }

    public beginObjectProperty(name: string): TsdBuilder {
        const statement = `"${name}": {`;
        this.putStatement(statement);
        this.beginIdentation();
        return this;
    }

    public endObjectProperty(): TsdBuilder {
        this.endIdentation();
        this.putStatement("};");
        return this;
    }

    public declareConstant(name: string, type: string): TsdBuilder {
        this.putStatement(`declare const ${name}: ${type};`);
        return this;
    }

    private putStatement(statement: string) {
        this.chunks.push(new Buffer(
            `${ident(this.identStyle, this.identSize, this.currentIdentation)}${statement}\n`, this.encoding));
    }

    private beginIdentation() {
        ++this.currentIdentation;
    }

    private endIdentation() {
        --this.currentIdentation;
    }

    public toBuffer(): Buffer {
        return Buffer.concat(this.chunks);
    }
}
# gulp-json-to-tsd

> A gulp plugin to generate typescript definition file that represents a shape of JSON

For each JSON file a typescript interface will be generated that represents a shape of a JSON. 
Name of an interface is based on JSON file name. E.g. `UserGroup` interface (or `IUserGroup`, see below)
will be generated for any of file names: `user-group.json`, `user_group.json`, `userGroup.json`, `UserGroup.json`.

Please, note that only basic latin letters and digits are currently supported. Any other character
are ignored.

## Install

```
$ npm install --save-dev gulp-json-to-tsd
```


## Usage

```js
const gulp = require('gulp');
const jsonToTsd = require('gulp-json-to-tsd');

gulp.task("default", () => {
	gulp.src("src/file.json")
		.pipe(jsonToTsd())
		.pipe(gulp.dest("dist"))
);
```


## API

### jsonToTsd([options])

#### options

##### useInterfacePrefix

Type: `boolean`<br>
Default: `false`

If `true`, all interfaces will be prefixed with `I` letter. Let's assume that we have `user-group.json` file. 
Then if `useInterfacePrefix = true`, an `IUserGroup` interface will be generated. 
And if `useInterfacePrefix = false`, an interface will be `UserGroup`.

##### namespace

Type: `string | undefined`<br>
Default: `undefined`

All interface declarations will be put into namespace with a given name.

##### identStyle

Type: `"tab" | "space"`<br>
Default: `"tab"`

Specifies identiation style.

##### identSize

Type: `number`<br>
Default: `1`

Specifies how many tabs/spaces will be used for one level of identiation.


## License

MIT © 2017 Roman Liberov
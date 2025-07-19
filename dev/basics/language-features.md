# Introduction to JSCore-Flavoured JavaScript

JSCore-flavoured JavaScript closely mimics NodeJS, most language features are provided by [**rinode**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/rinode#rinode), which is included as a dependency in your sample project.

Not all of the information found here will be useful to you right away. We recommend skimming this section to get a sense of the language features, and then returning to it as necessary.

> All custom implementations below may differ from the NodeJS behaviour, methods that are not mentioned may not exist at all.

## Import and Exports

### require(module name)

Modules can be imported by their name.

```js
// init.js
let fs = require("fs");
fs.writeFileSync("myFile.txt", "Hello fs!");
```

### require(relative path)

You can also import another file by their relative path.

```js
// init.js
let myPackage = require("./index.js");
let name = myPackage.packageName();
console.log(name);
```

#### Abbreviation Rules for Paths

| This path  | Can also mean       | Because                                                |
| ---------- | ------------------- | ------------------------------------------------------ |
| `./index`  | `./index.js`        | The file extension for a `.js` file can be omitted.    |
| `./folder` | `./folder/index.js` | `./folder/index.js` is the entry point for `./folder`. |

### require(path to json)

You can read a JSON file by its path.

```js
// init.js
let package = require("./package.json");
let content = JSON.stringify(package);
console.log(content);
```

### module.exports

**require("./file.js")** returns the value of **module.exports** in `./file.js`.

```js
// file.js
module.exports = {
  name: "Sirius",
  age: 19,
  url: "https://siri.ws",
};
```

**module.exports** can take any value, including `undefined`.

## Non-blocking Methods

### Promise

The **Promise** object is the simplest way to run non-blocking code.

```js
console.log("Script started.");

let promise = Promise(() => {
  thisFunctionTakesALongTime();
  return 1;
});

promise
  .then((result) => console.log(`Promise ended with ${result}.`))
  .catch((e) => console.error(`An error occured ${e}.`));

console.log("Script ended.");
```

The script will not wait for the promise to complete before moving on to the next line of code, so the messages will appear in the following order.

```
[LOG] Script started.
[LOG] Script ended.
[LOG] Promise ended with 1.
```

If you run two promises at the same time, it is impossible to tell which one will finish first.

```js
Promise(() => console.log("Promise 1 finished."));
Promise(() => console.log("Promise 2 finished."));
```

### setTimeout and setInterval

- **setTimeout(function, delay)** runs the function with a custom **delay** in milliseconds.
- **setInterval(function, interval)** runs the function at a constant **rate** in milliseconds, the function will be ran immediately, then at **[interval]** milliseconds, and so on.

```js
let counter = 0;

let timeout = setTimeout(() => {
  console.log("Timeout complete");
}, 1000);

let interval = setInterval(() => {
  counter++;
  console.log(`Interval tick ${counter}`);
}, 1000);
```

#### Cancelling Timers

**setTimeout** and **setInterval** can be stopped either by.

```js
timeout.cancel();
interval.cancel();
```

or

```js
clearTimeout(timeout);
clearInterval(interval);
```

### Non-blocking Behaviour

Ongoing **Promise**, **setTimeout** or **setInterval** will not be stopped by **/jscore restart**.

## The Fetch API

### fetch(url) -> Promise&lt;Response&gt;

Make a simple HTTP request.

```js
fetch("https://example.com")
  .then((res) => res.text())
  .then((text) => console.log(text))
  .catch((e) => console.error(`Something went horribly wrong ${e}`));
```

### fetch(url, options) -> Promise&lt;Response&gt;

Make an HTTP request with options, below shows the fields for **options**.

```js
{
  method: "GET",
  body: (String),
  headers: {
      "Header-Name": "Header-Value"
  }
}
```

Please refer to [fetch-js/README](https://github.com/FabricCore/fetch-js) for documentation.

> **fetchSync** need to be imported explicitly.
>
> ```js
> let { fetchSync } = require("fetch");
> ```

## Misc Rinode Methods

Here are some but not all methods provided by **rinode**, refer to package documentation for all methods.

### [console](https://github.com/FabricCore/console-js)

`console` is imported by default.

| Method signature             | Description                            |
| ---------------------------- | -------------------------------------- |
| `console.error(msg: string)` | Logs a message with the `[ERROR]` tag. |
| `console.warn(msg: string)`  | Logs a message with the `[WARN]` tag.  |
| `console.info(msg: string)`  | Logs a message with the `[INFO]` tag.  |
| `console.debug(msg: string)` | Logs a message with the `[DEBUG]` tag. |
| `console.trace(msg: string)` | Logs a message with the `[TRACE]` tag. |
| `console.log(msg: String)`   | Logs a message with the `[LOG]` tag.   |
| `console.clear()`            | Clears chat.                           |

### [fs](https://github.com/fabriccore/fs-js)

`fs` can be imported with `require("fs")`.

| Method signature                    | Description                          |
| ----------------------------------- | ------------------------------------ |
| `readFileSync(path, "utf8")`        | Read string content from file.       |
| `appendFileSync(path, data)`        | Append content to a file.            |
| `writeFileSync(path, data)`         | Overwrite a file.                    |
| `unlinkSync(path, recursive?)`      | Delete a file or directory.          |
| `readdirSync(path)`                 | List items in a directory.           |
| `mkdirSync(path)`                   | Create a new direcotry.              |
| `symlinkSync(path, target, unused)` | Create symbolic link.                |
| `existsSync(path)`                  | Check if a file or direcotry exists. |
| `isDirSync(path)`                   | Check if a path is a direcotry.      |
| `isFileSync(path)`                  | Check if a path is a file.           |
| `isSymlinkSync(path)`               | Check if a path is a symlink.        |

All sync functions have their non-blocking variant.

- Their names does not contain the word "sync", e.g. readFileSync -> readFile
- They take an additional argument - the function that is ran when the operation is complete, the function may take one argument which is the output of the corresponding sync function.

## The Module Object

You have already use **module.exports** to make functions and variables visible, here's some other things the module object can do.

### module.require(path)

This is different from **require(path)**, as **module.require** only support importing JavaScript files by path.

### module.globals

The evil twin of **module.exports**, **module.globals** can hold any value, and can be accessed from any file. This value does not reset when **/jscore restart** is ran.

**module.globals** is useful to prevent registering to the same event multiple times, but is generally not recommended unless you have a strong reason to use it.

### module.eval(script)

Runs a script at the module, it is not recommended to mess around with this.

## Rhino Shenanigans

JSCore uses [Rhino](https://rhino.github.io/) as its JavaScript runtime, here are a list of things to watch out for.

| What                                  | This doesn't work | Suggested fix                                    |
| ------------------------------------- | ----------------- | ------------------------------------------------ |
| Varargs not allow for arrow functions | `(...args) => {}` | `function(..args) {}`                            |
| Cannot spread arguments               | `myFun(...args)`  | `myFun.apply(null, args)`                        |
| Const prevent script reload           | `const`           | `let`                                            |
| Classes are not supported             | `class MyClass`   | `function MyClass()`<br>`MyClass.method = /* */` |

> If you find anything that should work but isn't working, let us know on [**Discord**](https://discord.gg/XfSZ5tc7Sk) so we can add it to this list.

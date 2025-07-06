# Your First JSCore Package

## 1. Create a Package

The command **/devtools new &lt;name&gt;** creates a new package with that name.

```sh
/devtools new my-package
```

Open the folder `~/.minecraft/config/modules/my-package` in your preferred text editor, e.g. [VS Code](https://code.visualstudio.com/).

## 2. House Tour

Let's take a look at each file created.

### package.json

This file contains all the details about your package.

```json
{
  "name": "my-package",
  "version": "0.1.0",
  "description": "Hello JSCore!",
  "keywords": [],
  "license": "LGPL-3.0-or-later",
  "author": {
    "name": "Your Name",
    "email": "yourname@domain.com",
    "url": "https://example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/reponame-js"
  },
  "dependencies": {
    "rinode": "0.1.0"
  }
}
```

In **dependencies**, we can see that this package depends on **rinode**, which gives us basic JavaScript features such as `console.log`.

### init.js

This file is the **main entry point** of your package. It runs when JSCore starts.

```js
// init.js
console.log("Hello JSCore!");
console.log("Learn how to write a module on https://jscore.siri.ws/dev/");
```

We can run this script by restarting JSCore.

```sh
/jscore restart
```

A few messages should appear in chat.

```
[LOG] Hello JSCore!
[LOG] Learn how to write a module on https://jscore.siri.ws/dev/
```

### index.js

This file is the **library entry point** of your package, which will be explained in a bit.

```js
function packageName() {
  return "my-package!";
}

module.exports = {
  packageName,
};
```

All functions and variables are private by default (cannot be used from other files). Only functions and variables placed in **module.exports** are visible from other files.

> This is extremely similar to how NodeJS works.

## 3. Connecting the Dots

Since **init.js** is the file that runs, and **index.js** is our library entry point. To use `packageName` from **index.js** in **init.js**.

```js
// init.js
let myPackage = require("my-package");
let name = myPackage.packageName();
console.log(name);
```

Then restart JSCore with **/jscore restart**.
```sh
/jscore restart
```

We can see in chat.
```
[LOG] my-package!
```

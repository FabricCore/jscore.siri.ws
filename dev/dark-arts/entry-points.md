# The Init Script System

Each package in JSCore has 3 entry points - **init.js**, **index.js** and **stop.js**, but JSCore (the mod) is not aware of this, for all it knows it runs the main **init.js** at start and **stop.js** at stop.

## The Main Init Scripts

The main **init.js** looks for packages in `/modules/` when the game starts, and runs their respective **init.js** in the order of dependencies first, then the dependent.

**stop.js** runs the stop scripts in the reverse order.

## Prelude

Prelude is a familiar concept present in most programming languages. For example Java imports **java.lang.\*** for every file so names such as **java.lang.String** can be referred to by just **String**. You could imagine they've added the line `import java.lang.*` before every Java source file.

Things such as **console**, **Promise**, **setTimeout** and **require** are defined in every file in the same way - if the package depends on rinode.

If package A has a **prelude.js** and package B is dependent directly or indirectly on A, then **prelude.js** from A runs before each file in B. A prelude file looks something like this.

```js
// prelude.js
prelude.eval("let { addEventListener } = require('listener')");
```

Which imports **addEventListener** to the file.

### Checking Path

Since the content of prelude is ran on another file, you can check the path of the file with **module.path**, which returns the path of the file that is being ran as a Java list.

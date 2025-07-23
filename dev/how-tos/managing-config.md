# Creating Configurable Options

The **config** package allows you to use write-on-exit config options (it's blazingly fast 🚀), it also comes with a clickable text interface at **/config** for users to easily change options.

## Add Dependencies

Include [**config**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/config#config) as dependency in **package.json**.

```js
// package.json
{
  // ...
  dependencies: {
    "config": "0.1.0",
    // ...
  }
}
```

If **config** is not installed, you can run **/pully install** to install any missing dependencies.

## Basic Read-Write

### Reading an Entry

**config.load(label)** returns the value of an existing config entry.

```js
let config = require("config");

let options1 = config.load("myPackage.options1");
let options2 = config.load("myPackage.options2");
```

Each config entry holds a JS object, and is identified by a period separated string. Each entry should only store pure JavaScript objects without any Java objects.

> If you hold a Java variant of the value, such as **java.lang.String** instead of **string**, the value will be shown in purple and some features, such as inferred typing will not work.

If the entry does not exist, `undefined` will be returned.

### Writing Changes

**config.save(label, value)** writes value to an entry, creating an entry if it doesn't exist.

```js
let config = require("config");

// writes to entry
let options1 = config.load("myPackage.options1");
config.save("myPackage.options1", { hello: 1 });

// modify an existing entry
let options2 = config.load("myPackage.options2");
options2.hello = 1;
config.save("myPackage.options2", options2);
```

The changes will be written to disk when the game is closed, or JSCore restarts, and loaded entries are cached for the duration of the running of the game. Config entries should only be modified using the **config** package.

> Fields are displayed in alphabetical order when viewed in the **/config** menu, if you wish to group entries, put them under the same subfield. E.g. `options.myGroup.field1` and `options.myGroup.field2`.

### Removing Entries

**config.remove(label)** removes a config entry.

```js
let config = require("config");

config.remove("myPackage.options2");
```

## Adding Missing Fields

New fields in config may be added as your package updates, you will need to add them to existing config entries for the user to change them.

You can write a **getOptions** function, see how the **translate** use it.

```js
// translate/init.js
let command = require("command");
let config = require("config");

function getOptions() {
  let options = config.load("translate");
  options ??= {}; // if the entry does not exist, make it an empty object
  options.instance ??= "translate.siri.ws"; // default value for `instance`
  options.source ??= "auto";
  options.target ??= "en";

  config.save("translate", options);
  return options;
}

getOptions();

// ...

command.register({
  name: "translate",
  args: {
    phrase: {
      type: "greedy",
      execute: (phrase) => {
        let options = getOptions();
        translate(options, phrase);
      },
    },
  },
});
```

- First of all, because **config.save** doesn't actually write to disk, the **getOptions** function is not an expensive operation.
- The script runs **getOptions** on start so that the entry can be edited in the **/config** menu.

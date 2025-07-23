# Create Toggleable Modules

It's great to be able to turn something off. The **toggle** package allows you to create modules that can be turned on and off using a clickable text menu. Using toggles instead of managing [listeners](listen-to-events) manually is also a great way to keep your code organised.

## Add Dependencies

Include [**toggle**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/toggle#toggle) as dependency in **package.json**.

```js
// package.json
{
  // ...
  dependencies: {
    "toggle": "0.1.0",
    // ...
  }
}
```

If **toggle** is not installed, you can run **/pully install** to install any missing dependencies.

## Hello Toggle!

**toggle.register** creates a new toggle.

```js
// init.js
let toggle = require("toggle");

toggle.register({
  name: "HelloToggle",

  onActivate() {
    console.log("The toggle was activated.");
  },

  onDeactivate() {
    console.log("The toggle was deactivated.");
  },
});
```

A toggle has 3 special fields:
|Field name|Purpose|
|---|---|
|**name** (required)|Name of the toggle, contain no space and in **UpperCamelCase**.|
|**onActivate** (optional)|Runs when the toggle is switched on.|
|**onDeactivate** (optional)|Runs when the toggle is switched off.|

## Listening to Events

You will need to first add an event provider as a dependency, add [**fabric-api-events**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/fabric-api-events#fabric-api-events) as dependency in **package.json**.

```js
// init.js
let toggle = require("toggle");

toggle.register({
  name: "HelloToggle",

  startClientWorldTickEvent(world) {
    /* do something */
  },

  clientLoginInitEvent(world) {
    /* do something */
  },
});
```

To listen to an event, [find the event](https://github.com/fabriccore/fabric-api-events-js) you wish to listen to, and create a method with the name of the event. The listener method can take [provided arguments](https://maven.fabricmc.net/docs/fabric-api-0.129.0+1.21.7/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.StartWorldTick.html), and return a value to modify the behaviour.

## Example: Translate

The [**translate**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/translate#translate) package registers a toggle that appends a **[T]** tag to the end of the message, when clicked translates the message content to a specified language.

```js
// init.js
let text = require("text");
let toggle = require("toggle");
let translate = require("translate");

toggle.register({
  // toggle name (required)
  name: "Translater",

  // event listener
  clientModifyReceiveGameMessageEvent(msg) {
    // removes all formatting form the text
    let content = msg.getString().replaceAll(/§./g, "");

    // create a new Text that begins with the original text
    // and ends with a clickable text
    return text.createText([
      msg,
      " ",
      {
        content: "[T]",
        color: "#cba6f7",
        hover: `Translate "${content}"`,
        click: `/translate auto ${content}`,
      },
    ]);
  },
});
```

The section on [creating texts](./working-with-text.md) details how the [**text**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/text#text) package is used.

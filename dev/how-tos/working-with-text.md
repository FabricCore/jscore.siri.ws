# Create Formatted Text

The **text** package can be used to create formatted text, including coloured text, hoverable and clickable text, and much more.

## Add Dependencies

Include [**text**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/text#text) as dependency in **package.json**.

```js
// package.json
{
  // ...
  dependencies: {
    "text": "0.1.0",
    // ...
  }
}
```

If **text** is not installed, you can run **/pully install** to install any missing dependencies.

## Creating Formatted Text

**text.createText** creates a [**Text**](https://maven.fabricmc.net/docs/yarn-1.21.7+build.1/net/minecraft/text/Text.html) object, a basic string is a valid text.

```js
let text = require("text");

let myMsg = text.createText("Hello JSCore!");
text.sendText(myMsg);
```

### Using Styles

You can add styles to your text with style attributes.

```js
let text = require("text");

let myMsg = text.createText({
  content: "Hello JSCore!",
  color: "#ff9900",
  italic: true,
  bold: true,
});
text.sendText(myMsg);
```

All available style attributes are:
|Style attribute|Description|Type|
|---|---|---|
|bold|Thick text?|Boolean|
|italic|Slanted text?|Boolean|
|obfuscated|Cannot see text?|Boolean|
|underlined|Line underneath?|Boolean|
|color|What colour?|Hex code, integer (of hex number), [TextColor](https://maven.fabricmc.net/docs/yarn-1.21.7+build.1/net/minecraft/text/TextColor.html) or [Formatting](https://maven.fabricmc.net/docs/yarn-1.21.7+build.1/net/minecraft/util/Formatting.html)|
|shadow|Contrast of shadow|Integer, can be negative for negative contrast|
|font|Font to use|String or [Identifier](https://maven.fabricmc.net/docs/yarn-1.21.7+build.1/net/minecraft/util/Identifier.html)|

> **text.sendText** takes anything that can be converted to a [**Text**](https://maven.fabricmc.net/docs/yarn-1.21.7+build.1/net/minecraft/text/Text.html) object as argument. The code below sends the **Text** directly.
>
> ```js
> let text = require("text");
>
> text.sendText("Hello JSCore!");
>
> text.sendText({
>   content: "Hello JSCore!",
>   color: "#ff9900",
>   italic: true,
>   bold: true,
> });
> ```

### Hoverable Text

You can show a hint when a text is hovered.

```js
let text = require("text");

text.sendText({
  content: "Hello JSCore!",
  color: "#ff9900",
  italic: true,
  bold: true,
  hover: "I said hello!",
});
```

Hover can takes anything that can be converted to a **Text**.

```js
let text = require("text");

text.sendText({
  content: "Hello JSCore!",
  color: "#ff9900",
  italic: true,
  bold: true,
  hover: {
    content: "Red hover text!",
    underlined: true,
    color: "#ff2222",
  },
});
```

> A hover event can also be an item or an entity, you can specify the type of thing to show.
>
> ```js
> let text = require("text");
>
> text.sendText({
>   content: "Hello JSCore (text)!",
>   hover: {
>     text: "Hoi!", // or anything that can be converted to Text
>   },
> });
>
> text.sendText({
>   content: "Hello JSCore (item)!",
>   hover: {
>     item: /* ItemStack */,
>   },
> });
>
> text.sendText({
>   content: "Hello JSCore (entity)!",
>   hover: {
>     entity: /* EntityContent */,
>   },
> });
> ```

### Clickable Text

Do varioius things when the text is clicked.

#### Run Command

```js
let text = require("text");

text.sendText({
  content: "Restart JSCore!",
  click: {
    run: "jscore restart",
  },
});

// shorthand: starts with a `/`
text.sendText({
  content: "Restart JSCore!",
  click: "/jscore restart",
});
```

#### Suggest Text

```js
text.sendText({
  content: "Restart JSCore?",
  click: {
    // can also be a chat message if doesn't start with `/`
    suggest: "/jscore restart",
  },
});
```

#### Open URL

```js
text.sendText({
  content: "Join Discord",
  click: {
    url: "https://discord.gg/XfSZ5tc7Sk",
  },
});

// shorthand: starts with `https://` or `http://`
text.sendText({
  content: "Join Discord",
  click: "https://discord.gg/XfSZ5tc7Sk",
});
```

#### Open File

```js
text.sendText({
  content: "Open JSCore folder",
  click: {
    file: "config/jscore",
  },
});
```

<!--
#### Copy to Clipboard

```js
let text = require("text");

text.sendText({
  content: "Copy homepage url",
  hover: "Copy to clipboard",
  click: {
    copy: "https://jscore.siri.ws",
  },
});
```

#### Change Page
-->

## Multi-component Text

A Text can have multiple chunks of different styles, we can create this by passing an array into **text.sendText**.

```js
let text = require("text");

let clickableText = text.createText([
  {
    content: "[A]",
    click: "https://example.com",
  },
  " ",
  {
    content: "[B]",
    click: "/jscore snapshot create",
  },
]);

text.sendText([
  "Unstyle text\n",
  {
    content: "Orange text",
    color: "#ff9900",
    italic: true,
    bold: true,
  },
  " ",
  clickableText,
]);
```

## Example: Private Message Button

This example assumes you have read the section on [listening to events](./listen-to-events.md).

Add **listener** and **fabric-api-events** as dependencies.

```js
let text = require("text");

// receivedMessage is of type net.minecraft.text.Text
addEventListener("clientModifyReceiveGameMessageEvent", (receivedMessage) => {
  // we need to check if a message is a player message
  // which has format `<playerName> player message`
  let textContent = text.getString(receivedMessage);
  let firstWord = textContent.split(" ")[0];

  // do nothing to the message if it is not a player message
  if (!firstWord.startsWith("<") || !firstWord.endsWith(">")) return;

  let playerName = firstWord.slice(1, -1);

  // Add a clickable text `[M]` after the original message
  return text.createText([
    receivedMessage,
    " ",
    {
      content: "[M]",
      color: "#fab387",
      hover: `Reply to ${playerName}`,
      click: {
        suggest: `/msg ${playerName} `,
      },
    },
  ]);
});
```

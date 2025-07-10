# Accessing Minecraft Internals

Although inconvenient, it is possible to access Minecraft internals using their scrambled names, this style of coding is common for JSMacros.

```js
// MinecraftClient is class_310
let MinecraftClient = Packages.net.minecraft.class_310;
// MinecraftClient.getInstance() is method_1551
let client = MinecraftClient.method_1551();
// MinecraftClient.player is field_1724
let player = client.field_1724;

// player may be null if no worlds are open
if (player != null) {
  // EntityLike.getBlockPos() is method_24515
  let blockPos = player.method_24515();

  console.log(blockPos);
}
```

Code such as this is hard to write and without proper commenting, is painful to use when imported as a package.

## Runtime Deobfuscation

In JSCore, **net.minecraft** classes can be referenced by their readable name.

### 1. Import the Package

Add import **yarnwrap-extra** in dependencies.

```js
// package.json
{
  // ...
  dependencies: {
     "yarn-extra": "0.1.0",
     // ...
  }
}
```

### 2. Use the Package

Instead of using **Packages** for obfuscated classes, use **Yarn** as the import entry point.

```js
// init.js
let { MinecraftClient } = Yarn.net.minecraft.client;
let player = MinecraftClient.getInstance().player;

// player may be null if no worlds are open
if (player != null) {
  console.log(player.getBlockPos());
}
```

## Examples

### Example 1: Printing to Chat without `console`

The code below prints "Hello JSCore!" to chat in the yellow when ran.

```js
let { MinecraftClient } = Yarn.net.minecraft.client;
let { Formatting } = Yarn.net.minecraft.util;
let { Text } = Yarn.net.minecraft.text;

// In game chat only exist when the player is in a world.
if (MinecraftClient.getInstance().player != null) {
  MinecraftClient.getInstance()
    .inGameHud.getChatHud()
    .addMessage(Text.literal("Hello JSCore!").formatted(Formatting.YELLOW));
}
```

> This is equivalent to
>
> ```js
> console.print("\u00A7eHello JSCore!");
> ```
>
> The string is made using a MOTD creator tool.

### Example 2: Spinning Player

The code below pans the player clockwise really slowly for 20 seconds.

```js
let { MinecraftClient } = Yarn.net.minecraft.client;

if (MinecraftClient.getInstance().player != null) {
  let yaw = MinecraftClient.getInstance().player.getYaw();

  let interval = setInterval(() => {
    let player = MinecraftClient.getInstance().player;
    if (player != null) {
      yaw += 0.1;
      player.setYaw(yaw);
    }
  }, 5);

  setTimeout(() => interval.cancel(), 20000);
}
```

You may listen to the tick events instead of using a timer.

### Example 3: Command Registration without `command`

The code below registers a command in the FabricMC way.

```js
let { ClientCommandRegistrationCallback, ClientCommandManager } =
  Packages.net.fabricmc.fabric.api.client.command.v2;

function onCallback(dispatcher, _registry) {
  dispatcher.register(
    ClientCommandManager.literal("coolCommand").executes((ctx) => {
      console.log("Hello from command!");
      return 1;
    }),
  );
}

ClientCommandRegistrationCallback.EVENT.register(
  new ClientCommandRegistrationCallback({ register: onCallback }),
);
```

Each time you restart JSCore, a new listener is added to the event. To prevent this, you may want to set a persistent global variable. By convention, **module.globals.yourPackageName** is given to that package.

```js
module.globals ??= {};
module.globals.myPackage ??= {};

if (module.globals.myPackage.isRegistered) {
  /* command previously registered, do nothing */
} else {
  /* register the command */
  module.globals.myPackage.isRegistered = true;
}
```

> This is equivalent to
>
> ```js
> let command = require("command");
> command.register({
>   name: "coolCommand",
>   execute: () => console.log("Hello from command!"),
> });
> ```

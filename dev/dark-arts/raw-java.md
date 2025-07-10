# Rhino Java Features

[Rhino](https://rhino.github.io) allows Java classes and objects to be used from JavaScript.

| Including                              | Such as                              |
| -------------------------------------- | ------------------------------------ |
| The Java standard library              | java.net.http.HttpClient             |
| Libraries used by Minecraft            | org.apache.commons.io.FileUtils      |
| Other mods, and libraries used by them | net.fabricmc.api.ModInitializer      |
| Minecraft internals                    | net.minecraft.client.MinecraftClient |

> More about accessing Minecraft internals in a bit.

## Basic Usage

Java classes are imported from the **Package** object, for example **java.util.ArrayList** can be accessed from `Packages.java.util.ArrayList`.

### Example: Reading a File

To read a file using [**java.nio.file**](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/package-summary.html), we use the [**Files.readString**](<https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Files.html#readString(java.nio.file.Path)>) method, which takes a [**Path**](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Path.html) as argument.

```js
let { Files } = Packages.java.nio.file;
let { FabricLoader } = Packages.net.fabricmc.loader.api;

// .minecraft/config/jscore/
let configRoot = FabricLoader.getInstance().getConfigDir().resolve("jscore");
// .minecraft/config/jscore/modules/fs/README.md
let path = configRoot.resolve("modules/fs/README.md");

let content = Files.readString(path);
console.log(content);
```

This is equivalent to using **fs**:

```js
let fs = require("fs");

let content = fs.readFileSync("modules/fs/README.md", "utf8");
console.log(content);
```

<!-- how to extend classes? -->

## Implementing Interfaces

An object that implements an interface can be created if all methods required by the interface are defined.

### Example: Listening to an Event

To listen to the [**START_CLIENT_TICK**](https://maven.fabricmc.net/docs/fabric-api-0.34.8+1.17/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.html#START_CLIENT_TICK) event, we need to create an object that implements the [**StartTick**](https://maven.fabricmc.net/docs/fabric-api-0.34.8+1.17/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.StartTick.html) interface, which implements a single method [**onStartTick**](<https://maven.fabricmc.net/docs/fabric-api-0.34.8+1.17/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.StartTick.html#onStartTick(net.minecraft.client.MinecraftClient)>).

```js
let { START_CLIENT_TICK, StartTick } =
  Packages.net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;

let counter = 0;

let listener = new StartTick({
  onStartTick: (client) => {
    counter++;
    console.log(counter);
  },
});

START_CLIENT_TICK.register(listener);
```

If this code is in **init.js**, then an additional listener is registered at every restart. You may want to set a value at **module.globals** to indicate a listener has previously been registered.

<!-- idiomatic equivalent -->

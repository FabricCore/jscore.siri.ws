# Listening To Events

Event listeners can be added and removed using the **listener** package, each event needs to be defined before they can be listened to, the **fabric-api-events** package defines all events provided by the Fabric API.

## Add Dependencies

Include [**listener**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/listener#listener) and [**fabric-api-events**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/fabric-api-events#fabric-api-events) as dependencies in **package.json**.

```js
// package.json
{
  // ...
  dependencies: {
    "listener": "0.1.0",
    "fabric-api-events": "0.1.0",
    // ...
  }
}
```

If **listener** or **fabric-api-events** are not installed, you can run **/pully insall** to install any missing dependencies.

## Register a Listener

To see a list of events, visit the [fabric-api-events](https://github.com/fabriccore/fabric-api-events-js) repository.

### Register by Name

The code prints a message in chat when a player starts/stops sneaking.

```js
// init.js

// Holds the previous state
// If the current state is different to the previous state,
// then we know the player has started/stopped sneaking.
let previouslySneaking = false;

addEventListener("startClientTickEvent", (client) => {
  // do nothing if the player is not in a world
  if (client.player == null) return;

  if (client.player.isSneaking() && !previouslySneaking) {
    console.log("You are now sneaking.");
    previouslySneaking = true;
  } else if (!client.player.isSneaking() && previouslySneaking) {
    console.log("You are no longer sneaking.");
    previouslySneaking = false;
  }
});
```

By searching the fabric-api-events repository, we know **StartClientTickEvent** aliases to [**ClientTIckEvents.START_CLIENT_TICK**](https://maven.fabricmc.net/docs/fabric-api-0.129.0+1.21.7/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.StartTick.html) in Fabric API. The listener can take a [**MinecraftClient**](https://maven.fabricmc.net/docs/yarn-1.21.7+build.1/net/minecraft/client/MinecraftClient.html) as parameter. The name of the event is case insensitive.

> ### The Event Object Syntax
>
> The event object syntax is an alternative to the **addEventListener** syntax.
>
> ```js
> // init.js
> let { StartClientTickEvent } = require("listener").events;
>
> let previouslySneaking = false;
>
> StartClientTickEvent.register((client) => {
>   if (client.player == null) return;
>
>   if (client.player.isSneaking() && !previouslySneaking) {
>     console.log("You are now sneaking.");
>     previouslySneaking = true;
>   } else if (!client.player.isSneaking() && previouslySneaking) {
>     console.log("You are no longer sneaking.");
>     previouslySneaking = false;
>   }
> });
> ```

### Register by Event

You can also register to an event by providing the **Event** object. This only work if the event definition is provided. In the case of Fabric API events, their definitions are provided by the **fabric-api-events** package.

The syntax for importing Java classes is covered in the [Raw Java Imports](../dark-arts/raw-java) section.

```js
// init.js
let { ClientTickEvents } =
  Packages.net.fabricmc.fabric.api.client.event.lifecycle.v1;

let previouslySneaking = false;

addEventListener(ClientTickEvents.START_CLIENT_TICK, (client) => {
  if (client.player == null) return;

  if (client.player.isSneaking() && !previouslySneaking) {
    console.log("You are now sneaking.");
    previouslySneaking = true;
  } else if (!client.player.isSneaking() && previouslySneaking) {
    console.log("You are no longer sneaking.");
    previouslySneaking = false;
  }
});
```

An error would occur if that event does not exist.

### Register Options

**addEventListener** and **EventObject.register** accepts an additional parameter. The parameter optionally contains two fields.

| Field name | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `priority` | The priority of the listener, lower is earlier (default: 10000) |
| `id`       | The id of the listener (default is randomised)                  |

Only one listener can have a particular ID. If two listeners are registered with the same ID, the first listener is removed when the second listener registers.

## Unregister a Listener

All events are removed when JSCore stops (including restarts), so the same listener will not be registered multiples times each time **init.js** runs.

### Unregister with Listener Object

You can unregister a listener if you have the listener object with **cancel()**.

The code below stops the listener after 2 seconds.

```js
// init.js
let counter = 0;

let counterListener = addEventListener("startClientWorldTickEvent", () => {
  counter++;
  console.log(`Current count: ${counter}`);
});

setTimeout(() => {
  counterListener.cancel();
}, 2000);
```

### Unregister with removeEventListener

**removeEventListener** is an alternative to the **cancel()** method.

```js
removeEventListener(counterListener);
```

### Unregister by ID

If you know the ID of the listener, you can unregister it by its ID.

```js
// init.js
let counter = 0;

addEventListener(
  "startClientWorldTickEvent",
  () => {
    counter++;
    console.log(`Current count: ${counter}`);
  },
  { id: "myNamedListener" },
);

setTimeout(() => {
  removeEventListener("myNamedListener");
}, 2000);
```

## Create Event Definitions

If no packges provide the event definitions you are looking for, can you define your own with **addEvent(name, event, interface, method)**.

For example, if **StartClientTickEvent** is not previously defined.

- The **Event&lt;T&gt;** is at [**ClientTickEvents.START_CLIENT_TICK**](https://maven.fabricmc.net/docs/fabric-api-0.129.0+1.21.7/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.html).
- The **Event&lt;T&gt;** requires all listeners to implement [**ClientTickEvents.StartTick**](https://maven.fabricmc.net/docs/fabric-api-0.129.0+1.21.7/net/fabricmc/fabric/api/client/event/lifecycle/v1/ClientTickEvents.StartTick.html).
- Which has one method that is **onStartTick**.

```js
// init.js
let { ClientTickEvents } =
  Packages.net.fabricmc.fabric.api.client.event.lifecycle.v1;

let { addEvent } = require("listener");

addEvent(
  "StartClientTickEvent",
  ClientTickEvents.START_CLIENT_TICK,
  ClientTickEvents.StartTick,
  "onStartTick",
);
```

### Tail and Continuation

The **addEvent** method takes two additional parameters.

#### Tail(output, args) -> newOutput

Modifies the output of each listener.

```js
// these are examples tail functions

// default tail function if it is not specified
let identity = (output, _) => output;

// if the output of a listener is undefined (no return value)
// then the output defaults to true
let defaultToTrue = (output, _) => output ?? true;

// default to null
let defaultToTrue = (output, _) => output ?? null;
```

Tail functions must work when output is `undefined`, as it is also used to get the default value of the listener.

#### Continuation(output, args) -> [true, newArguments] or [false, finalOutput]

Determine whether the current listener should stop event propagation.

```js
// these are example continuation function

// default continuation function if it is not specified
let identity = (_, args) => [true, args];

// if event propagation should continue, return [true, newArgs]
// where newArgs is the arguments to the method following the current one
let onlyIfTrue = (output, args) => {
  if (output) {
    return [true, args];
  } else {
    return [false, output];
  }
};
```

Combining the two, let's define some **EntitySleepEvents**.

```js
// init.js
let { EntitySleepEvents } = Packages.net.fabricmc.fabric.api.entity.event.v1;

let { addEvent } = require("listener");

// listeners that returns `void` usually does not require
// tail or continuation functions
addEvent(
  "EntityStartSleepingEvent",
  EntitySleepEvents.START_SLEEPING,
  EntitySleepEvents.StartSleeping,
  "onStartSleeping",
);

// allow bed only returns true if all listeners return true
// in other words, stop propagation and return false if false is returned
// the default value is true
addEvent(
  "EntityStartSleepingEvent",
  EntitySleepEvents.ALLOW_BED,
  EntitySleepEvents.AllowBed,
  "allowBed",
  (output, _) => output ?? true, // default value
  (output, args) => {
    if (output) {
      return [true, args]; // continue propagation
    } else {
      return [false, false]; // stop and return false
    }
  },
);

// returns the original direction if non is specified
// the 3rd argument to the listener is modified each time
// sleeping direction is changed
addEvent(
  "EntityModifySleepingDirectionEvent",
  EntitySleepEvents.MODIFY_SLEEPING_DIRECTION,
  EntitySleepEvents.ModifySleepingDirection,
  "modifySleepingDirection",
  (output, [_, _, originalDirection]) => {
    if (output == undefined || output == null) {
      return originalDirection; // default value
    } else {
      return output;
    }
  },
  (output, args) => {
    args[2] = output; // update argument
    return [true, args]; // continue propagation
  },
);
```

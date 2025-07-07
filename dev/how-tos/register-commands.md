# Your First Command

Declarative command registration can be done with the **command** package. If you wish to register commands through FabricMC directly, [that guide is still WIP]().

## Add Dependencies

Include [**command**](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/command#command) as a dependency in **package.json**.

```js
// package.json
{
  // ...
  dependencies: {
    "command": "0.1.0",
    // ...
  }
}
```

If **command** is not installed, you can run **/pully install** to install any missing dependencies.

```sh
/pully install
```

## Register Command

Put the following code in **init.js** so `/myCommand` is registered when JSCore starts.

```js
// init.js
let command = require("command");

command.register({
  name: "myCommand",
  execute: () => {
    console.log("The command runs.");
  },
});
```

Restart JSCore to run the script.

```sh
/jscore restart
```

To register a new command, rejoin the world you are currently in, then run

```sh
/myCommand
```

The following message should display.

```
[LOG] The command runs.
```

> To update an existing command, you won't need to rejoin the world. Modify **init.js**
>
> ```js
> // init.js
> let command = require("command");
>
> command.register({
>   name: "myCommand",
>   execute: () => {
>     console.log("The command has been updated.");
>   },
> });
> ```
>
> Then run
>
> ```sh
> /jscore restart
> ```
>
> Run **/myCommand** again to see the command updated.

## Create Subcommands

**command.register** takes a **Command** object as argument, which has the following fields.

| Field                  | Description                         |
| ---------------------- | ----------------------------------- |
| name                   | The name of the command.            |
| execute (optional)     | What happens when the command runs. |
| subcommands (optional) | A map of **Commands**.              |
| args (optional)        | A map of **Arguments**.             |

> **name** is not required for subcommands.

For example, to register these subcommands.

- **/myCommand sub1**
- **/myCommand sub1 sub2**
- **/myCommand sub3**

We write

```js
// init.js
let command = require("command");

command.register({
  name: "myCommand",
  execute: () => console.log("You ran /myCommand"),

  subcommands: {
    sub1: {
      execute: () => console.log("You ran /myCommand sub1"),
      subcommands: {
        sub2: {
          execute: () => console.log("You ran /myCommand sub1 sub2"),
        },
      },
    },

    sub3: {
      execute: () => console.log("You ran /myCommand sub3"),
    },
  },
});
```

> **/jscore restart** and rejoin the game, as we are registering new (sub)commands.

Since **execute** is optional, if you want to create a command only at

- **/myCommand sub1 sub2** but not
- **/myCommand sub1** or
- **/myCommand**

Simply remove the **execute** field for all other commands.

```js
// init.js
let command = require("command");

command.register({
  name: "myCommand",
  subcommands: {
    sub1: {
      subcommands: {
        sub2: {
          execute: () => console.log("You ran /myCommand sub1 sub2"),
        },
      },
    },
  },
});
```

> Again **/jscore restart** and rejoin game, because we are removing subcommands.

## Taking Arguments

An **Argument** object consists of fields.

| Field                  | Description                         |
| ---------------------- | ----------------------------------- |
| type                   | Data type of the argument.          |
| suggests (optional)    | Suggestions for the argument.       |
| execute (optional)     | What happens when the command runs. |
| subcommands (optional) | A map of **Commands**.              |
| args (optional)        | A map of **Arguments**.             |

To create the following commands.

- **/myCommand greet &lt;name&gt;**
- **/myCommand escape &lt;name&gt; &lt;time&gt;**

```js
// init.js
let { StringArgumentType } = com.mojang.brigadier.arguments;
let command = require("command");

// First, write the code for what each subcommand does.
function greetExecute(ctx) {
  let name = StringArgumentType.getString(ctx, "name");
  console.log(`Hello ${name}.`);
}

function escapeExecute(ctx) {
  let name = StringArgumentType.getString(ctx, "name");
  let time = StringArgumentType.getString(ctx, "time");
  console.log(`Um ${name}, it's ${time} and I gotta go, cya.`);
}

// Then, build up the subcommand structure.
function greetSubcommand() {
  return {
    args: {
      name: {
        type: StringArgumentType.word(),
        execute: greetExecute,
      },
    },
  };
}

function escapeSubcommand() {
  return {
    args: {
      name: {
        type: StringArgumentType.word(),
        args: {
          time: {
            type: StringArgumentType.greedyString(),
            execute: escapeExecute,
          },
        },
      },
    },
  };
}

// Finally, register the command.
command.register({
  name: "myCommand",
  subcommands: {
    greet: greetSubcommand(),
    escape: escapeSubcommand(),
  },
});
```

To see a list of argument types, click [here](https://github.com/Mojang/brigadier/tree/master/src/main/java/com/mojang/brigadier/arguments).

> To keep **init.js** free of clutter, you can move the functions to a separate file, and import them in **init.js**.

## Command Suggestions

Suggestions are arguments that "show up as you type". One such example is **/pully install**, which shows you a list of packages as you type.

### Suggestions as a List

The simplest way is to add suggestions as a list.

Modifying the **greetSubcommand** function in the previous example.

```js
// init.js
function greetSubcommand() {
  return {
    args: {
      name: {
        type: StringArgumentType.word(),
        execute: greetExecute,
        suggests: ["Joe", "Bob", "Alice"],
      },
    },
  };
}
```

> **/jscore restart** and rejoin game is required for suggestions.

You should see the suggestions as you type out **/myCommand greet &lt;name&gt;**.

### Dynamic Suggestions

You can also pass a generator function, so new suggestions can be generated each time it is needed to use the most updated information, for example time.

Modifying the **escapeSubcommand** function in the previous example.

```js
// init.js
function escapeSubcommand() {
  return {
    args: {
      name: {
        type: StringArgumentType.word(),
        suggests: ["Joe", "Bob", "Alice"],
        args: {
          time: {
            type: StringArgumentType.greedyString(),
            execute: escapeExecute,
            suggests: () => {
              let suggestions = [];
              let now = new Date();

              for (let i = 0; i < 20; i++) {
                // add a suggestion entry
                suggestions.push(now.toUTCString());
                // increment time by 10 minutes
                now.setMinutes(now.getMinutes() + 10);
              }

              return suggestions;
            },
          },
        },
      },
    },
  };
}
```

The command **/myCommand escape &lt;name&gt; &lt;time&gt;** now suggests the current time, 10 minutes after current time, 20 minutes after, and so on.

> The generator function takes **CommandContext** as an argument, learn more about **CommandContext** on [Fabric Docs](https://docs.fabricmc.net/develop/commands/suggestions).

<!--
### Using Suggestion Providers

You can also use existsing suggestion providers in Minecraft or in other mods.

```js
let net = Packages.ws.siri.jscore.mapping.JSPackage.getRoot().net;
let nameSuggestions = net.minecraft.command.suggestion.ASK_SERVER;

// init.js
function greetSubcommand() {
  return {
    args: {
      name: {
        type: StringArgumentType.word(),
        execute: greetExecute,
        suggests: nameSuggestions,
      },
    },
  };
}
```
-->

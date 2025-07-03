# Built-in Commands

JSCore is a thin wrapper around FabricMC, but the mod comes with some commands for convenience.

## /jscore eval &lt;script&gt;

Executes a JS expression.

### Basic Usage

For example, to show 1 + 1 = 2
```js
/jscore eval 1 + 1
```

### Example: Fibonacci Numbers

Fibonacci numbers are defined as
- U<sub>1</sub> = 1
- U<sub>2</sub> = 1
- U<sub>n</sub> = U<sub>n-1</sub> + U<sub>n-2</sub>

To find the first 10 fibonacci numbers, normally we write
```js
function fib(n) {
    switch(n) {
        case 1:
        case 2:
            return 1;
        default:
            return fib(n - 1) + fib(n - 2;)
    }
}

let firstTenFibs = [];

for(let i = 1; i <= 10; i++) {
    firstTenFibs.push(fib(i));
}

firstTenFibs.join(', ')
```
We can squeeze them into one line by removing all the line breaks, which gives us the command below.

```js
/jscore eval function fib(n) { switch(n) { case 1: case 2: return 1; default: return fib(n-1)+fib(n-2)} }; let firstTenFibs=[]; for(let i=1;i<=10;i++) firstTenFibs.push(fib(i)); firstTenFibs.join(', ')
```
## /jscore web &lt;url&gt;

Download a script from ***url*** and execute it.

## /jscore require &lt;mode&gt; &lt;file&gt;

Evaluate a JS script file in `~/.minecraft/config/jscore`.
- **Strict** mode will execute the file no matter what.
- **Lazy** mode will execute the file only if it has not been executed before.

```js
/jscore require strict init.js
```

## /jscore snapshot

All files related to JSCore are in `~/.minecraft/config/jscore`.

### /jscore snapshot create

Creates a snapshot (backup) of the folder, and puts it in `~/.minecraft/config/jscore-snapshots`.

You can optionally give the snapshot a name with **/jscore snapshot create &lt;label&gt;**. If there is already another snapshot with the same name, the new snapshot will replace the old one.
```js
/jscore snapshot create bob-the-snapshot
```

### /jscore snapshot delete &lt;label&gt;

Delete a snapshot.

```js
/jscore snapshot delete bob-the-snapshot.zip
```

### /jscore snapshot restore &lt;label&gt;

Restore files in `~/.minecraft/config/jscore` to a previous snapshot (backup).

```js
/jscore snapshot restore bob-the-snapshot.zip
```

The current files in `~/.minecraft/config/jscore` will be lost after this.

### /jscore snapshot pull &lt;url&gt;

Download a snapshot from ***url*** and replace `~/.minecraft/config/jscore` with that snapshot.

```js
/jscore snapshot pull https://jscore.siri.ws/bootstrap.zip
```

The current files in `~/.minecraft/config/jscore` will be lost after this.
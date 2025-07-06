# Quickstart

This guide is for **JSCore 0.2.0**, currently supporting **1.21.5** only.

### 1. Install JSCore

JSCore requires Fabric API and Yarnwrap
- Download JSCore ([Modrinth](https://modrinth.com/mod/jscore/versions))
- Download Yarnwrap ([Modrinth](https://modrinth.com/mod/yarnwrap/versions))
- Download Fabric API ([Modrinth](https://modrinth.com/mod/fabric-api/versions?g=1.21.5))

### 2. Setup JSCore

After launching the game, join a world to run the command
```sh
/jscore snapshot pull http://jscore.siri.ws/bootstrap.zip
```
Then either restart the game or simulate a restart with
```sh
/jscore restart
``` 
You will need to rejoin world for changes to take effect.

### 3. Pre-flight Check

Check if the JS runtime is working.
```sh
/jscore eval 1 + 1
```

Or check your in-game position.
```sh
/jscore eval let root = Packages.ws.siri.jscore.mapping.JSPackage.getRoot();
```
```sh
/jscore eval let client = root.net.minecraft.client.MinecraftClient.getInstance();
```
```sh
/jscore eval client.player.getBlockPos().toString()
```

### 4. Installing Packages

We have a [list of all packages](https://github.com/FabricCore/jscore-openrepo?tab=readme-ov-file#all-packages) you can install without restarting the game.
```sh
/pully install package1 package2 ...
```
Can't make up your mind? Join [**Discord**](https://discord.gg/XfSZ5tc7Sk) to learn more about the project.

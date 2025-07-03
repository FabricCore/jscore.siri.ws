# Pully

Pully is a package manager.

## /pully install [list of packages...]

Install packages from a [package repository](https://github.com/FabricCore/jscore-openrepo), and their dependencies.

```js
/pully install dummy1
```

Dummy1 depends on Dummy2, so Dummy2 is also installed.

Pully will not reinstall packages that are up to date.
# Pully

A package manager to handle packages and dependencies - [repository view](https://github.com/FabricCore/jscore-openrepo/tree/master/packages/pully#pully)

### Caution: Packages Can be Dangerous

Just like malicious mods, malicious packages can damage your computer, some package repositories are safer than others.

| Repository Name | Security Level                           | Recommendation                           |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| core            | Highest, all updates are reviewed        | Packages are safe                        |
| user            | Varies, packages are reviewed regularly. | Only install packages from trusted authors |

## /pully install [list of packages...]

Install packages from a [package repository](https://github.com/FabricCore/jscore-openrepo).

```sh
/pully install dummy1
```

`dummy1` depends on `dummy2`, so `dummy2` is also installed.

Pully will not reinstall packages that are

- Already up to date
- Is not installed with pully
- Is a Git repository (so you don't accidentally delete the package you are working on)

The install command will also **update all packages** that are not up to date. The command below will update all packages.

```sh
/pully install
```

## /pully uninstall [list of packages...]

Uninstall packages.

```sh
/pully uninstall dummy1
```

If `dummy1` is the only package that requires `dummy2`, and `dummy2` is not installed explicitly, it will also be removed.

Pully will not remove packages that are

- Not installed with pully
- Is a Git repository

The uninstall command will also **remove all unused packages**.

---

To remove a package that is not installed with pully or is a Git repository, you can delete the package from `.minecraft/config/jscore/modules/`.

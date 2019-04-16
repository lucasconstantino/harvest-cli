# harvest-cli

Unofficial Harvest CLI focused on time-tracking creation.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/harvest-cli.svg)](https://npmjs.org/package/harvest-cli)
[![Downloads/week](https://img.shields.io/npm/dw/harvest-cli.svg)](https://npmjs.org/package/harvest-cli)
[![License](https://img.shields.io/npm/l/harvest-cli.svg)](https://github.com/lucasconstantino/harvest-cli/blob/master/package.json)
[![Build Status](https://travis-ci.org/TallerWebSolutions/apollo-cache-instorage.svg?branch=master)](https://travis-ci.org/TallerWebSolutions/apollo-cache-instorage)
[![coverage](https://img.shields.io/codecov/c/github/TallerWebSolutions/apollo-cache-instorage.svg?style=flat-square)](https://codecov.io/github/TallerWebSolutions/apollo-cache-instorage) [![Greenkeeper badge](https://badges.greenkeeper.io/lucasconstantino/harvest-cli.svg)](https://greenkeeper.io/)

<!-- toc -->

- [harvest-cli](#harvest-cli)
- [Usage](#usage)
- [Commands](#commands)
  - [`harvest help [COMMAND]`](#harvest-help-command)
  - [`harvest log`](#harvest-log)
  - [`harvest log:git REF`](#harvest-loggit-ref)
  - [`harvest log:list`](#harvest-loglist)
- [Not official](#not-official)
    <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g harvest-cli
$ harvest COMMAND
running command...
$ harvest (-v|--version|version)
harvest-cli/0.1.10 linux-x64 node-v10.5.0
$ harvest --help [COMMAND]
USAGE
  $ harvest COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [harvest-cli](#harvest-cli)
- [Usage](#usage)
- [Commands](#commands)
  - [`harvest help [COMMAND]`](#harvest-help-command)
  - [`harvest log`](#harvest-log)
  - [`harvest log:git REF`](#harvest-loggit-ref)
  - [`harvest log:list`](#harvest-loglist)
- [Not official](#not-official)

## `harvest help [COMMAND]`

display help for harvest

```
USAGE
  $ harvest help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `harvest log`

Log time

```
USAGE
  $ harvest log

DESCRIPTION
  ...
  Registers a new time-tracking log
```

![log](docs/first-log.gif)

_See code: [lib/commands/log/index.js](https://github.com/lucasconstantino/harvest-cli/blob/v0.1.10/lib/commands/log/index.js)_

## `harvest log:git REF`

Log from Git

```
USAGE
  $ harvest log:git REF

ARGUMENTS
  REF  [default: HEAD^..HEAD] a valid git reference to use as source

DESCRIPTION
  ...
  Registers a new time-tracking log using Git commit messages as notes
```

![log](docs/log:git.gif)

_See code: [lib/commands/log/git.js](https://github.com/lucasconstantino/harvest-cli/blob/v0.1.10/lib/commands/log/git.js)_

## `harvest log:list`

List

```
USAGE
  $ harvest log:list

OPTIONS
  -x, --extended       show extra columns
  --columns=columns    only show provided columns (comma-separated)
  --csv                output is csv format
  --filter=filter      filter property by partial string matching, ex: name=foo
  --no-header          hide table header from output
  --no-truncate        do not truncate output to fit screen
  --page=page          [default: 1] page to load
  --per-page=per-page  [default: 10] entries per page
  --sort=sort          property to sort by (prepend '-' for descending)

DESCRIPTION
  ...
  Lists time-tracking log entries
```

![log](docs/log:list.gif)

_See code: [lib/commands/log/list.js](https://github.com/lucasconstantino/harvest-cli/blob/v0.1.10/lib/commands/log/list.js)_

<!-- commandsstop -->

# Not official

This project is _not official_, has no participation from the [Harvest](https://www.getharvest.com/) team, has to commercial purpose, and cannot respond for issues related to the Harvest company. If you work at Harvest and think this project is anyhow inappropriate, please contact me. Also, if you work at Harvest and think you can benefit from the name `harvest-cli`, also contact me and I'll be glad to make it available.

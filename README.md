[![npm](https://img.shields.io/npm/v/kronos-koa.svg)](https://www.npmjs.com/package/kronos-koa)
[![Greenkeeper](https://badges.greenkeeper.io/Kronos-Integration/kronos-koa.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/Kronos-Integration/kronos-koa)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/Kronos-Integration/kronos-koa.png)](http://travis-ci.org/Kronos-Integration/kronos-koa)
[![codecov.io](http://codecov.io/github/Kronos-Integration/kronos-koa/coverage.svg?branch=master)](http://codecov.io/github/Kronos-Integration/kronos-koa?branch=master)
[![Coverage Status](https://coveralls.io/repos/Kronos-Integration/kronos-koa/badge.svg)](https://coveralls.io/r/Kronos-Integration/kronos-koa)
[![Known Vulnerabilities](https://snyk.io/test/github/Kronos-Integration/kronos-koa/badge.svg)](https://snyk.io/test/github/Kronos-Integration/kronos-koa)
[![GitHub Issues](https://img.shields.io/github/issues/Kronos-Integration/kronos-koa.svg?style=flat-square)](https://github.com/Kronos-Integration/kronos-koa/issues)
[![Dependency Status](https://david-dm.org/Kronos-Integration/kronos-koa.svg)](https://david-dm.org/Kronos-Integration/kronos-koa)
[![devDependency Status](https://david-dm.org/Kronos-Integration/kronos-koa/dev-status.svg)](https://david-dm.org/Kronos-Integration/kronos-koa#info=devDependencies)
[![docs](http://inch-ci.org/github/Kronos-Integration/kronos-koa.svg?branch=master)](http://inch-ci.org/github/Kronos-Integration/kronos-koa)
[![downloads](http://img.shields.io/npm/dm/kronos-koa.svg?style=flat-square)](https://npmjs.org/package/kronos-koa)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# kronos-koa

Koa modifications needed by Kronos

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [KronosKoa](#kronoskoa)
    -   [use](#use)
    -   [callback](#callback)
    -   [hasMiddleware](#hasmiddleware)
    -   [delete](#delete)
-   [respond](#respond)

## KronosKoa

**Extends Koa**

Kronos variant of koa

### use

Overwrite the super function. It will update the middleware chain

**Parameters**

-   `fn`  

### callback

Overwrites the callback. This is now a dynamic callback.
The returned function takes the changing generator chain
instead of a fixed one.

### hasMiddleware

Returns true if there is still registered middleware

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** status True if there is still registered middleware

### delete

Removes an existing generator function

**Parameters**

-   `fn` **GeneratorFunction** The generator function to be deleted

Returns **void** 

## respond

Response helper.
copied from the original

**Parameters**

-   `ctx`  

# install

With [npm](http://npmjs.org) do:

```shell
npm install kronos-koa
```

# license

BSD-2-Clause

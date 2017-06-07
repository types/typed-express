# Typed express

[![Greenkeeper badge](https://badges.greenkeeper.io/types/npm-express.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/types/npm-express.svg?branch=master)](https://travis-ci.org/types/npm-express)

Typescript Typings for [express](https://github.com/expressjs/express).

## Installation

    typings install --save express

or

    npm install --save-dev types/npm-express#<commit hash>

## Usage

```ts
import express = require('express');

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World');
});

app.listen(3000);
```

[More examples](./test)

## Contributing
You can run the tests by running `npm run build` and then `npm run test`.


---------------------------------------

_Based on the typings by [Boris Yankov](https://github.com/borisyankov) on [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)_


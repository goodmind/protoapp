# Protoapp

[![Travis](https://img.shields.io/travis/goodmind/protoapp.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/goodmind/protoapphttps://travis-ci.org/goodmind/protoapp)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Generate SPA from ProtoBuf.js

Generate Angular/React application from Google's [Protobuf](https://github.com/google/protobuf)
Just convert `.proto` to `.json` with [protobuf.js](https://github.com/dcodeIO/protobuf.js)

## Install

```sh
$ [sudo] npm i -g protoapp
```

## Usage

Currently only supports Angular 2

```sh
$ protoapp -f proto.json -o src
```

### CLI

[protobuf.js](https://github.com/dcodeIO/protobuf.js) must be installed globally with npm

```sh
$ pbjs ./proto.proto > proto.json
$ protoapp -f proto.json -o src
```

## Contribute

PRs accepted

## License

MIT (c) Goodmind

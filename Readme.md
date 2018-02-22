# Storage Provider

[![Build Status](https://travis-ci.org/Grisu118/StorageProvider.svg?branch=master)](https://travis-ci.org/Grisu118/StorageProvider)
[![npm](https://img.shields.io/npm/v/storageprovider.svg)](https://www.npmjs.com/package/storageprovider)
[![license](https://img.shields.io/github/license/grisu118/storageprovider.svg)](LICENSE)

Small library without any dependencies for accessing localStorage, sessionStorage
and url get params over the same interface.

## Getting Started

Install with npm ``npm i --save storageprovider``


```typescript
import { StorageProvider } from "storageprovider";

const storage = StorageProvider.localStorage("aPrefix");
storage.set("KEY", "a special value");

// ... some code

storage.getAsString("KEY"); // returns "a special value"
storage.getAsNumber("KEY"); // returns undefined
```
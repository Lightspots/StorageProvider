# Storage Provider

[![Build Status](https://github.com/Lightspots>/StorageProvider>/workflows/Node.js+CI/badge.svg)](https://github.com/Lightspots/StorageProvider/actions?query=workflow%3A%22Node.js+CI%22)
[![codecov](https://codecov.io/gh/Lightspots/StorageProvider/branch/master/graph/badge.svg)](https://codecov.io/gh/Lightspots/StorageProvider)
[![npm](https://img.shields.io/npm/v/storageprovider.svg)](https://www.npmjs.com/package/storageprovider)
[![license](https://img.shields.io/github/license/lightspots/storageprovider.svg)](LICENSE)

Small library without any dependencies for accessing localStorage, sessionStorage
and url get params over the same interface.

## Getting Started

Install with npm ``npm i --save storageprovider``


```typescript
import { StorageProvider } from "@lightspots/storageprovider";

const storage = StorageProvider.localStorage("aPrefix");
storage.set("KEY", "a special value");

// ... some code

storage.getAsString("KEY"); // returns "a special value"
storage.getAsNumber("KEY"); // returns undefined
```

For details see [api doc](https://lightspots.github.io/StorageProvider/index.html)

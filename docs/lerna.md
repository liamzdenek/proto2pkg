# Proto2pkg + Lerna

Structure: 
```text
├── genPackages
│   └── packages will go here
├── lerna.json
├── package.json
├── package-lock.json
└── packages
    └── bank-service
        ├── proto2pkg.json
        └── src
            └── main.proto
```

/lerna.json:
```json
{
  "packages": [
    "packages/*",
    "genPackages/*"
  ],
  "version": "0.0.0"
}
```

/package.json:
```json 
{
  "scripts": {
    "generatePackages": "proto2pkg build packages/bank-service --distDir=./genPackages/ --languages=js,ts && lerna bootstrap"
  },
}
```

Packages will be dumped in genPackages, and then you can add them as dependencies through the normal lerna way: modify package.json, add a dependency, then `lerna bootstrap`.
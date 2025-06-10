# er-viewer

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

```sh
npm create @quick-start/electron@latest er-viewer -- --template react-ts

√ Select a framework: » react
√ Add TypeScript? ... No / Yes
√ Add Electron updater plugin? ... No / Yes
√ Enable Electron download mirror proxy? ... No / Yes

cd er-viewer
npm install
npm run dev
```

```
npm i @rexxars/react-split-pane
npm install react-window
npm install react-window react-virtualized-auto-sizer
```
## napi-folder
package.json

```json
{
  "dependencies": {
    "napi-bindings": "file:/./napi-folder/bindings"
  }
}
```
src/preload/index.ts
```ts
import type { Folder, OptParams, TextContent, HomeType, DiskInfo } from 'napi-bindings'
const isDev = process.env.NODE_ENV === 'development'

console.log(`isDev: ${isDev}`)
const nativePath = isDev
  ? path.join(__dirname, '../../napi-folder')
  : path.join(process.resourcesPath, 'napi-folder')

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FolderApi } = require(nativePath)

```

```sh
cd napi-folder
cargo test
cargo build --release --platform
```

## deploy


er-viewer/package.json
```json
{
  "build": {
    "appId": "erviewer",
    "productName": "erViewer",
    "directories": {
      "output": "dist"
    },
    "files": [
      "out/**/*",
      "dist/**/*",
      "package.json"
    ],
    "win": {
      "target": "nsis"
    },
    "extraResources": [
      "./napi-folder/index.js",
      "./napi-folder/napi-folder.win32-x64-msvc.node"
    ]
  }
}
```

```sh
npm build build:win
```

## fontawesome
```
npm install @fortawesome/react-fontawesome
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
```
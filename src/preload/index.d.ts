import { ElectronAPI } from '@electron-toolkit/preload'
import type {FolderAPI} from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: FolderAPI
  }
}

import { FolderTree, TreeItem } from '@renderer/types'
import { DiskInfo, Item, OptParams } from 'napi-bindings'
import { FolderTreeStore } from '@renderer/store/folderTreeStore'
import { FolderTreeRefStore } from '@renderer/store/folderTreeRefStore'
import { SelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'

export const SEP = '\\'
export const TREE_ITEM_SIZE = 18
export const TREE_DEPT_SIZE = 13
export const LIST_ITEM_SIZE = 18

const treeParams: OptParams = {
  cache_nm: 'folder-tree',
  meta_types: ['Ext', 'Mt', 'Sz', 'Tm'],
  ordering: [
    { nm: 'Dir', asc: 'Asc' },
    { nm: 'Nm', asc: 'Asc' }
  ]
}

export const selectTreeItem = (
  selectedItem: TreeItem | undefined,
  newItem: TreeItem | undefined
): void => {
  if (selectedItem) {
    delete selectedItem?.selected
  }
  if (newItem) {
    newItem.selected = true
  }
}

const fromDisk = (disk: DiskInfo): TreeItem => {
  return {
    nm: disk.path.replaceAll(SEP, ''),
    full_path: disk.path,
    dir: true
  }
}

const fromItem = (item: Item, parentTreeItem: TreeItem): TreeItem => {
  const basePath = parentTreeItem.full_path
  const fullPath = basePath.endsWith(`:${SEP}`)
    ? [basePath.replaceAll(SEP, ''), item.nm].join(SEP)
    : [basePath, item.nm].join(SEP)
  const treeItem: TreeItem = {
    nm: item.nm.replaceAll(SEP, ''),
    full_path: fullPath,
    parent: parentTreeItem.parent
  }
  if (item.dir != undefined) treeItem.dir = item.dir
  if (item.ext != undefined) treeItem.ext = item.ext
  if (item.mt != undefined) treeItem.mt = item.mt
  if (item.sz != undefined) treeItem.sz = Number(item.sz)
  if (item.tm != undefined) treeItem.tm = Number(item.tm)

  if (parentTreeItem) {
    treeItem.parent = parentTreeItem
  }
  return treeItem
}

export function getNthParent(item: TreeItem | undefined, n: number): TreeItem | undefined {
  let current = item
  let count = 0

  while (current && count < n) {
    current = current?.parent
    count++
  }

  return current
}

export function getNthOfTreeItems(
  treeItems: TreeItem[] | undefined,
  nth: number,
  curIdx = 0
): [TreeItem | undefined, number] {
  let findTreeItem: TreeItem | undefined = undefined
  if (!treeItems) {
    return [findTreeItem, curIdx]
  }
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    curIdx++
    if (curIdx - 1 == nth) {
      findTreeItem = treeItems[idxItem]
      break
    }
    const [findItem, nextIdx] = getNthOfTreeItems(treeItems[idxItem]?.items, nth, curIdx)
    findTreeItem = findItem
    curIdx = nextIdx
    if (findTreeItem) {
      break
    }
  }
  return [findTreeItem, curIdx]
}

export function getCountOfTreeItems(treeItems: TreeItem[] | undefined): number {
  if (!treeItems) {
    return 0
  }
  let count = treeItems.length
  for (let idxItem = 0; idxItem < treeItems.length; idxItem++) {
    const treeItem = treeItems[idxItem]
    if (!treeItem.items) {
      continue
    }
    count += getCountOfTreeItems(treeItem.items)
  }
  return count
}

export const fetchDisks = async (): Promise<FolderTree> => {
  const disks: DiskInfo[] = await window.api.getDisks()
  return disks.map(fromDisk)
}

export const fetchTreeItems = async (
  treeItem: TreeItem | undefined,
  appendChildItems: boolean | undefined = true
): Promise<TreeItem[] | undefined> => {
  if (!treeItem) {
    return undefined
  }
  const folder = await window.api.readFolder({ ...treeParams, path_str: treeItem.full_path })
  const folderItems = folder?.item?.items
  if (folderItems) {
    const treeItems = folderItems.map((folderItem) => {
      return fromItem(folderItem, treeItem)
    })
    if (appendChildItems) {
      if (treeItem.items && treeItem.tm != folder?.item?.tm) {
        treeItem.items = treeItems
      } else {
        treeItem.items = treeItems
      }
    }
    return treeItems
  }
  return undefined
}

export const fetchFolderTree = async (
  full_path: string
): Promise<[TreeItem[], TreeItem | undefined, number]> => {
  const paths = full_path.split(SEP).filter((path) => path != '')
  const folderTree = await fetchDisks()
  let parentTree = folderTree
  let selectedItem: TreeItem | undefined
  let curIdx = 0
  for (let i = 0; i < paths.length; i++) {
    // const path = paths.slice(0, i + 1).join(SEP)
    const findItem = parentTree.find((treeItem) => treeItem.nm === paths[i])
    if (!findItem) {
      break
    }
    selectedItem = findItem
    curIdx += parentTree.indexOf(findItem)
    if (i == paths.length - 1) {
      break
    }
    const fetchItems = await fetchTreeItems(selectedItem)
    if (fetchItems) {
      parentTree = fetchItems
    } else {
      break
    }
    curIdx++
  }
  return [folderTree, selectedItem, curIdx]
}

export const renderTreeFromPath = async (
  fullPath: string,
  stores: {
    setFolderTree: FolderTreeStore['setFolderTree']
    folderTreeRef: FolderTreeRefStore['folderTreeRef']
    setSelectedItem: SelectedTreeItemStore['setSelectedItem']
    selectedItem: SelectedTreeItemStore['selectedItem']
  }
): Promise<void> => {
  const { setFolderTree, folderTreeRef, setSelectedItem, selectedItem } = stores
  if (fullPath == '/') {
    fetchDisks().then((disks) => {
      setFolderTree(disks)
    })
  } else {
    fetchFolderTree(fullPath).then(([newFolderTree, newSelectedItem, newSelectedIndex]) => {
      setFolderTree([...newFolderTree])
      selectTreeItem(selectedItem, newSelectedItem)
      setSelectedItem(newSelectedItem)
      const totalCount = getCountOfTreeItems(newFolderTree)
      if (document.querySelector('.folder-tree')?.scrollHeight == totalCount * TREE_ITEM_SIZE) {
        folderTreeRef?.current?.scrollToItem(newSelectedIndex, 'center')
      } else {
        setTimeout(() => {
          folderTreeRef?.current?.scrollToItem(newSelectedIndex, 'center')
        }, 100)
      }
    })
  }
}

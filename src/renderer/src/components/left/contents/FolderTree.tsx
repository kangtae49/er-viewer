import FolderTreeItem from '@renderer/components/left/contents/FolderTreeItem'
import { DiskInfo, Item, OptParams } from 'napi-bindings'
import React, { useEffect } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { getNthOfTreeItems, getCountOfTreeItems, SEP } from '@renderer/components/utils'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'

const optParams: OptParams = {
  cache_nm: 'folder-tree',
  meta_types: ['Ext', 'Mt'],
  ordering: [
    { nm: 'Dir', asc: 'Asc' },
    { nm: 'Nm', asc: 'Asc' }
  ]
}

export type FolderTree = TreeItem[]
export type TreeItem = {
  parent?: TreeItem
  nm: string
  dir: boolean
  full_path: string
  items?: TreeItem[]
  selected?: boolean
}

const fromDisk = (disk: DiskInfo): TreeItem => {
  return {
    nm: disk.path.replaceAll(SEP, ''),
    full_path: disk.path,
    dir: true
  }
}

// const fromItem = (item: Item, basePath: string): TreeItem => {
const fromItem = (item: Item, parentTreeItem: TreeItem): TreeItem => {
  const basePath = parentTreeItem.full_path
  const fullPath = basePath.endsWith(`:${SEP}`)
    ? [basePath.replaceAll(SEP, ''), item.nm].join(SEP)
    : [basePath, item.nm].join(SEP)
  const treeItem: TreeItem = {
    nm: item.nm.replaceAll(SEP, ''),
    full_path: fullPath,
    dir: item.dir,
    parent: parentTreeItem.parent
  }
  if (parentTreeItem) {
    treeItem.parent = parentTreeItem
  }
  return treeItem
}

function FolderTree(): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)

  // const [selectedItem, setSelectedItem] = useState<TreeItem | undefined>(undefined)
  const clickIcon = async (treeItem?: TreeItem): Promise<void> => {
    if (folderTree && treeItem?.dir) {
      if (!treeItem.items) {
        const folder = await window.api.readFolder({ ...optParams, path_str: treeItem.full_path })
        console.log('folder: ', folder)
        const folderItems = folder?.item?.items
        if (folderItems) {
          treeItem.items = folderItems.map((folderItem) => {
            return fromItem(folderItem, treeItem)
          })
        } else {
          delete treeItem.items
        }
      } else {
        delete treeItem.items
      }
      setFolderTree([...folderTree])
    }
  }

  const clickLabel = (treeItem?: TreeItem): void => {
    console.log(treeItem)
    selectTreeItem(treeItem)
  }

  const selectTreeItem = (treeItem?: TreeItem): void => {
    if (!treeItem) {
      return
    }
    if (selectedItem) {
      delete selectedItem.selected
    }
    treeItem.selected = true
    setSelectedItem(treeItem)
  }

  const itemSize = 18

  useEffect(() => {
    window.api.getDisks().then((disks: DiskInfo[]) => {
      setFolderTree(disks.map(fromDisk))
    })
  }, [setFolderTree])
  // console.log('getNthOfTreeItems: ', getNthOfTreeItems(items, 0))
  // const sample: TreeItem[] = [
  //   {nm: '', dir: true, full_path: '', items: [
  //       {nm: '', dir: true, full_path: '', items: []},
  //       {nm: '', dir: true, full_path: '', items: []},
  //       {nm: '', dir: true, full_path: '', items: []},]},
  //   {nm: '', dir: true, full_path: '', items: []},
  // ]
  // console.log('getCountOfTreeItems: ', getCountOfTreeItems(sample))
  // console.log('count: ', getCountOfTreeItems(treeItems) || 0)
  // console.log('treeItems', treeItems)
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(folderTree) || 0}
          itemSize={itemSize}
          width={width}
        >
          {({ index, style }) => {
            const treeItem = getNthOfTreeItems(folderTree, index)[0]
            return treeItem ? (
              <FolderTreeItem
                key={index}
                style={style}
                treeItem={treeItem}
                clickIcon={clickIcon}
                clickLabel={clickLabel}
              />
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default FolderTree

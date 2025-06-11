import FolderTreeItem from '@renderer/components/left/contents/FolderTreeItem'
import React, { useEffect, useRef } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { useFolderTreeRefStore } from '@renderer/store/folderTreeRefStore'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import type { FolderTree, TreeItem } from '@renderer/types'
import { selectTreeItem } from '@renderer/components/left/contents/tree'
import {
  fetchDisks,
  fetchTreeItems,
  getNthOfTreeItems,
  getCountOfTreeItems
} from '@renderer/components/left/contents/tree'

function FolderTree(): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const setFolderTreeRef = useFolderTreeRefStore((state) => state.setFolderTreeRef)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const listRef = useRef<List>(null)

  const clickIcon = async (treeItem?: TreeItem): Promise<void> => {
    console.log('click', treeItem)
    if (folderTree && treeItem?.dir) {
      if (!treeItem.items) {
        const treeItems = await fetchTreeItems(treeItem)
        if (!treeItems) {
          delete treeItem.items
        }
      } else {
        delete treeItem.items
      }
      setFolderTree([...folderTree])
    }
  }

  const clickLabel = (newTreeItem?: TreeItem): void => {
    console.log('clickLabel', newTreeItem)
    selectTreeItem(selectedItem, newTreeItem)
    setSelectedItem(newTreeItem)
    // console.log('clickLabel - end:', newTreeItem)
    // selectTreeItem(treeItem)
  }

  // const selectTreeItem = (treeItem?: TreeItem): void => {
  //   if (!treeItem) {
  //     return
  //   }
  //   if (selectedItem) {
  //     delete selectedItem.selected
  //   }
  //   treeItem.selected = true
  //   setSelectedItem(treeItem)
  // }

  const itemSize = 18

  useEffect(() => {
    setFolderTreeRef(listRef)
    fetchDisks().then((folderTree: FolderTree | undefined) => {
      setFolderTree(folderTree)
    })
  }, [setFolderTree, setFolderTreeRef])
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(folderTree) || 0}
          itemSize={itemSize}
          width={width}
          ref={listRef}
          onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
            console.log('onItemsRendered: ', visibleStartIndex, visibleStopIndex)
          }}
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

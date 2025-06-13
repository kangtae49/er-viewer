import FolderTreeItem from '@renderer/components/left/contents/FolderTreeItem'
import React, { useEffect, useRef } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { useFolderTreeRefStore } from '@renderer/store/folderTreeRefStore'
import type { FolderTree } from '@renderer/types'
import { TREE_ITEM_SIZE } from '@renderer/components/left/contents/tree'
import {
  fetchDisks,
  // fetchTreeItems,
  getNthOfTreeItems,
  getCountOfTreeItems
} from '@renderer/components/left/contents/tree'

function FolderTree(): React.ReactElement {
  const folderTree = useFolderTreeStore((state) => state.folderTree)
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const setFolderTreeRef = useFolderTreeRefStore((state) => state.setFolderTreeRef)
  const listRef = useRef<List>(null)
  useEffect(() => {
    setFolderTreeRef(listRef)
    fetchDisks().then((folderTree: FolderTree | undefined) => {
      if (folderTree) {
        setFolderTree([...folderTree])
      } else {
        setFolderTree(undefined)
      }
    })
  }, [setFolderTree, setFolderTreeRef])
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="folder-tree"
          height={height}
          itemCount={getCountOfTreeItems(folderTree) || 0}
          itemSize={TREE_ITEM_SIZE}
          width={width}
          ref={listRef}
        >
          {({ index, style }) => {
            const treeItem = getNthOfTreeItems(folderTree, index)[0]
            return treeItem ? (
              <FolderTreeItem key={`folder-tree-item-${index}`} style={style} treeItem={treeItem} />
            ) : null
          }}
        </List>
      )}
    </AutoSizer>
  )
}

export default FolderTree

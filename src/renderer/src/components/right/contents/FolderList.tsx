import React, { useEffect, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import FolderListItem from '@renderer/components/right/contents/FolderListItem'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faCircleChevronUp,
  faCircleChevronDown,
  faCircleMinus,
  faCircleHalfStroke
} from '@fortawesome/free-solid-svg-icons'
import { LIST_ITEM_SIZE, LIST_HEAD_SIZE, fetchTreeItems } from '@renderer/components/left/contents/tree'
import { FolderListOrderKey, FolderListOrderVal, TreeItem } from '@renderer/types'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import { useFolderListOrderStore } from '@renderer/store/folderListOrderStore'
import { useFolderListVisibleColsStore } from '@renderer/store/folderListVisibleColsStore'

function FolderList(): React.ReactElement {
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const folderListOrder = useFolderListOrderStore((state) => state.folderListOrder)
  const setFolderListOrder = useFolderListOrderStore((state) => state.setFolderListOrder)
  const folderListVisibleCols = useFolderListVisibleColsStore(
    (state) => state.folderListVisibleCols
  )
  const setFolderListVisibleCols = useFolderListVisibleColsStore(
    (state) => state.setFolderListVisibleCols
  )
  const [listItems, setListItems] = useState<TreeItem[] | undefined>(undefined)

  const clickOrder = (key: FolderListOrderKey): void => {
    console.log('clickOrder', key)
    let val: FolderListOrderVal = 'Asc'
    if (folderListOrder.key == key) {
      val = folderListOrder.val == 'Asc' ? 'Desc' : 'Asc'
    }
    setFolderListOrder({
      key,
      val
    })
  }
  const clickVisible = (key: FolderListOrderKey): void => {
    if (folderListVisibleCols.includes(key)) {
      setFolderListVisibleCols(folderListVisibleCols.filter((k) => k !== key))
    } else {
      setFolderListVisibleCols([...folderListVisibleCols, key])
    }
  }
  let iconNm = faCircleMinus
  let iconSz = faCircleMinus
  let iconExt = faCircleMinus
  let iconTm = faCircleMinus

  if (folderListOrder.key == 'Nm') {
    iconNm = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  } else if (folderListOrder.key == 'Sz') {
    iconSz = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  } else if (folderListOrder.key == 'Ext') {
    iconExt = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  } else if (folderListOrder.key == 'Tm') {
    iconTm = folderListOrder.val == 'Asc' ? faCircleChevronUp : faCircleChevronDown
  }
  useEffect(() => {
    fetchTreeItems({ treeItem: selectedItem, appendChildItems: false }).then((fetchItems) =>
      setListItems(fetchItems)
    )
  }, [selectedItem])
  return (
    <>
      {listItems && (
        <>
          <div className="folder-head">
            <div className="nm">
              <Icon icon={iconNm} onClick={() => clickOrder('Nm')} />
              name
            </div>
            <div className={`sz $(folderListVisibleCols.include('Sz') ? 'visible' : '')`}>
              <Icon icon={iconSz} onClick={() => clickOrder('Sz')} />
              size
              <Icon
                icon={faCircleHalfStroke}
                className={folderListVisibleCols.includes('Sz') ? 'visible' : ''}
                onClick={() => clickVisible('Sz')}
              />
            </div>
            <div className={`ext $(folderListVisibleCols.include('Ext') ? 'visible' : '')`}>
              <Icon icon={iconExt} onClick={() => clickOrder('Ext')} />
              ext
              <Icon
                icon={faCircleHalfStroke}
                className={folderListVisibleCols.includes('Ext') ? 'visible' : ''}
                onClick={() => clickVisible('Ext')}
              />
            </div>
            <div className={`tm $(folderListVisibleCols.include('Tm') ? 'visible' : '')`}>
              <Icon icon={iconTm} onClick={() => clickOrder('Tm')} />
              date
              <Icon
                icon={faCircleHalfStroke}
                className={folderListVisibleCols.includes('Tm') ? 'visible' : ''}
                onClick={() => clickVisible('Tm')}
              />
            </div>
          </div>

          <AutoSizer>
            {({ height, width }) => (
              <List
                className="folder-list"
                height={height - LIST_HEAD_SIZE}
                itemCount={listItems?.length || 0}
                itemSize={LIST_ITEM_SIZE}
                width={width}
              >
                {({ index, style }) => {
                  const listItem = listItems[index]
                  return listItem ? (
                    <FolderListItem
                      key={`folder-list-item-${index}`}
                      style={style}
                      treeItem={listItem}
                    />
                  ) : null
                }}
              </List>
            )}
          </AutoSizer>
        </>
      )}
    </>
  )
}

export default FolderList

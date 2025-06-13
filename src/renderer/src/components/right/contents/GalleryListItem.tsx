import React from 'react'
import { TreeItem } from '@renderer/types'

type GalleryListItemProp = {
  style: React.CSSProperties
  rowTreeItems: TreeItem[]
}
function GalleryListItem({ rowTreeItems, style }: GalleryListItemProp): React.ReactElement {
  console.log(rowTreeItems)
  return (
    <div className="item" style={style}>
      {rowTreeItems.map(
        (item, idx) =>
        item ? (
          <div className="col" key={idx}>
            {item.nm}
          </div>
        ) : (
          <div className="col" key={idx}></div>
        )
      )}
    </div>
  )
}
export default GalleryListItem

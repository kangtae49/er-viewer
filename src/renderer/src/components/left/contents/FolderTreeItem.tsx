import { TreeItem } from '@renderer/types'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import { SEP } from '@renderer/components/left/contents/tree'
import React from 'react'

type Prop = {
  style: React.CSSProperties
  treeItem: TreeItem
  clickIcon: (treeItem?: TreeItem) => void
  clickLabel: (treeItem?: TreeItem) => void
}
function FolderTreeItem({ treeItem, style, clickIcon, clickLabel }: Prop): React.ReactElement {
  let fullPath = treeItem.full_path
  if (fullPath.endsWith(`:${SEP}`)) {
    fullPath = fullPath.replaceAll(SEP, '')
  }
  const arr = fullPath.split(SEP)
  const pathList = arr.slice(0, -1).map((_nm, idx) => {
    return arr.slice(0, idx + 1).join(SEP)
  })
  const depthWidth = 13
  const iconWidth = 18
  const nm_minus = depthWidth * pathList.length + iconWidth
  const depth_style = {
    flex: `0 0 ${depthWidth}px`,
    display: 'flex',
    justifyContent: 'center'
  }
  const nm_label_style = {
    maxWidth: `100%`,
    backgroundColor: treeItem.selected ? '#bfd2e3' : '#ffffff'
  }
  const icon_style = { flex: `0 0 ${iconWidth}px` }
  const nm_style = {
    width: `calc(100% - ${nm_minus}px)`
  }
  return (
    <div className="item" style={style}>
      {pathList.map((path, idx) => {
        const color = idx % 2 === 0 ? '#c8ada4' : '#6a99b8'
        const parentTreeItem = getNthParent(treeItem, pathList.length - idx)
        return (
          <div
            className="depth"
            key={idx}
            style={depth_style}
            title={path}
            onClick={() => clickIcon(parentTreeItem)}
          >
            <svg width="100%" height="100%">
              <line x1="5" y1="0" x2="5" y2="100%" stroke={color} strokeWidth="2" />
            </svg>
          </div>
        )
      })}
      <div className="ico" style={icon_style} onClick={() => clickIcon(treeItem)}>
        <Icon icon={treeItem.dir ? faFolder : faFile} />
      </div>
      <div className="nm" style={nm_style}>
        <div
          className="label"
          title={treeItem.nm}
          style={nm_label_style}
          onClick={() => clickLabel(treeItem)}
        >
          {treeItem.nm}
        </div>
      </div>
    </div>
  )
}

function getNthParent(item: TreeItem | undefined, n: number): TreeItem | undefined {
  let current = item
  let count = 0

  while (current && count < n) {
    current = current?.parent
    count++
  }

  return current
}

export default FolderTreeItem

import React from 'react'
import { TreeItem } from '@renderer/types'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { formatFileSize, toDate } from '@renderer/components/utils'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
// import { renderTreeFromPath } from '@renderer/components/left/contents/tree'

type FolderListItemProps = {
  style: React.CSSProperties
  treeItem: TreeItem
}

function FolderListItem({ treeItem, style }: FolderListItemProps): React.ReactElement {
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  return (
    <div className="item" style={style}>
      <div className="nm">
        <div className="icon">
          <Icon icon={faGlobe} onClick={() => window.api.shellOpenPath(treeItem?.full_path)} />
        </div>
        <div className="icon" onClick={() => window.api.shellShowItemInFolder(treeItem?.full_path)}>
          <Icon icon={treeItem.dir ? faFolder : faFile} />
        </div>
        <div className="label" title={treeItem.full_path} onClick={() => setSelectedItem(treeItem)}>
          {treeItem.nm}
        </div>
      </div>
      <div className="sz">{formatFileSize(treeItem.sz)}</div>
      <div className="ext">{treeItem.ext?.slice(-10)}</div>
      <div className="tm">{toDate(treeItem.tm)}</div>
    </div>
  )
}

export default FolderListItem

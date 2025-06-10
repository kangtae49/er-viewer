import { TreeItem } from './FolderTree'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import { SEP } from '@renderer/components/utils'
type Prop = {
  style: React.CSSProperties
  item: TreeItem
  clickIcon: (item: TreeItem) => void
  clickLabel: (item: TreeItem) => void
}
function FolderTreeItem({ item, style, clickIcon, clickLabel }: Prop): React.ReactElement {
  let fullPath = item.full_path
  if (fullPath.endsWith(`:${SEP}`)) {
    fullPath = fullPath.replaceAll(SEP, '')
  }
  const arr = fullPath.split(SEP)
  const pathList = arr.slice(0, -1).map((_nm, idx) => {
    return arr.slice(0, idx + 1).join(SEP)
  })
  const depth_width = 10
  const icon_width = 18
  const nm_minus = depth_width * pathList.length + icon_width
  const depth_style = {
    flex: `0 0 ${depth_width}px`,
    display: 'flex',
    justifyContent: 'center'
  }
  const nm_label_style = {
    maxWidth: `100%`
  }
  const icon_style = { flex: `0 0 ${icon_width}px` }
  const nm_style = { width: `calc(100% - ${nm_minus}px)` }
  return (
    <div className="item" style={style}>
      {pathList.map((path, idx) => {
        const color = idx % 2 === 0 ? '#c8ada4' : '#6a99b8'
        return (
          <div className="depth" key={idx} style={depth_style} title={path}>
            <svg width="10px" height="100%">
              <line x1="5" y1="0" x2="5" y2="100%" stroke={color} strokeWidth="2" />
            </svg>
          </div>
      )})}
      <div className="ico" style={icon_style} onClick={() => clickIcon(item)}>
        <Icon icon={item.dir ? faFolder : faFile} />
      </div>
      <div className="nm" style={nm_style}>
        <div className="label" style={nm_label_style} onClick={() => clickLabel(item)}>
          {item.nm}
        </div>
      </div>
    </div>
  )
}


export default FolderTreeItem

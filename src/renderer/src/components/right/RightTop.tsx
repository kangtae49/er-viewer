import React from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faFolder, faArrowUp, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { renderPath, SEP } from '@renderer/components/left/contents/tree'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { useFolderTreeRefStore } from '@renderer/store/folderTreeRefStore'

function RightTop(): React.ReactElement {
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)
  const clickPath = async (fullPath: string): Promise<void> => {
    await renderPath(fullPath, {
      setFolderTree,
      folderTreeRef,
      setSelectedItem,
      selectedItem
    })
  }
  let pathList: string[] = []
  let fullPathList: string[] = []
  if (selectedItem) {
    let fullPath = selectedItem.full_path
    if (fullPath.endsWith(`:${SEP}`)) {
      fullPath = fullPath.replaceAll(SEP, '')
    }
    pathList = fullPath.split(SEP)
    fullPathList = pathList.map((_nm, idx) => {
      return pathList.slice(0, idx + 1).join(SEP)
    })
  }

  return (
    <div className="right-top">
      <div className="title-path">
        <div>
          <Icon icon={faFolder} />
        </div>

        {fullPathList.map((fullPath, idx) => {
          return (
            <>
              {idx != 0 ? SEP : null}
              <div
                className="part-list"
                key={idx}
                title={fullPath}
                onClick={() => clickPath(fullPath)}
              >
                {pathList[idx]}
              </div>
            </>
          )
        })}

        <div className="icon">
          <Icon icon={faArrowUp} />
        </div>
        <div className="icon">
          <Icon icon={faGlobe} />
        </div>
      </div>
    </div>
  )
}

export default RightTop

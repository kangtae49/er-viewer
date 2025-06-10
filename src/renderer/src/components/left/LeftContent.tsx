import FolderTree from '@renderer/components/left/contents/FolderTree'
import React from 'react'

function LeftContent(): React.ReactNode {
  return (
    <div className="content">
      <FolderTree />
    </div>
  )
}

export default LeftContent

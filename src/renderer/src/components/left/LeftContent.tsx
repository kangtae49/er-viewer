import FolderTree from '@renderer/components/left/contents/FolderTree'
import { useEffect } from 'react'

function LeftContent(): React.ReactNode {
  useEffect(() => {
    window.api.readFolder({ path_str: 'C:/' }).then((x) => {
      console.log(x)
    })
  })
  return (
    <div className="content">
      <FolderTree />
    </div>
  )
}

export default LeftContent

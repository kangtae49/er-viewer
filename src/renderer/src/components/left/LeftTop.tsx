import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faInbox,
  faHouseUser,
  faDownload,
  faFileLines,
  faVideo,
  faMusic,
  faImage,
  faDesktop
} from '@fortawesome/free-solid-svg-icons'
import type { HomePathMap } from '@renderer/types'
import { useFolderTreeStore } from '@renderer/store/folderTreeStore'
import { fetchDisks, fetchFolderTree } from '@renderer/components/left/contents/tree'

function LeftTop(): React.ReactElement {
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)

  const [homeDir, setHomeDir] = useState<HomePathMap>({
    HomeDir: '',
    DesktopDir: '',
    PictureDir: '',
    AudioDir: '',
    VideoDir: '',
    DocumentDir: '',
    DownloadDir: '',
    CacheDir: '',
    ConfigDir: '',
    DataDir: '',
    DataLocalDir: '',
    ExecutableDir: '',
    FontDir: '',
    PublicDir: '',
    RootDir: '',
    RuntimeDir: '',
    TemplateDir: ''
  })
  const clickHomeDir = (url: string): void => {
    if (url == '/') {
      fetchDisks().then((disks) => {
        setFolderTree(disks)
      })
    } else {
      fetchFolderTree(url).then(([newFolderTree, newSelectedItem]) => {
        console.log(url, newFolderTree, newSelectedItem)
        setFolderTree([...newFolderTree])
      })
    }
    console.log(url)
  }

  useEffect(() => {
    const fetchHomes = async (): Promise<HomePathMap> => {
      return await window.api.getHomeDir()
    }

    fetchHomes().then((h) => {
      setHomeDir(h)
    })
  }, [])
  return (
    <div className="left-top">
      <div className="link root" title="/">
        <Icon icon={faInbox} onClick={() => clickHomeDir('/')} />
      </div>
      <div className="link home" title="Home">
        <Icon icon={faHouseUser} onClick={() => clickHomeDir(homeDir.HomeDir)} />
      </div>
      <div className="link down" title="Downloads">
        <Icon icon={faDownload} onClick={() => clickHomeDir(homeDir.DownloadDir)} />
      </div>
      <div className="link docs" title="Documents">
        <Icon icon={faFileLines} onClick={() => clickHomeDir(homeDir.DocumentDir)} />
      </div>
      <div className="link video" title="Movie">
        <Icon icon={faVideo} onClick={() => clickHomeDir(homeDir.VideoDir)} />
      </div>
      <div className="link music" title="Music">
        <Icon icon={faMusic} onClick={() => clickHomeDir(homeDir.AudioDir)} />
      </div>
      <div className="link image" title="Image">
        <Icon icon={faImage} onClick={() => clickHomeDir(homeDir.PictureDir)} />
      </div>
      <div className="link desktop" title="Desktop">
        <Icon icon={faDesktop} onClick={() => clickHomeDir(homeDir.DesktopDir)} />
      </div>
    </div>
  )
}

export default LeftTop

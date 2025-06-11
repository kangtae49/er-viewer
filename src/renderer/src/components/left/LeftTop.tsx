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
import { useFolderTreeRefStore } from '@renderer/store/folderTreeRefStore'
import { useSelectedTreeItemStore } from '@renderer/store/selectedTreeItemStore'
import {
  fetchDisks,
  fetchFolderTree, getCountOfTreeItems,
  selectTreeItem
} from '@renderer/components/left/contents/tree'

function LeftTop(): React.ReactElement {
  const setFolderTree = useFolderTreeStore((state) => state.setFolderTree)
  const folderTreeRef = useFolderTreeRefStore((state) => state.folderTreeRef)
  const setSelectedItem = useSelectedTreeItemStore((state) => state.setSelectedItem)
  const selectedItem = useSelectedTreeItemStore((state) => state.selectedItem)

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
      fetchFolderTree(url).then(([newFolderTree, newSelectedItem, newSelectedIndex]) => {
        console.log(url, newFolderTree, newSelectedItem, newSelectedIndex)
        setFolderTree([...newFolderTree])
        selectTreeItem(selectedItem, newSelectedItem)
        setSelectedItem(newSelectedItem)
        console.log('clickHomeDir', newSelectedItem)
        const totalCount = getCountOfTreeItems(newFolderTree)
        if (document.querySelector('.folder-tree')?.scrollHeight == totalCount * 18) {
          folderTreeRef?.current?.scrollToItem(newSelectedIndex, 'center')
        } else {
          setTimeout(() => {
            folderTreeRef?.current?.scrollToItem(newSelectedIndex, 'center')
          }, 500)
        }
        // document.querySelector('.folder-tree')?.scrollTo({
        //   top: newSelectedIndex * 18,
        //   behavior: 'smooth'
        // })
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
      <div className="link root" title="/" onClick={() => clickHomeDir('/')}>
        <Icon icon={faInbox} />
      </div>
      <div className="link home" title="Home" onClick={() => clickHomeDir(homeDir.HomeDir)}>
        <Icon icon={faHouseUser} />
      </div>
      <div
        className="link down"
        title="Downloads"
        onClick={() => clickHomeDir(homeDir.DownloadDir)}
      >
        <Icon icon={faDownload} />
      </div>
      <div
        className="link docs"
        title="Documents"
        onClick={() => clickHomeDir(homeDir.DocumentDir)}
      >
        <Icon icon={faFileLines} />
      </div>
      <div className="link video" title="Movie" onClick={() => clickHomeDir(homeDir.VideoDir)}>
        <Icon icon={faVideo} />
      </div>
      <div className="link music" title="Music" onClick={() => clickHomeDir(homeDir.AudioDir)}>
        <Icon icon={faMusic} />
      </div>
      <div className="link image" title="Image" onClick={() => clickHomeDir(homeDir.PictureDir)}>
        <Icon icon={faImage} />
      </div>
      <div
        className="link desktop"
        title="Desktop"
        onClick={() => clickHomeDir(homeDir.DesktopDir)}
      >
        <Icon icon={faDesktop} />
      </div>
    </div>
  )
}

export default LeftTop

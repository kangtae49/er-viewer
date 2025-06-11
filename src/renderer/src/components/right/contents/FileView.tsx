import React, { useEffect, useRef, useState } from 'react'
import { TreeItem } from '@renderer/types'
import { ShadowDomWrapper } from '@renderer/components/right/contents/ShadowDomWrapper'

interface FileViewProps {
  selectedItem?: TreeItem | undefined
}
type FileViewType = 'Img' | 'Embed' | 'Html' | 'Iframe' | 'Text' | 'Video' | 'Audio' | 'None'

function FileView({ selectedItem }: FileViewProps): React.ReactElement {
  let fileViewType: FileViewType

  const sz = selectedItem?.sz || 0
  if (selectedItem?.mt?.startsWith('image/')) {
    fileViewType = 'Img'
  } else if (selectedItem?.mt?.endsWith('/pdf')) {
    fileViewType = 'Embed'
  } else if (selectedItem?.mt?.endsWith('/html')) {
    fileViewType = 'Html'
  } else if (selectedItem?.mt?.endsWith('/json')) {
    fileViewType = 'Iframe'
  } else if (selectedItem?.mt?.endsWith('/xml')) {
    fileViewType = 'Text'
  } else if (selectedItem?.mt?.startsWith('audio/') && sz > 1024 * 500) {
    fileViewType = 'Audio'
  } else if (selectedItem?.mt?.startsWith('video/') && sz > 1024 * 500) {
    fileViewType = 'Video'
  } else if (sz < 1024 * 500) {
    fileViewType = 'Text'
  } else {
    fileViewType = 'None'
  }
  return (
    <>
      {(() => {
        switch (fileViewType) {
          case 'Img':
            return <ViewImg selectedItem={selectedItem} />
          case 'Embed':
            return <ViewEmbed selectedItem={selectedItem} />
          case 'Html':
            return <ViewHtml selectedItem={selectedItem} />
          case 'Iframe':
            return <ViewIframe selectedItem={selectedItem} />
          case 'Text':
            return <ViewText selectedItem={selectedItem} />
          case 'Audio':
            return <ViewAudio selectedItem={selectedItem} />
          case 'Video':
            return <ViewVideo selectedItem={selectedItem} />
          default:
            return <ViewNone selectedItem={selectedItem} />
        }
      })()}
    </>
  )
}

function ViewImg({ selectedItem }: FileViewProps): React.ReactElement {
  return (
    <div className="view-img">
      <img src={selectedItem?.full_path} alt={selectedItem?.full_path} />
    </div>
  )
}

function ViewEmbed({ selectedItem }: FileViewProps): React.ReactElement {
  return (
    <div className="view-embed">
      <embed src={selectedItem?.full_path} type={selectedItem?.mt}></embed>
    </div>
  )
}
function ViewHtml({ selectedItem }: FileViewProps): React.ReactElement {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const fetchText = async (): Promise<string> => {
      if (selectedItem?.full_path) {
        const textContent = await window.api.readTextFile(selectedItem.full_path)
        return textContent.text || ''
      } else {
        return ''
      }
    }
    fetchText().then((txt) => setHtml(txt))
  }, [selectedItem?.full_path])

  return (
    <ShadowDomWrapper>
      <div className="view-html" dangerouslySetInnerHTML={{ __html: html }}></div>
    </ShadowDomWrapper>
  )
}
function ViewIframe({ selectedItem }: FileViewProps): React.ReactElement {
  return (
    <div className="view-iframe">
      <iframe src={selectedItem?.full_path}></iframe>
    </div>
  )
}
function ViewText({ selectedItem }: FileViewProps): React.ReactElement {
  const [text, setText] = useState('')

  useEffect(() => {
    const fetchText = async (): Promise<string> => {
      if (selectedItem?.full_path) {
        const textContent = await window.api.readTextFile(selectedItem.full_path)
        return textContent.text || ''
      } else {
        return ''
      }
    }
    fetchText().then((txt) => setText(txt))
  }, [selectedItem?.full_path])

  return <div className="view-text">{text}</div>
}

function ViewAudio({ selectedItem }: FileViewProps): React.ReactElement {
  console.log('view-audio')
  const mediaRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.3
      mediaRef.current?.load()
    }
  })
  return (
    <div className="view-audio">
      <audio ref={mediaRef} controls={true} autoPlay={true}>
        <source
          src={selectedItem?.full_path}
          type={selectedItem?.mt}
        />
      </audio>
    </div>
  )
}

function ViewVideo({ selectedItem }: FileViewProps): React.ReactElement {
  const mediaRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = 0.5
      mediaRef.current?.load()
    }
  })
  return (
    <div className="view-video">
      <video ref={mediaRef} controls={true} autoPlay={true}>
        <source src={selectedItem?.full_path} type={selectedItem?.mt} />
      </video>
    </div>
  )
}

function ViewNone({ selectedItem }: FileViewProps): React.ReactElement {
  return <div>{selectedItem?.full_path}</div>
}

export default FileView

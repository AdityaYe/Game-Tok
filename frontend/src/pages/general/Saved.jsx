import React from 'react'

import '../../styles/clips.css'

import ClipFeed from '../../components/feed/ClipFeed'
import { useSavedClips } from '../../features/saved/hooks/useSavedClips'


const Saved = () => {

  const { data } = useSavedClips()

  const clips = (data?.savedClips || [])
    .map((item) => item.clip)
    .filter(Boolean)



  return (

    <ClipFeed
      items={clips}
      emptyMessage="No saved clips yet."
    />

  )
}

export default Saved

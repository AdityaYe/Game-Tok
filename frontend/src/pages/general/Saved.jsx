import React from 'react'

import '../../styles/clips.css'

import ClipFeed from '../../components/feed/ClipFeed'
import { useRemoveSavedClip, useSavedClips } from '../../features/saved/hooks/useSavedClips'


const Saved = () => {

  const { data } = useSavedClips()
  const removeSaved = useRemoveSavedClip()

  const clips = (data?.savedClips || [])
    .map((item) => item.clip)
    .filter(Boolean)



  return (

    <ClipFeed
      items={clips}
      onSave={(clip) => removeSaved.mutate(clip._id)}
      emptyMessage="No saved clips yet."
    />

  )
}

export default Saved

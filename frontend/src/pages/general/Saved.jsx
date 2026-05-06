import React, { useEffect, useState } from 'react'

import axios from 'axios'

import '../../styles/clips.css'

import ClipFeed from '../../components/ClipFeed'


const Saved = () => {

  const [clips, setClips] = useState([])



  useEffect(() => {

    axios.get(
      "http://localhost:3000/api/clips/save",
      {
        withCredentials: true
      }
    )
    .then((response) => {

      const savedClips =
        response.data.savedClips.map((item) => ({

          _id: item.clip._id,

          video: item.clip.video,

          gameName: item.clip.gameName,

          description: item.clip.description,

          genre: item.clip.genre,

          steamUrl: item.clip.steamUrl,

          creator: item.clip.creator,

          likeCount: item.clip.likeCount,

          savesCount: item.clip.savesCount,

        }))



      setClips(savedClips)

    })
    .catch((err) => {

      console.error(err)

    })

  }, [])



  async function removeSaved(item) {

    try {

      await axios.post(
        "http://localhost:3000/api/clips/save",
        {
          clipId: item._id
        },
        {
          withCredentials: true
        }
      )



      setClips((prev) =>
        prev.filter(
          (clip) => clip._id !== item._id
        )
      )

    } catch (err) {

      console.error(err)

    }

  }



  return (

    <ClipFeed
      items={clips}
      onSave={removeSaved}
      emptyMessage="No saved clips yet."
    />

  )
}

export default Saved
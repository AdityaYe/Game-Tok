import React, { useEffect, useState } from 'react'

import axios from 'axios'

import '../../styles/clips.css'

import ClipFeed from '../../components/ClipFeed'


const Home = () => {

  const [clips, setClips] = useState([])



  useEffect(() => {

    axios.get(
      "http://localhost:3000/api/clips",
      {
        withCredentials: true
      }
    )
    .then((response) => {

      console.log(response.data)

      setClips(response.data.clips)

    })
    .catch((err) => {

      console.error(err)

    })

  }, [])



  async function likeClip(item) {

    try {

      const response = await axios.post(
        "http://localhost:3000/api/clips/like",
        {
          clipId: item._id
        },
        {
          withCredentials: true
        }
      )



      if (response.data.like) {

        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  likeCount: clip.likeCount + 1
                }
              : clip
          )
        )

      } else {

        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  likeCount: Math.max(
                    0,
                    clip.likeCount - 1
                  )
                }
              : clip
          )
        )

      }

    } catch (err) {

      console.error(err)

    }

  }



  async function saveClip(item) {

    try {

      const response = await axios.post(
        "http://localhost:3000/api/clips/save",
        {
          clipId: item._id
        },
        {
          withCredentials: true
        }
      )



      if (response.data.save) {

        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  savesCount: (clip.savesCount || 0) + 1
                }
              : clip
          )
        )

      } else {

        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  savesCount: Math.max(
                    0,
                    (clip.savesCount || 0) - 1
                  )
                }
              : clip
          )
        )

      }

    } catch (err) {

      console.error(err)

    }

  }



  return (

    <ClipFeed
      items={clips}
      onLike={likeClip}
      onSave={saveClip}
      emptyMessage="No clips available."
    />

  )
}

export default Home
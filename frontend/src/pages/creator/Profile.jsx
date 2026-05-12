import React, { useEffect, useState } from 'react'

import axios from 'axios'

import { useParams } from 'react-router-dom'

import '../../styles/profile.css'


const Profile = () => {

  const { id } = useParams()

  const [profile, setProfile] = useState(null)
  const [clips, setClips] = useState([])



  useEffect(() => {

    axios.get(
      `http://localhost:3000/api/v1/creator/${id}`,
      {
        withCredentials: true
      }
    )
    .then((response) => {

      setProfile(response.data.creator)

      setClips(response.data.creator.clips)

    })
    .catch((err) => {
      console.error(err)
    })

  }, [id])



  return (

    <main className="profile-page">

      <section className="profile-header">

        <div className="profile-meta">

          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420"
            alt="Creator avatar"
          />



          <div className="profile-info">

            <h1
              className="profile-pill profile-business"
              title="Creator name"
            >
              {profile?.name}
            </h1>



            <p
              className="profile-pill profile-address"
              title="Creator location"
            >
              {profile?.address}
            </p>

          </div>

        </div>



        <div
          className="profile-stats"
          role="list"
          aria-label="Profile stats"
        >

          <div
            className="profile-stat"
            role="listitem"
          >

            <span className="profile-stat-label">
              clips
            </span>

            <span className="profile-stat-value">
              {clips.length}
            </span>

          </div>



          <div
            className="profile-stat"
            role="listitem"
          >

            <span className="profile-stat-label">
              likes
            </span>

            <span className="profile-stat-value">

              {clips.reduce(
                (total, clip) =>
                  total + (clip.likeCount || 0),
                0
              )}

            </span>

          </div>

        </div>

      </section>



      <hr className="profile-sep" />



      <section
        className="profile-grid"
        aria-label="Creator clips"
      >

        {clips.map((clip) => (

          <div
            key={clip._id}
            className="profile-grid-item"
          >

            <video
              className="profile-grid-video"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
              src={clip.video}
              muted
              loop
            />



            <div className="profile-grid-overlay">

              <h3 className="profile-grid-title">
                {clip.gameName}
              </h3>

            </div>

          </div>

        ))}

      </section>

    </main>

  )
}

export default Profile
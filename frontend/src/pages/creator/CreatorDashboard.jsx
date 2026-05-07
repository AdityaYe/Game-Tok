import React, {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import { Link } from 'react-router-dom'

import {
  FaHeart,
  FaBookmark
} from 'react-icons/fa'

import '../../styles/creator-dashboard.css'



const CreatorDashboard = () => {

  const [clips, setClips] =
    useState([])

  const [stats, setStats] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [editingId, setEditingId] =
    useState(null)

  const [avatar, setAvatar] = useState(null)

  const [editGameName, setEditGameName] =
    useState('')

  const [editDescription,
    setEditDescription] =
    useState('')

  const [editTags,
    setEditTags] =
    useState('')



  useEffect(() => {

    fetchDashboard()

  }, [])



  async function fetchDashboard() {

    try {

      const response =
        await axios.get(

          'http://localhost:3000/api/creator/dashboard',

          {
            withCredentials: true,
          }

        )



      setClips(response.data.clips)

      setStats(response.data.stats)

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)

    }

  }

  async function handleAvatarUpload() {

  try {

    const formData =
      new FormData()

    formData.append(
      "avatar",
      avatar
    )



    await axios.put(

      "http://localhost:3000/api/creator/avatar",

      formData,

      {
        withCredentials: true,
      }

    )



    window.location.reload()

  } catch (err) {

    console.log(err)

  }

}

async function handleEdit(clip) {

    try {

      const formattedTags =
        editTags
          .split(',')
          .map((tag) =>
            tag.trim()
          )
          .filter(Boolean)



      await axios.put(

        `http://localhost:3000/api/creator/dashboard/${clip._id}`,

        {
          
          gameName:
            editGameName,

          description:
            editDescription,

          tags:
            formattedTags,

        },

        {
          withCredentials: true,
        }

      )



      setClips((prev) =>

        prev.map((item) =>

          item._id === clip._id

            ? {

                ...item,

                gameName:
                  editGameName,

                description:
                  editDescription,

                tags:
                  formattedTags,

              }

            : item

        )

      )



      setEditingId(null)

    } catch (err) {

      console.log(err)

    }

  }

  async function handleDelete(id) {

    try {

      await axios.delete(

        `http://localhost:3000/api/creator/dashboard/${id}`,

        {
          withCredentials: true,
        }

      )



      setClips((prev) =>

        prev.filter(
          (clip) => clip._id !== id
        )

      )



      setStats((prev) => ({

        ...prev,

        totalClips:
          prev.totalClips - 1,

      }))

    } catch (err) {

      console.log(err)

    }

  }

  if (loading) {

    return (

      <div className="dashboard-loading">
        Loading dashboard...
      </div>

    )

  }



  return (

    <div className="creator-dashboard-page">



      <div className="creator-dashboard-header">

        <div>

          <h1 className="creator-dashboard-title">
            Creator Dashboard
          </h1>

          <p className="creator-dashboard-subtitle">
            Manage your uploaded clips.
          </p>

        </div>

        <div className="dashboard-avatar-section">
            
            <input
            type="file"
            accept="image/*"
            onChange={(e) =>
                setAvatar(
                    e.target.files[0]
                )
            }/>
            
            <button
            onClick={handleAvatarUpload}
            className="dashboard-upload-btn">
                Upload Avatar
            </button>
        </div>

        <Link
          to="/upload-clip"
          className="dashboard-upload-btn"
        >
          Upload Clip
        </Link>

      </div>



      <div className="dashboard-stats-grid">



        <div className="dashboard-stat-card">

          <span className="dashboard-stat-label">
            Uploaded Clips
          </span>

          <h2>
            {stats?.totalClips || 0}
          </h2>

        </div>



        <div className="dashboard-stat-card">

          <span className="dashboard-stat-label">
            Total Likes
          </span>

          <h2>
            {stats?.totalLikes || 0}
          </h2>

        </div>



        <div className="dashboard-stat-card">

          <span className="dashboard-stat-label">
            Total Saves
          </span>

          <h2>
            {stats?.totalSaves || 0}
          </h2>

        </div>

      </div>



      <div className="dashboard-clips-grid">



        {
          clips.map((clip) => (

            <div
              key={clip._id}
              className="dashboard-clip-card"
            >



              <video
                src={clip.video}
                className="dashboard-clip-video"
                muted
                controls
              />



              <div className="dashboard-clip-content">



                <h3>
                  {clip.gameName}
                </h3>



                <p>
                  {clip.description}
                </p>



                {
                  clip.tags?.length > 0 && (

                    <div className="dashboard-tags">

                      {
                        clip.tags.map((tag) => (

                          <span
                            key={tag}
                            className="dashboard-tag"
                          >
                            #{tag}
                          </span>

                        ))
                      }

                    </div>

                  )
                }



                <div className="dashboard-clip-stats">

                  <span>
                    <FaHeart />
                    {' '}
                    {clip.likeCount || 0}
                  </span>



                  <span>
                    <FaBookmark />
                    {' '}
                    {clip.savesCount || 0}
                  </span>

                </div>



                {
                  editingId === clip._id && (

                    <div className="dashboard-edit-form">

                        <input
                        type="text"
                        value={editGameName}
                        onChange={(e) =>
                            setEditGameName(
                                e.target.value)
                            }
                            placeholder="Game Name"
                            />

                      <textarea
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(
                            e.target.value
                          )
                        }
                        placeholder="Description"
                      />



                      <input

                        type="text"

                        value={editTags}

                        onChange={(e) =>
                          setEditTags(
                            e.target.value
                          )
                        }

                        placeholder="fps, ranked, funny"

                      />



                      <button
                        className="dashboard-save-btn"
                        onClick={() =>
                          handleEdit(clip)
                        }
                      >
                        Save Changes
                      </button>

                    </div>

                  )
                }

                {
                editingId !== clip._id && (
                
                <button
                className="dashboard-edit-btn"
                onClick={() => {
                    setEditingId(clip._id)
                    
                    setEditGameName(
                        clip.gameName || ''
                    )
                    
                    setEditDescription(
                        clip.description || ''
                    )
                    
                    setEditTags(
                        clip.tags?.join(', ') || ''
                    )
                }}>Edit Clip</button>
                )
                }

                <button

                  className="dashboard-delete-btn"

                  onClick={() =>
                    handleDelete(clip._id)
                  }

                >

                  Delete Clip

                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}



export default CreatorDashboard
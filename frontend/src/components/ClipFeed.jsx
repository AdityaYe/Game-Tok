import React, {
  useEffect,
  useState,
  useRef
} from 'react'

import axios from 'axios'

import {
  FaHeart,
  FaComment,
  FaBookmark
} from "react-icons/fa"



const ClipFeed = ({

  items = [],

  onLike,

  onSave,

  emptyMessage = 'No clips yet.'

}) => {



  const videoRefs =
    useRef(new Map())



  const [selectedClip,
    setSelectedClip] =
    useState(null)

  const [comments,
    setComments] =
    useState([])

  const [commentText,
    setCommentText] =
    useState('')



  useEffect(() => {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            const video =
              entry.target

            if (
              !(video instanceof HTMLVideoElement)
            ) return



            if (

              entry.isIntersecting &&

              entry.intersectionRatio >= 0.6

            ) {

              video.play().catch(() => {})

            } else {

              video.pause()

            }

          })

        },

        {

          threshold: [
            0,
            0.25,
            0.6,
            0.9,
            1
          ]

        }

      )



    videoRefs.current.forEach((video) => {
      observer.observe(video)
    })



    return () =>
      observer.disconnect()

  }, [items])



  const setVideoRef =
    (id) => (element) => {

      if (!element) {

        videoRefs.current.delete(id)

        return

      }

      videoRefs.current.set(
        id,
        element
      )

    }

    async function openComments(clip) {

  setSelectedClip(clip)

  try {

    const response =
      await axios.get(

        `http://localhost:3000/api/clips/${clip._id}/comments`

      )



    setComments(
      response.data.comments
    )

  } catch (err) {

    console.log(err)

  }

}



function closeComments() {

  setSelectedClip(null)

}



async function handleComment() {

  if (!commentText.trim())
    return



  try {

    await axios.post(

      "http://localhost:3000/api/clips/comment",

      {

        clipId:
          selectedClip._id,

        text:
          commentText,

      },

      {
        withCredentials: true,
      }

    )



    /* UPDATE COMMENT COUNT IN UI */

    setSelectedClip((prev) => ({

      ...prev,

      commentCount:
        (prev.commentCount || 0) + 1,

    }))



    /* UPDATE FEED ITEMS */

    items.forEach((item) => {

      if (item._id === selectedClip._id) {

        item.commentCount =
          (item.commentCount || 0) + 1

      }

    })



    /* REFETCH COMMENTS */

    const response =
      await axios.get(

        `http://localhost:3000/api/clips/${selectedClip._id}/comments`

      )



    setComments(
      response.data.comments
    )



    setCommentText('')

  } catch (err) {

    console.log(err)

  }

}

  return (

    <div className="clips-page">



      <div
        className="clips-feed"
        role="list"
      >



        {
          items.length === 0 && (

            <div className="empty-state">

              <p>{emptyMessage}</p>

            </div>

          )
        }



        {
          items.map((item) => (

            <section

              key={item._id}

              className="clip"

              role="listitem"

            >



              <video

                ref={setVideoRef(item._id)}

                className="clip-video"

                src={item.video}

                muted

                playsInline

                loop

                preload="metadata"

              />



              <div className="clip-overlay">



                <div

                  className="clip-overlay-gradient"

                  aria-hidden="true"

                />



                <div className="clip-actions">



                  {/* LIKE */}

                  <div className="clip-action-group">

                    <button

                      onClick={
                        onLike
                          ? () => onLike(item)
                          : undefined
                      }

                      className="clip-action"

                    >

                      <FaHeart />

                    </button>



                    <div className="clip-action__count">

                      {item.likeCount ?? 0}

                    </div>

                  </div>



                  {/* COMMENT */}

                  <div className="clip-action-group">

                    <button

                      className="clip-action"

                      onClick={() =>
                        openComments(item)
                      }

                    >

                      <FaComment />

                    </button>



                    <div className="clip-action__count">

                      {
                        item.commentCount || 0
                      }

                    </div>

                  </div>



                  {/* SAVE */}

                  <div className="clip-action-group">

                    <button

                      className="clip-action"

                      onClick={
                        onSave
                          ? () => onSave(item)
                          : undefined
                      }

                    >

                      <FaBookmark />

                    </button>



                    <div className="clip-action__count">

                      {item.savesCount ?? 0}

                    </div>

                  </div>

                </div>



                <div className="clip-content">



                  <div className="clip-game-meta">



                    {
                      item.gameCover && (

                        <img

                          src={item.gameCover}

                          alt={item.gameName}

                          className="clip-game-cover"

                        />

                      )
                    }



                    <div className="clip-game-info">

                      <h3 className="clip-game-name">
                        {item.gameName}
                      </h3>



                      {
                        item.genre && (

                          <span className="clip-genre-pill">

                            {item.genre}

                          </span>

                        )
                      }

                    </div>

                  </div>



                  <p
                    className="clip-description"
                    title={item.description}
                  >
                    {item.description}
                  </p>



                  {
                    item.tags?.length > 0 && (

                      <div className="clip-tags">

                        {
                          item.tags.map((tag) => (

                            <span
                              key={tag}
                              className="clip-tag"
                            >
                              #{tag}
                            </span>

                          ))
                        }

                      </div>

                    )
                  }



                  {
                    item.creator && (

                      <div className="clip-creator-row">



                        <div className="clip-creator-avatar">

                          {
                            item.creator?.avatar ? (

                              <img

                                src={
                                  item.creator.avatar
                                }

                                alt={item.creator.name}

                                className="clip-creator-avatar-image"

                              />

                            ) : (

                              item.creator.name?.[0]

                            )
                          }

                        </div>



                        <div className="clip-creator-meta">



                          <div className="clip-creator-name">

                            @{item.creator.name}



                            {
                              item.creator.isVerified && (

                                <span className="verified-badge">

                                  ✓

                                </span>

                              )
                            }

                          </div>



                          <span className="clip-date">

                            {
                              new Date(
                                item.createdAt
                              ).toLocaleDateString()
                            }

                          </span>

                        </div>

                      </div>

                    )
                  }



                  {
                    item.gameUrl && (

                      <a

                        className="clip-btn"

                        href={item.gameUrl}

                        target="_blank"

                        rel="noreferrer"

                      >

                        View Game

                      </a>

                    )
                  }

                </div>

              </div>

            </section>

          ))
        }

      </div>



      {
        selectedClip && (

          <div className="comments-sheet">



            <div className="comments-sheet-header">

              <h3>
                Comments
              </h3>



              <button
                onClick={closeComments}
              >
                ✕
              </button>

            </div>



            <div className="comments-list">



              {
                comments.map((comment) => (

                  <div

                    key={comment._id}

                    className="comment-item"

                  >



                    <div className="comment-avatar">

                      {
                        comment.user?.avatar ? (

                          <img

                            src={
                              comment.user.avatar
                            }

                            alt=""

                          />

                        ) : (

                          comment.user?.fullName?.[0]

                        )
                      }

                    </div>



                    <div className="comment-content">

                      <strong>

                        {
                          comment.user?.fullName
                        }

                      </strong>



                      <p>
                        {comment.text}
                      </p>

                    </div>

                  </div>

                ))
              }

            </div>



            <div className="comment-input-row">

              <input

                value={commentText}

                onChange={(e) =>
                  setCommentText(
                    e.target.value
                  )
                }

                placeholder="Add a comment"

              />



              <button
                onClick={handleComment}
              >
                Post
              </button>

            </div>

          </div>

        )
      }

    </div>

  )

}



export default ClipFeed
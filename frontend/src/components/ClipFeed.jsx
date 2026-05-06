import React, { useEffect, useRef } from 'react'

const ClipFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = 'No clips yet.'
}) => {

  const videoRefs = useRef(new Map())



  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          const video = entry.target

          if (!(video instanceof HTMLVideoElement)) return

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
        threshold: [0, 0.25, 0.6, 0.9, 1]
      }
    )



    videoRefs.current.forEach((video) => {
      observer.observe(video)
    })



    return () => observer.disconnect()

  }, [items])



  const setVideoRef = (id) => (element) => {

    if (!element) {
      videoRefs.current.delete(id)
      return
    }

    videoRefs.current.set(id, element)

  }



  return (

    <div className="clips-page">

      <div className="clips-feed" role="list">

        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}



        {items.map((item) => (

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



              {/* ACTIONS */}
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
                    aria-label="Like clip"
                  >

                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>

                  </button>

                  <div className="clip-action__count">
                    {item.likeCount ?? 0}
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
                    aria-label="Save clip"
                  >

                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>

                  </button>

                  <div className="clip-action__count">
                    {item.savesCount ?? 0}
                  </div>

                </div>

              </div>



              {/* CONTENT */}
              <div className="clip-content">

                <h3 className="clip-game-name">
                  {item.gameName}
                </h3>



                {item.genre && (
                  <p className="clip-genre">
                    {item.genre}
                  </p>
                )}



                <p
                  className="clip-description"
                  title={item.description}
                >
                  {item.description}
                </p>



                {item.creator && (
                  <p className="clip-creator">
                    @{item.creator.name}
                  </p>
                )}



                {item.steamUrl && (
                  <a
                    className="clip-btn"
                    href={item.steamUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Steam
                  </a>
                )}

              </div>

            </div>

          </section>

        ))}

      </div>

    </div>

  )
}

export default ClipFeed
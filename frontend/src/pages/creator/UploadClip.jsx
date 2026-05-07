import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { FaHeart, FaBookmark} from "react-icons/fa"

import '../../styles/upload-clip.css'



const UploadClip = () => {

  const [gameName, setGameName] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [selectedGame, setSelectedGame] =
    useState(null)



  const [gameSearch, setGameSearch] =
    useState('')

  const [gameResults, setGameResults] =
    useState([])

  const [showDropdown, setShowDropdown] =
    useState(false)



  const [uploadProgress, setUploadProgress] =
    useState(0)

  const [isUploading, setIsUploading] =
    useState(false)



  const [videoFile, setVideoFile] =
    useState(null)

  const [videoURL, setVideoURL] =
    useState('')

  const [fileError, setFileError] =
    useState('')

  const [tags, setTags] = useState('')

  const fileInputRef = useRef(null)

  const navigate = useNavigate()



  /* =========================
     VIDEO PREVIEW
  ========================= */

  useEffect(() => {

    if (!videoFile) {

      setVideoURL('')

      return

    }

    const url =
      URL.createObjectURL(videoFile)

    setVideoURL(url)

    return () =>
      URL.revokeObjectURL(url)

  }, [videoFile])



  /* =========================
     GAME SEARCH
  ========================= */

  useEffect(() => {

    if (gameSearch.length < 2) {

      setGameResults([])

      setShowDropdown(false)

      return

    }

    const timeout = setTimeout(async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:3000/api/games/search?q=${gameSearch}`
          )

        setGameResults(response.data)

        setShowDropdown(true)

      } catch (err) {

        console.log(err)

      }

    }, 400)

    return () => clearTimeout(timeout)

  }, [gameSearch])



  /* =========================
     FILE CHANGE
  ========================= */

  const onFileChange = (e) => {

    const file =
      e.target.files?.[0]

    if (!file) {

      setVideoFile(null)

      setFileError('')

      return

    }

    if (!file.type.startsWith('video/')) {

      setFileError(
        'Please select a valid video file.'
      )

      return

    }

    setFileError('')

    setVideoFile(file)

  }



  /* =========================
     DROPZONE
  ========================= */

  const onDrop = (e) => {

    e.preventDefault()

    const file =
      e.dataTransfer?.files?.[0]

    if (!file) return

    if (!file.type.startsWith('video/')) {

      setFileError(
        'Please upload a valid video file.'
      )

      return

    }

    setFileError('')

    setVideoFile(file)

  }



  const onDragOver = (e) => {
    e.preventDefault()
  }



  const openFileDialog = () => {
    fileInputRef.current?.click()
  }



  /* =========================
     SELECT GAME
  ========================= */

  const selectGame = (game) => {

    setSelectedGame(game)

    setGameName(game.name)

    setGameSearch(game.name)

    setShowDropdown(false)

  }



  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (e) => {

    e.preventDefault()

    try {

      setIsUploading(true)

      setUploadProgress(0)



      const formData =
        new FormData()

      formData.append(
        'gameName',
        gameName
      )

      formData.append(
        'description',
        description
      )

      formData.append(
        'clip',
        videoFile
      )



      formData.append(
        'gameCover',
        selectedGame?.cover || ''
      )

      formData.append(
        'genre',
        selectedGame?.genre || ''
      )

      formData.append(
        'gameUrl',
        selectedGame?.website || ''
      )

      formData.append(
        'gameRating',
        selectedGame?.rating || 0
      )

      formData.append(
        'tags',
        JSON.stringify(
            
            tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      )


      await axios.post(

  "http://localhost:3000/api/clips",

  formData,

  {

    withCredentials: true,

    headers: {
      "Content-Type":
        "multipart/form-data",
    },

    onUploadProgress:
      (progressEvent) => {

        const percent =
          Math.round(

            (
              progressEvent.loaded * 100
            )

            /

            progressEvent.total

          )

        setUploadProgress(percent)

      },

  }
)



setUploadProgress(100)



setTimeout(() => {

  navigate("/")

}, 500)} catch (err) {

      console.log(err)

      setIsUploading(false)

    }

  }



  /* =========================
     DISABLED
  ========================= */

  const isDisabled = useMemo(() => {

    return (
      !gameName.trim()
      || !videoFile
      || isUploading
    )

  }, [
    gameName,
    videoFile,
    isUploading
  ])



  return (

    <div className="upload-clip-page">

      <div className="upload-clip-card">

        <header className="upload-clip-header">

          <h1 className="upload-clip-title">
            Upload Clip
          </h1>

          <p className="upload-clip-subtitle">
            Share a gameplay moment with the community.
          </p>

        </header>



        <form
          className="upload-clip-form"
          onSubmit={onSubmit}
        >

          {/* VIDEO */}

          <div className="field-group">

            <label htmlFor="clipVideo">
              Gameplay Clip
            </label>



            <input
              id="clipVideo"
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="video/*"
              onChange={onFileChange}
            />



            <div
              className="file-dropzone"
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >

              <div className="file-dropzone-inner">

                <div className="file-dropzone-text">

                  <strong>
                    Tap to upload
                  </strong>

                  {' '}or drag and drop

                </div>

                <div className="file-hint">
                  MP4, WebM, MOV
                </div>

              </div>

            </div>



            {
              fileError && (
                <p className="error-text">
                  {fileError}
                </p>
              )
            }

          </div>



          {/* VIDEO PREVIEW */}

          {
            videoURL && (

              <div className="video-preview">

                <video
                  className="video-preview-el"
                  src={videoURL}
                  controls
                  playsInline
                />

              </div>

            )
          }



          {/* GAME SEARCH */}

          <div className="field-group">

            <label>
              Game Name
            </label>

            <input
              type="text"
              placeholder="Search game..."
              value={gameSearch}

              onChange={(e) => {

                setGameSearch(
                  e.target.value
                )

                setGameName(
                  e.target.value
                )

              }}

              required
            />



            {
              showDropdown &&
              gameResults.length > 0 && (

                <div className="game-search-dropdown">

                  {
                    gameResults.map((game) => (

                      <button
                        type="button"
                        key={game._id || game.igdbId}
                        className="game-search-item"

                        onClick={() =>
                          selectGame(game)
                        }
                      >

                        {game.name}

                      </button>

                    ))
                  }

                </div>

              )
            }

          </div>



          {/* DESCRIPTION */}

          <div className="field-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              placeholder="Describe the gameplay moment..."
              value={description}

              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          {/* TAGS */}
          
          <div className="field-group">
            <label>
              Tags
            </label>
            
            <input
            type="text"
            placeholder="fps, ranked, clutch"
            value={tags}
            onChange={(e) =>
                setTags(e.target.value)
            }
            />
            </div>

          {/* ACTIONS */}

          <div className="form-actions">

            <button
              className="btn-primary"
              type="submit"
              disabled={isDisabled}
            >

              {
                isUploading
                  ? `Uploading ${uploadProgress}%`
                  : "Upload Clip"
              }

            </button>

          </div>



          {/* PROGRESS BAR */}

          {
            isUploading && (

              <div className="upload-progress">

                <div
                  className="upload-progress-bar"
                  style={{
                    width:
                      `${uploadProgress}%`
                  }}
                />

              </div>

            )
          }

        </form>

      </div>

    </div>

  )
}

export default UploadClip
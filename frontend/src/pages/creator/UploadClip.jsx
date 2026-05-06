import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import axios from 'axios'

import { useNavigate } from 'react-router-dom'

import '../../styles/upload-clip.css'


const UploadClip = () => {

  const [gameName, setGameName] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [steamUrl, setSteamUrl] = useState('')

  const [videoFile, setVideoFile] = useState(null)

  const [videoURL, setVideoURL] = useState('')

  const [fileError, setFileError] = useState('')

  const fileInputRef = useRef(null)

  const navigate = useNavigate()



  useEffect(() => {

    if (!videoFile) {
      setVideoURL('')
      return
    }

    const url = URL.createObjectURL(videoFile)

    setVideoURL(url)

    return () => URL.revokeObjectURL(url)

  }, [videoFile])



  const onFileChange = (e) => {

    const file = e.target.files?.[0]

    if (!file) {
      setVideoFile(null)
      setFileError('')
      return
    }

    if (!file.type.startsWith('video/')) {

      setFileError('Please select a valid video file.')

      return

    }

    setFileError('')
    setVideoFile(file)

  }



  const onDrop = (e) => {

    e.preventDefault()

    const file = e.dataTransfer?.files?.[0]

    if (!file) return

    if (!file.type.startsWith('video/')) {

      setFileError('Please upload a valid video file.')

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



  const onSubmit = async (e) => {

    e.preventDefault()

    try {

      const formData = new FormData()

      formData.append('gameName', gameName)
      formData.append('description', description)
      formData.append('genre', genre)
      formData.append('steamUrl', steamUrl)

      formData.append('clip', videoFile)



      await axios.post(
        "http://localhost:3000/api/clips",
        formData,
        {
          withCredentials: true
        }
      )



      navigate("/")

    } catch (err) {

      console.error(err)

    }

  }



  const isDisabled = useMemo(() => {

    return !gameName.trim() || !videoFile

  }, [gameName, videoFile])



  return (

    <div className="create-clip-page">

      <div className="create-clip-card">

        <header className="create-clip-header">

          <h1 className="create-clip-title">
            Upload Clip
          </h1>

          <p className="create-clip-subtitle">
            Share a gameplay moment with the community.
          </p>

        </header>



        <form
          className="create-clip-form"
          onSubmit={onSubmit}
        >

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
                  <strong>Tap to upload</strong>
                  {' '}or drag and drop
                </div>

                <div className="file-hint">
                  MP4, WebM, MOV
                </div>

              </div>

            </div>



            {fileError && (
              <p className="error-text">
                {fileError}
              </p>
            )}

          </div>



          {videoURL && (

            <div className="video-preview">

              <video
                className="video-preview-el"
                src={videoURL}
                controls
                playsInline
              />

            </div>

          )}



          <div className="field-group">

            <label htmlFor="gameName">
              Game Name
            </label>

            <input
              id="gameName"
              type="text"
              placeholder="Cyberpunk 2077"
              value={gameName}
              onChange={(e) =>
                setGameName(e.target.value)
              }
              required
            />

          </div>



          <div className="field-group">

            <label htmlFor="genre">
              Genre
            </label>

            <input
              id="genre"
              type="text"
              placeholder="Action RPG"
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
            />

          </div>



          <div className="field-group">

            <label htmlFor="steamUrl">
              Steam URL
            </label>

            <input
              id="steamUrl"
              type="text"
              placeholder="https://store.steampowered.com/..."
              value={steamUrl}
              onChange={(e) =>
                setSteamUrl(e.target.value)
              }
            />

          </div>



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



          <div className="form-actions">

            <button
              className="btn-primary"
              type="submit"
              disabled={isDisabled}
            >
              Upload Clip
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}

export default UploadClip
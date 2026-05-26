import React, { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useUploadClip } from "../../features/clips/hooks/useUploadClip";
import { searchGames } from "../../features/games/api/gamesApi";

import "../../styles/upload-clip.css";

const UploadClip = () => {
  const [gameName, setGameName] = useState("");

  const [caption, setCaption] = useState("");

  const [selectedGame, setSelectedGame] = useState(null);

  const [gameSearch, setGameSearch] = useState("");

  const [gameResults, setGameResults] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  const [isSearchingGames, setIsSearchingGames] = useState(false);

  const [videoFile, setVideoFile] = useState(null);

  const [videoURL, setVideoURL] = useState("");

  const [fileError, setFileError] = useState("");

  const [tags, setTags] = useState("");

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const {
    mutate,

    isPending,

    progress,
  } = useUploadClip();

  /* =========================
     VIDEO PREVIEW
  ========================= */

  useEffect(() => {
    if (!videoFile) {
      setVideoURL("");

      return;
    }

    const url = URL.createObjectURL(videoFile);

    setVideoURL(url);

    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  /* =========================
     GAME SEARCH
  ========================= */

  useEffect(() => {
    const trimmedSearch = gameSearch.trim();

    if (
      selectedGame &&
      trimmedSearch.toLowerCase() === selectedGame.name.toLowerCase()
    ) {
      setGameResults([]);

      setShowDropdown(false);

      return;
    }

    if (trimmedSearch.length < 2) {
      setGameResults([]);

      setShowDropdown(false);

      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(
      async () => {
        try {
          setIsSearchingGames(true);

          const response = await searchGames(trimmedSearch, {
            signal: controller.signal,
          });

          setGameResults((response.games || []).slice(0, 3));

          setShowDropdown(true);
        } catch (err) {
          if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
            console.log(err);
          }
        } finally {
          setIsSearchingGames(false);
        }
      },

      250,
    );

    return () => {
      controller.abort();

      clearTimeout(timeout);
    };
  }, [gameSearch, selectedGame]);

  /* =========================
     FILE CHANGE
  ========================= */

  const onFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setVideoFile(null);

      setFileError("");

      return;
    }

    if (!file.type.startsWith("video/")) {
      setFileError("Please select a valid video file.");

      return;
    }

    setFileError("");

    setVideoFile(file);
  };

  /* =========================
     DROPZONE
  ========================= */

  const onDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setFileError("Please upload a valid video file.");

      return;
    }

    setFileError("");

    setVideoFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  /* =========================
     SELECT GAME
  ========================= */

  const selectGame = (game) => {
    setSelectedGame(game);

    setGameName(game.name);

    setGameSearch(game.name);

    setGameResults([]);

    setShowDropdown(false);
  };

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("gameName", gameName);

    formData.append("caption", caption);
    formData.append("description", caption);

    formData.append("clip", videoFile);

    formData.append("gameCover", selectedGame?.cover || "");

    formData.append("igdbId", selectedGame?.igdbId || "");

    formData.append("gameAppId", selectedGame?.igdbId || "");

    formData.append("gameSlug", selectedGame?.slug || "");

    formData.append("genre", selectedGame?.genre || "");

    formData.append("gameUrl", selectedGame?.website || "");

    formData.append("rating", selectedGame?.rating || 0);

    formData.append(
      "tags",

      JSON.stringify(
        tags
          .split(",")

          .map((tag) => tag.trim())

          .filter(Boolean),
      ),
    );

    mutate(formData, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  /* =========================
     DISABLED
  ========================= */

  const isDisabled = useMemo(() => {
    return !selectedGame || !gameName.trim() || !videoFile || isPending;
  }, [selectedGame, gameName, videoFile, isPending]);

  return (
    <div
      className="
      upload-clip-page
    "
    >
      <div
        className="
        upload-clip-card
      "
      >
        <header
          className="
          upload-clip-header
        "
        >
          <h1
            className="
            upload-clip-title
          "
          >
            Upload Clip
          </h1>

          <p
            className="
            upload-clip-subtitle
          "
          >
            Share a gameplay moment with the community.
          </p>
        </header>

        <form
          className="
            upload-clip-form
          "
          onSubmit={onSubmit}
        >
          {/* VIDEO */}

          <div
            className="
            field-group
          "
          >
            <label
              htmlFor="
              clipVideo
            "
            >
              Gameplay Clip
            </label>

            <input
              id="clipVideo"
              ref={fileInputRef}
              className="
                file-input-hidden
              "
              type="file"
              accept="video/*"
              onChange={onFileChange}
            />

            <div
              className="
                file-dropzone
              "
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div
                className="
                file-dropzone-inner
              "
              >
                <div
                  className="
                  file-dropzone-text
                "
                >
                  <strong>Tap to upload</strong> or drag and drop
                </div>

                <div
                  className="
                  file-hint
                "
                >
                  MP4, WebM, MOV
                </div>
              </div>
            </div>

            {fileError && (
              <p
                className="
                error-text
              "
              >
                {fileError}
              </p>
            )}
          </div>

          {/* VIDEO PREVIEW */}

          {videoURL && (
            <div
              className="
              video-preview
            "
            >
              <video
                className="
                  video-preview-el
                "
                src={videoURL}
                controls
                playsInline
              />
            </div>
          )}

          {/* GAME SEARCH */}

          <div
            className="
            field-group
          "
          >
            <label>Game Name</label>

            <input
              type="text"
              placeholder="
                Search game...
              "
              value={gameSearch}
              onChange={(e) => {
                const nextValue = e.target.value;

                setGameSearch(nextValue);

                setGameName(nextValue);

                setSelectedGame(null);
              }}
              onFocus={() => {
                if (gameResults.length > 0) {
                  setShowDropdown(true);
                }
              }}
              required
            />

            {showDropdown && (gameResults.length > 0 || isSearchingGames) && (
              <div
                className="
                game-search-dropdown
              "
              >
                {isSearchingGames && gameResults.length === 0 && (
                  <div className="game-search-state">Searching...</div>
                )}

                {gameResults.map((game) => (
                  <button
                    type="button"
                    key={game._id || game.igdbId}
                    className="
                      game-search-item
                    "
                    onClick={() => selectGame(game)}
                  >
                    <span className="game-search-cover">
                      {game.cover ? (
                        <img src={game.cover} alt="" loading="lazy" />
                      ) : (
                        <span>{game.name?.[0] || "G"}</span>
                      )}
                    </span>

                    <span className="game-search-name">{game.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CAPTION */}

          <div
            className="
            field-group
          "
          >
            <label
              htmlFor="
               caption
            "
            >
              Caption
            </label>

            <textarea
              id="caption"
              rows={4}
              placeholder="
                Add a caption for this gameplay moment...
              "
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* TAGS */}

          <div
            className="
            field-group
          "
          >
            <label>Tags</label>

            <input
              type="text"
              placeholder="
                fps, ranked,
                clutch
              "
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* ACTIONS */}

          <div
            className="
            form-actions
          "
          >
            <button
              className="
                btn-primary
              "
              type="submit"
              disabled={isDisabled}
            >
              {isPending ? `Uploading ${progress}%` : "Upload Clip"}
            </button>
          </div>

          {/* PROGRESS */}

          {isPending && (
            <div
              className="
              upload-progress-wrapper
            "
            >
              <div
                className="
                upload-progress-bar
              "
              >
                <div
                  className="
                    upload-progress-fill
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p>{progress}%</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadClip;

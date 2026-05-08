import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

import "../../styles/clips.css";

import ClipFeed from "../../components/ClipFeed";

const Home = () => {
  const [clips, setClips] = useState([]);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const observer = useRef();

  async function fetchClips(pageNumber = 1) {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:3000/api/clips?page=${pageNumber}&limit=5`,

        {
          withCredentials: true,
        },
      );

      setClips((prev) => [...prev, ...response.data.clips]);

      setHasMore(response.data.hasMore);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClips(page);
  }, [page]);

  async function likeClip(item) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/clips/like",
        {
          clipId: item._id,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.like) {
        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  likeCount: clip.likeCount + 1,
                }
              : clip,
          ),
        );
      } else {
        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  likeCount: Math.max(0, clip.likeCount - 1),
                }
              : clip,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  const lastClipRef = (node) => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  async function saveClip(item) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/clips/save",
        {
          clipId: item._id,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.save) {
        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  savesCount: (clip.savesCount || 0) + 1,
                }
              : clip,
          ),
        );
      } else {
        setClips((prev) =>
          prev.map((clip) =>
            clip._id === item._id
              ? {
                  ...clip,
                  savesCount: Math.max(0, (clip.savesCount || 0) - 1),
                }
              : clip,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ClipFeed
      items={clips}
      onLike={likeClip}
      onSave={saveClip}
      loading={loading}
      hasMore={hasMore}
      lastClipRef={lastClipRef}
      emptyMessage="No clips available."
    />
  );
};

export default Home;

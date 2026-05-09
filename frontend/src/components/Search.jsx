import React, { useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import "../styles/search.css";

const Search = () => {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);

  async function handleSearch(value) {
    setQuery(value);

    if (!value.trim()) {
      setResults(null);

      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:3000/api/search?q=${value}`,
      );

      setResults(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search</h1>

        <p className="search-subtitle">Discover creators, games, and tags.</p>
      </div>

      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search creators, games, tags"
          className="search-input"
        />
      </div>

      {loading && <div className="search-loading">Searching...</div>}

      {results && (
        <div className="search-results">
          {/* CREATORS */}

          <div className="search-section">
            <h2 className="search-section-title">Creators</h2>

            {results.creators?.length > 0 ? (
              <div className="search-creators-list">
                {results.creators.map((creator) => (
                  <Link
                    key={creator._id}
                    to={`/creator/${creator._id}`}
                    className="search-creator-card"
                  >
                    <div className="search-creator-avatar">
                      {creator.avatar ? (
                        <img src={creator.avatar} alt={creator.name} />
                      ) : (
                        creator.name?.[0]
                      )}
                    </div>

                    <div className="search-creator-meta">
                      <span className="search-creator-name">
                        @{creator.name}
                      </span>

                      {creator.isVerified && (
                        <span className="search-verified">✓ Verified</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="search-empty">No creators found.</p>
            )}
          </div>

          {/* GAMES */}

          <div className="search-section">
            <h2 className="search-section-title">Games</h2>

            {results.clips?.length > 0 ? (
              <div className="search-games-list">
                {results.clips.map((clip) => (
                  <div key={clip._id} className="search-game-card">
                    {clip.thumbnail && (
                      <img
                        src={clip.thumbnail}
                        alt={clip.gameName}
                        className="search-game-thumbnail"
                      />
                    )}

                    <span className="search-game-name">{clip.gameName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="search-empty">No games found.</p>
            )}
          </div>

          {/* TAGS */}

          <div className="search-section">
            <h2 className="search-section-title">Trending Tags</h2>

            {results.tags?.length > 0 ? (
              <div className="search-tags-list">
                {results.tags.map((tag) => (
                  <button key={tag} className="search-tag">
                    #{tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="search-empty">No tags found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../features/clips/hooks/useDebounce";
import { useSearch } from "../features/search/hooks/useSearch";

import "../styles/search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: results,
    isLoading: loading,
  } = useSearch(debouncedQuery);

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
          onChange={(e) => setQuery(e.target.value)}
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

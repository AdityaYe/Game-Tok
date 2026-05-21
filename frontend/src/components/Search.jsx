import React, { useState } from "react";
import { Link } from "react-router-dom";
import ClipFeed from "./feed/ClipFeed";
import { useDebounce } from "../features/clips/hooks/useDebounce";
import { useSearch } from "../features/search/hooks/useSearch";
import { optimizeImage } from "../utils/cloudinary";

import "../styles/search.css";
import "../styles/clips.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { data: results, isLoading: loading } = useSearch(debouncedQuery);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search</h1>

        <p className="search-subtitle">Discover profiles, games, and tags.</p>
      </div>

      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search profiles, games, tags"
          className="search-input"
        />
      </div>

      {loading && <div className="search-loading">Searching...</div>}

      {results && (
        <div className="search-results">
          <div className="search-section">
            <h2 className="search-section-title">Profiles</h2>

            {results.creators?.length > 0 ? (
              <div className="search-creators-list">
                {results.creators.map((creator) => (
                  <Link
                    key={creator._id}
                    to={`/profile/${creator._id}`}
                    className="search-creator-card"
                  >
                    <div className="search-creator-avatar">
                      {creator.avatar ? (
                        <img src={optimizeImage(creator.avatar)} loading="lazy" alt={creator.fullName} />
                      ) : (
                        creator.fullName?.[0]
                      )}
                    </div>

                    <div className="search-creator-meta">
                      <span className="search-creator-name">
                        @{creator.fullName}
                      </span>

                      {creator.isVerified && (
                        <span className="search-verified">✓ Verified</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="search-empty">No profiles found.</p>
            )}
          </div>

          <div className="search-section">
            <h2 className="search-section-title">Clips</h2>

            {results.clips?.length > 0 ? (
              <div className="search-feed-shell">
                <ClipFeed
                  items={results.clips}
                  hasMore={false}
                  loadMore={() => Promise.resolve()}
                />
              </div>
            ) : (
              <p className="search-empty">No clips found.</p>
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

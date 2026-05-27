import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaCheck, FaGamepad, FaSearch, FaUserPlus } from "react-icons/fa";

import { useDebounce } from "../features/clips/hooks/useDebounce";
import { useSearch } from "../features/search/hooks/useSearch";
import { searchGames } from "../features/games/api/gamesApi";
import { useFollowUser } from "../features/users/hooks/useFollowUser";
import useAuthStore from "../store/authStore";
import { optimizeImage } from "../utils/cloudinary";

import "../styles/search.css";

const SEARCH_TABS = ["All", "Usernames", "Games", "Clips"];

function formatCount(value = 0) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return String(value);
}

function normalizeTags(tags = [], query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  return [...new Set(tags.filter(Boolean))]
    .sort((a, b) => {
      const first = a.toLowerCase().includes(normalizedQuery) ? -1 : 1;
      const second = b.toLowerCase().includes(normalizedQuery) ? -1 : 1;
      return first - second || a.localeCompare(b);
    })
    .slice(0, 18);
}

const SearchUserCard = ({ creator, currentUser, followMutation }) => {
  const creatorId = creator?._id;
  const isOwnProfile = currentUser?._id && String(currentUser._id) === String(creatorId);
  const isFollowing = currentUser?.following?.some(
    (id) => String(id) === String(creatorId),
  );
  const showFollow = currentUser && creatorId && !isOwnProfile;

  return (
    <article className="search-user-card">
      <Link to={`/profile/${creatorId}`} className="search-user-link">
        <span className="search-user-avatar">
          {creator.avatar ? (
            <img
              src={optimizeImage(creator.avatar, 300)}
              loading="lazy"
              alt={creator.fullName || "Creator"}
            />
          ) : (
            creator.fullName?.[0] || "G"
          )}
        </span>

        <span className="search-user-meta">
          <strong>@{creator.fullName}</strong>
          <small>{formatCount(creator.followerCount || 0)} followers</small>
        </span>
      </Link>

      {showFollow && (
        <button
          type="button"
          className={`search-follow-btn ${isFollowing ? "is-following" : ""}`}
          disabled={followMutation.isPending}
          onClick={() =>
            followMutation.mutate({
              userId: creatorId,
              following: !!isFollowing,
            })
          }
        >
          {isFollowing ? <FaCheck /> : <FaUserPlus />}
          <span>{isFollowing ? "Following" : "Follow"}</span>
        </button>
      )}
    </article>
  );
};

const SearchGameCard = ({ game }) => (
  <article className="search-game-card">
    <span className="search-game-cover">
      {game.cover ? (
        <img src={game.cover} loading="lazy" alt={game.name} />
      ) : (
        <FaGamepad />
      )}
    </span>

    <span className="search-game-meta">
      <strong>{game.name}</strong>
      <small>{game.genre || "Game"}</small>
    </span>
  </article>
);

const SearchTags = ({ tags, onSelectTag }) => {
  if (tags.length === 0) {
    return <p className="search-empty">No related tags found.</p>;
  }

  return (
    <div className="search-tags-list">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="search-tag"
          onClick={() => onSelectTag(tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};

const SearchClipGrid = ({ clips, query }) => {
  const navigate = useNavigate();

  if (clips.length === 0) {
    return <p className="search-empty">No clips found.</p>;
  }

  return (
    <div className="search-clip-grid">
      {clips.map((clip) => (
        <button
          key={clip._id}
          type="button"
          className="search-clip-tile"
          onClick={() =>
            navigate(
              `/search/clips/${clip._id}?q=${encodeURIComponent(query)}`,
              {
                state: {
                  clips,
                  query,
                },
              },
            )
          }
        >
          {clip.thumbnail ? (
            <img
              src={optimizeImage(clip.thumbnail, 700)}
              loading="lazy"
              alt={clip.gameName || "Gameplay clip"}
            />
          ) : (
            <video src={clip.video} muted playsInline preload="metadata" />
          )}

          <span className="search-clip-overlay">
            <span>{formatCount(clip.views || clip.likeCount || 0)}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const debouncedQuery = useDebounce(query, 500);
  const trimmedQuery = debouncedQuery.trim();
  const { data: results, isLoading: loading } = useSearch(debouncedQuery);
  const currentUser = useAuthStore((state) => state.user);
  const followMutation = useFollowUser();

  const { data: gamesData, isLoading: gamesLoading } = useQuery({
    queryKey: ["search-games", trimmedQuery],
    queryFn: ({ signal }) => searchGames(trimmedQuery, { signal }),
    enabled: !!trimmedQuery,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    setActiveTab("All");
  }, [trimmedQuery]);

  const creators = results?.creators || [];
  const games = (gamesData?.games || []).slice(0, 3);
  const clips = results?.clips || [];
  const tags = useMemo(
    () => normalizeTags(results?.tags || [], trimmedQuery),
    [results?.tags, trimmedQuery],
  );
  const hasSearch = query.trim().length > 0;
  const hasCompletedSearch = trimmedQuery.length > 0;

  const renderUsers = (limit) => {
    const visibleCreators = typeof limit === "number" ? creators.slice(0, limit) : creators;

    if (visibleCreators.length === 0) {
      return <p className="search-empty">No usernames found.</p>;
    }

    return (
      <div className="search-users-list">
        {visibleCreators.map((creator) => (
          <SearchUserCard
            key={creator._id}
            creator={creator}
            currentUser={currentUser}
            followMutation={followMutation}
          />
        ))}
      </div>
    );
  };

  const renderGames = () => {
    if (gamesLoading && games.length === 0) {
      return <p className="search-empty">Finding closest games...</p>;
    }

    if (games.length === 0) {
      return <p className="search-empty">No games found.</p>;
    }

    return (
      <div className="search-games-list">
        {games.map((game) => (
          <SearchGameCard key={game.igdbId || game.slug || game.name} game={game} />
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search</h1>
        <p className="search-subtitle">Find players, games, tags, and gameplay moments.</p>
      </div>

      <label className="search-input-wrapper">
        <FaSearch />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Valorant, creators, tags"
          className="search-input"
        />
      </label>

      {hasCompletedSearch && (
        <div className="search-tabs" role="tablist" aria-label="Search filters">
          {SEARCH_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`search-tab ${activeTab === tab ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {loading && hasSearch && <div className="search-loading">Searching...</div>}

      {!hasSearch && (
        <div className="search-empty-state">
          <strong>Start with a game, creator, or hashtag.</strong>
          <span>Results stay lightweight until you choose Clips.</span>
        </div>
      )}

      {results && hasCompletedSearch && (
        <div className="search-results">
          {activeTab === "All" && (
            <>
              <section className="search-section">
                <div className="search-section-heading">
                  <h2>Usernames</h2>
                  {creators.length > 3 && (
                    <button type="button" onClick={() => setActiveTab("Usernames")}>
                      View all
                    </button>
                  )}
                </div>
                {renderUsers(3)}
              </section>

              <section className="search-section">
                <div className="search-section-heading">
                  <h2>Games</h2>
                  <button type="button" onClick={() => setActiveTab("Games")}>
                    Explore
                  </button>
                </div>
                {renderGames()}
              </section>

              <section className="search-section search-section--flat">
                <div className="search-section-heading">
                  <h2>Tags</h2>
                </div>
                <SearchTags tags={tags.slice(0, 12)} onSelectTag={setQuery} />
              </section>
            </>
          )}

          {activeTab === "Usernames" && (
            <section className="search-section search-section--flat">
              <div className="search-section-heading">
                <h2>Usernames</h2>
              </div>
              {renderUsers()}
            </section>
          )}

          {activeTab === "Games" && (
            <>
              <section className="search-section">
                <div className="search-section-heading">
                  <h2>Closest games</h2>
                </div>
                {renderGames()}
              </section>

              <section className="search-section search-section--flat">
                <div className="search-section-heading">
                  <h2>Related tags</h2>
                </div>
                <SearchTags tags={tags} onSelectTag={setQuery} />
              </section>
            </>
          )}

          {activeTab === "Clips" && (
            <section className="search-section search-section--clips">
              <div className="search-section-heading">
                <h2>Clips</h2>
              </div>
              <SearchClipGrid clips={clips} query={trimmedQuery} />
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

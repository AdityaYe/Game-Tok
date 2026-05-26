import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaTrash, FaTimes } from "react-icons/fa";

import { useComments } from "../../features/comments/hooks/useComment";
import { useAddComment } from "../../features/comments/hooks/useAddComment";
import { useDeleteComment } from "../../features/comments/hooks/useDeleteComment";
import useAuthStore from "../../store/authStore";

const CommentModal = ({ clipCreatorId, clipId, onClose }) => {
  const [text, setText] = useState("");

  const currentUser = useAuthStore((state) => state.user);
  const { data, isLoading } = useComments(clipId);
  const comments = data?.comments || [];
  const addCommentMutation = useAddComment(clipId);
  const deleteCommentMutation = useDeleteComment(clipId);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    addCommentMutation.mutate(
      {
        clipId,
        text,
      },
      {
        onSuccess: () => {
          setText("");
        },
      },
    );
  };

  return ReactDOM.createPortal(
    <div className="comments-overlay" role="presentation" onClick={onClose}>
      <aside
        className="comments-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Clip comments"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="comments-header">
          <div className="comments-handle" aria-hidden="true" />

          <div className="comments-title-group">
            <h2>Comments</h2>
            <span>{comments.length} Comments</span>
          </div>

          <button
            onClick={onClose}
            className="comments-close"
            aria-label="Close comments"
            type="button"
          >
            <FaTimes />
          </button>
        </header>

        <div className="comments-list">
          {isLoading ? (
            <div className="comments-state">Loading comments...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const authorName = comment.user?.fullName || "Player";
              const authorId = comment.user?._id || comment.user;
              const canDelete =
                currentUser?._id &&
                (authorId === currentUser._id || clipCreatorId === currentUser._id);

              return (
                <article key={comment._id} className="comment-item">
                  {comment.user?.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt=""
                      className="comment-avatar"
                      loading="lazy"
                    />
                  ) : (
                    <div className="comment-avatar comment-avatar-placeholder">
                      {authorName[0]}
                    </div>
                  )}

                  <div className="comment-body">
                    <div className="comment-meta-row">
                      <div className="comment-user">
                        <strong>{authorName}</strong>
                      </div>

                      {canDelete && !comment.optimistic && (
                        <button
                          className="comment-delete-button"
                          type="button"
                          aria-label="Delete comment"
                          disabled={deleteCommentMutation.isPending}
                          onClick={() => deleteCommentMutation.mutate(comment._id)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>

                    <p className="comment-text">{comment.text}</p>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="comments-empty">
              <strong>No comments yet</strong>
              <span>Start the conversation for this clip.</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="comments-form">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a comment..."
            disabled={addCommentMutation.isPending}
          />

          <button
            type="submit"
            disabled={!text.trim() || addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? "Sending" : "Send"}
          </button>
        </form>
      </aside>
    </div>,
    document.body,
  );
};

export default CommentModal;

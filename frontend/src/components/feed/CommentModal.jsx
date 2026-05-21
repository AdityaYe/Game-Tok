import React, { useState } from "react";

import Modal from "../ui/modal/Modal";

import { useComments } from "../../features/comments/hooks/useComment";

import { useAddComment } from "../../features/comments/hooks/useAddComment";

import Button from "../ui/form/Button";

import Input from "../ui/form/Input";

const CommentModal = ({ clipId, onClose }) => {
  const [text, setText] = useState("");

  const { data, isLoading } = useComments(clipId);

  const comments = data?.comments || [];

  const addCommentMutation = useAddComment(clipId);

  const handleSubmit = (e) => {
    e.preventDefault();

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

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div
        className="
          comments-modal
        "
      >
        <div
          className="
            comments-header
          "
        >
          <h2>Comments</h2>

          <button
            onClick={onClose}
            className="
              comments-close
            "
            aria-label="
              Close comments
            "
          >
            ✕
          </button>
        </div>

        <div
          className="
            comments-list
          "
        >
          {isLoading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="
                    comment-item
                  "
              >
                <div
                  className="
                      comment-user
                    "
                >
                  {comment.user?.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user?.fullName}
                      className="
                          comment-avatar
                        "
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="
                          comment-avatar-placeholder
                        "
                    >
                      {comment.user?.fullName?.[0]}
                    </div>
                  )}

                  <strong>{comment.user?.fullName}</strong>
                </div>

                <p
                  className="
                      comment-text
                    "
                >
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            comments-form
          "
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="
              Add a comment...
            "
            disabled={addCommentMutation.isPending}
          />

          <Button
            type="submit"
            loading={addCommentMutation.isPending}
            disabled={!text.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CommentModal;

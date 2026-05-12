import React, { useState } from "react";

import { useComments } from "../../features/comments/hooks/useComments";

import { useAddComment } from "../../features/comments/hooks/useAddComment";

const CommentModal = ({ clipId, onClose }) => {
  const [text, setText] = useState("");

  const { data, isLoading } = useComments(clipId);

  const addCommentMutation = useAddComment(clipId);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    addCommentMutation.mutate({
      clipId,
      text,
    });

    setText("");
  };

  return (
    <div
      className="
      comments-modal
    "
    >
      <button onClick={onClose}>Close</button>

      <div
        className="
        comments-list
      "
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.comments?.map((comment) => (
            <div key={comment._id}>
              <strong>{comment.user?.fullName}</strong>

              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="
            Add comment
          "
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CommentModal;

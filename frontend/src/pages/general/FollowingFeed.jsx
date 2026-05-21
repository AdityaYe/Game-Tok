import FeedLayout from "../../app/layouts/FeedLayout";

const FollowingFeed = () => {
  return (
    <FeedLayout>
      <section className="app-placeholder" aria-labelledby="following-title">
        <p className="app-placeholder__eyebrow">Following</p>
        <h1 id="following-title">Following feed is coming next.</h1>
        <p>
          This space is reserved for clips from profiles you follow, using the
          same vertical viewing shell as the main clips feed.
        </p>
      </section>
    </FeedLayout>
  );
};

export default FollowingFeed;

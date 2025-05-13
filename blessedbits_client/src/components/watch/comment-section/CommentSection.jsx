import { FaComments, FaHeart, FaReply } from "react-icons/fa";
import styles from "./CommentSection.module.css";

const CommentSection = ({
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  onCommentLike,
}) => {
  return (
    <div className={styles.commentsSection}>
      <h2>
        <FaComments /> Comments ({comments.length})
      </h2>

      <form className={styles.commentForm} onSubmit={onCommentSubmit}>
        <div className={styles.userAvatar}>YO</div>
        <div className={styles.commentInputContainer}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={onCommentChange}
          />
          <button type="submit" className={styles.commentSubmit}>
            Post
          </button>
        </div>
      </form>

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div className={styles.comment} key={comment.id}>
            <div className={styles.commentAvatar}>{comment.initials}</div>
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={styles.commentTime}>{comment.timestamp}</span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
              <div className={styles.commentActions}>
                <button
                  className={`${styles.commentAction} ${
                    comment.isLiked ? styles.liked : ""
                  }`}
                  onClick={() => onCommentLike(comment.id)}
                >
                  <FaHeart /> {comment.likes}
                </button>
                <button className={styles.commentAction}>
                  <FaReply /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;

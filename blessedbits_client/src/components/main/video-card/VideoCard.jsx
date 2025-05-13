import { FaHeart, FaCoins } from "react-icons/fa";
import styles from "./VideoCard.module.css";
import { Link } from "react-router-dom";

const VideoCard = ({
  videoId,
  thumbnail,
  duration,
  title,
  creatorInitials,
  creatorName,
  description,
  likes,
  earnings,
  tags = [],
}) => {
  return (
    <Link to={`${videoId}`} className={styles.videoCard}>
      <div className={styles.videoThumbnail}>
        <img src={thumbnail} alt={title} />
        <div className={styles.videoDuration}>{duration}</div>
      </div>
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{title}</h3>
        <div className={styles.videoCreator}>
          <div className={styles.videoCreatorAvatar}>{creatorInitials}</div>
          <span>{creatorName}</span>
        </div>
        <p className={styles.videoDescription}>{description}</p>
        {tags.length > 0 && (
          <div className={styles.videoTags}>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className={styles.videoStats}>
          <span>
            <FaHeart className={styles.statIcon} /> {likes}
          </span>
          <span>
            <FaCoins className={styles.statIcon} /> {earnings} $BLESS
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;

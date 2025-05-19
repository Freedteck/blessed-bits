import { FaHeart, FaCoins, FaPlay } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import styles from "./VideoCard.module.css";
import { useNetworkVariable } from "../../../config/networkConfig";
import { useUserData } from "../../../hooks/useUserData";

const VideoCard = ({
  videoUrl,
  thumbnail,
  duration,
  title,
  creator,
  description,
  likes,
  tags = [],
  compact = false,
}) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const platformStateId = useNetworkVariable("platformStateId");
  const { userProfile } = useUserData(platformStateId, creator);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeoutId;

    if (isHovered && !hasVideoError) {
      timeoutId = setTimeout(() => {
        try {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn("Video play prevented:", err);
              setHasVideoError(true);
            });
          }
        } catch (err) {
          console.error("Video playback failed:", err);
          setHasVideoError(true);
        }
      }, 100); // Delay reduces flicker or race
    } else {
      video.pause();
    }

    return () => {
      clearTimeout(timeoutId);
      video.pause();
    };
  }, [isHovered, hasVideoError]);

  return (
    <div
      className={`${styles.videoCard} ${compact ? styles.compact : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.mediaContainer}>
        <video
          key={videoUrl}
          ref={videoRef}
          className={`${styles.videoElement} ${
            isHovered && !hasVideoError ? styles.visible : styles.hidden
          }`}
          muted
          loop
          playsInline
          preload="metadata"
          poster={thumbnail}
          onError={() => setHasVideoError(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {!isHovered && (
          <div className={styles.playButton}>
            <FaPlay />
          </div>
        )}

        <div className={styles.videoDuration}>{duration}</div>
      </div>

      <div className={styles.videoInfo}>
        <div className={styles.creatorInfo}>
          <div className={styles.creatorAvatar}>
            {userProfile?.username.slice(0, 2)}
          </div>
          <div>
            <h3 className={styles.videoTitle}>{title}</h3>
            {!compact && (
              <p className={styles.creatorName}>{userProfile?.username}</p>
            )}
          </div>
        </div>

        {!compact && (
          <>
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
          </>
        )}

        <div className={styles.videoStats}>
          <div className={styles.statItem}>
            <FaHeart className={styles.statIcon} />
            <span>{likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

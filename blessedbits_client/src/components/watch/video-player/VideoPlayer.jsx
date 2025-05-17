import { useRef, useState } from "react";
import styles from "./VideoPlayer.module.css";

const VideoPlayer = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const [_isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.videoPlayer}>
      <video
        ref={videoRef}
        controls
        autoPlay
        poster={poster}
        onClick={togglePlay}
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;

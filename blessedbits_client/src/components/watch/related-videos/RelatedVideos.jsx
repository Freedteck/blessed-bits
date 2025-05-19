import { FaHeart, FaCoins } from "react-icons/fa";
import styles from "./RelatedVideos.module.css";
import VideoCard from "../../shared/video-card/VideoCard";
import { Link } from "react-router-dom";

const RelatedVideos = ({ relatedVideos, creator }) => {
  const suggestedCreators = [
    {
      id: "mg",
      initials: "MG",
      name: "MindfulGuide",
      description: "Daily mindfulness tips",
    },
    {
      id: "sl",
      initials: "SL",
      name: "SpiritualLife",
      description: "Meditation guidance",
    },
  ];

  return (
    <div className={styles.relatedVideosColumn}>
      <h3>More from {creator}</h3>
      <div className={styles.relatedVideosList}>
        {relatedVideos.map((video) => (
          <Link to={`/app/video/${video.id.id}`} key={video.id.id}>
            <VideoCard
              videoId={video?.id.id}
              videoUrl={video?.video_url}
              thumbnail={video?.thumbnail_url}
              title={video?.title}
              creator={video?.creator}
              description={video?.description}
              likes={video?.likes}
              tags={video?.tags}
              compact
            />
          </Link>
        ))}
      </div>

      <div className={styles.suggestedCreators}>
        <h3>Suggested Creators</h3>
        <div className={styles.creatorList}>
          {suggestedCreators.map((creator) => (
            <div key={creator.id} className={styles.creatorItem}>
              <div className={styles.creatorAvatar}>{creator.initials}</div>
              <div>
                <h4>{creator.name}</h4>
                <p>{creator.description}</p>
              </div>
              <button className={styles.followButton}>Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedVideos;

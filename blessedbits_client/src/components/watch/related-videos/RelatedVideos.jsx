// src/components/watch/RelatedVideos.jsx
import { FaHeart, FaCoins } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./RelatedVideos.module.css";

const RelatedVideos = ({ currentVideoId, creatorId }) => {
  const navigate = useNavigate();

  // Mock related videos data
  const relatedVideos = [
    {
      id: "2",
      thumbnail:
        "https://images.unsplash.com/photo-1503764654157-72d97966e920?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:45",
      title: "Daily Scripture Reflection",
      creator: "FaithPath",
      likes: 89,
      earnings: 24,
    },
    {
      id: "3",
      thumbnail:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "1:00",
      title: "Christian Yoga Flow",
      creator: "SpiritualLife",
      likes: 156,
      earnings: 42,
    },
    {
      id: "4",
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:55",
      title: "Bible Study Tips",
      creator: "BibleScholar",
      likes: 78,
      earnings: 22,
    },
  ];

  // Mock suggested creators data
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
      <h3>More from {creatorId}</h3>
      <div className={styles.relatedVideosList}>
        {relatedVideos.map((video) => (
          <div
            key={video.id}
            className={styles.relatedVideoCard}
            onClick={() => navigate(`/watch/${video.id}`)}
          >
            <div className={styles.videoThumbnail}>
              <img src={video.thumbnail} alt={video.title} />
              <div className={styles.videoDuration}>{video.duration}</div>
            </div>
            <div className={styles.videoInfo}>
              <h4>{video.title}</h4>
              <div className={styles.videoStats}>
                <span>
                  <FaHeart /> {video.likes}
                </span>
                <span>
                  <FaCoins /> {video.earnings} $BLESS
                </span>
              </div>
            </div>
          </div>
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

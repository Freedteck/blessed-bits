import { useState, useEffect } from "react";
import {
  FaHeart,
  FaCoins,
  FaShareAlt,
  FaBookmark,
  FaEye,
  FaComments,
  FaArrowLeft,
  FaUsers,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./WatchPage.module.css";
import VideoPlayer from "../../components/watch/video-player/VideoPlayer";
import CreatorCard from "../../components/watch/creator-card/CreatorCard";
import CommentSection from "../../components/watch/comment-section/CommentSection";
import RelatedVideos from "../../components/watch/related-videos/RelatedVideos";
import TipModal from "../../components/watch/tip-modal/TipModal";

const WatchPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showTipModal, setShowTipModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch video data (in a real app, this would be an API call)
  useEffect(() => {
    // Mock data fetch
    const fetchVideoData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockVideoData = {
        id: videoId,
        title: "Evening Prayer Session",
        description:
          "Wind down your day with this peaceful prayer. Perfect for reflection before sleep. Remember to like if this blessed you!",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // In real app, this would be the actual video URL
        thumbnail:
          "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=675&q=80",
        duration: "0:52",
        views: 1245,
        uploadDate: "3 days ago",
        creator: {
          id: "prayerwarrior",
          name: "PrayerWarrior",
          initials: "PW",
          followers: "1.7K followers",
        },
        tags: ["prayer", "christian", "faith"],
        earnings: {
          tokens: 58,
          votes: 201,
        },
        likes: 245,
        isLiked: false,
      };

      setVideoData(mockVideoData);
      setLikeCount(mockVideoData.likes);
      setIsLiked(mockVideoData.isLiked);
    };

    fetchVideoData();
  }, [videoId]);

  // Mock comments data
  useEffect(() => {
    setComments([
      {
        id: 1,
        author: "MindfulGuide",
        initials: "MG",
        text: "This prayer really helped me find peace tonight. Thank you for sharing!",
        timestamp: "2 hours ago",
        likes: 12,
        isLiked: false,
      },
      {
        id: 2,
        author: "SpiritualLife",
        initials: "SL",
        text: "Beautiful words. I'll be sharing this with my prayer group.",
        timestamp: "5 hours ago",
        likes: 8,
        isLiked: false,
      },
    ]);
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: "You",
      initials: "YO",
      text: newComment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleCommentLike = (commentId) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      })
    );
  };

  if (!videoData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main className={styles.mainContent}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className={styles.videoColumn}>
        {/* Video Player */}
        <div className={styles.videoPlayerWrapper}>
          <VideoPlayer
            src={videoData.videoUrl}
            poster={videoData.thumbnail}
            title={videoData.title}
          />

          {/* Video Info */}
          <div className={styles.videoHeader}>
            <h1>{videoData.title}</h1>
            <div className={styles.videoMeta}>
              <span className={styles.views}>
                <FaEye /> {videoData.views.toLocaleString()} views
              </span>
              <span className={styles.uploadDate}>
                Uploaded {videoData.uploadDate}
              </span>
            </div>
          </div>

          {/* Video Actions */}
          <div className={styles.videoActions}>
            <button
              className={`${styles.actionBtn} ${styles.likeBtn} ${
                isLiked ? styles.active : ""
              }`}
              onClick={handleLike}
            >
              <FaHeart />
              <span>{likeCount.toLocaleString()}</span>
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => setShowTipModal(true)}
            >
              <FaCoins />
              <span>Tip Creator</span>
            </button>
            <button className={styles.actionBtn}>
              <FaShareAlt />
              <span>Share</span>
            </button>
            <button className={styles.actionBtn}>
              <FaBookmark />
              <span>Save</span>
            </button>
          </div>

          {/* Creator Info */}
          <CreatorCard
            creator={videoData.creator}
            isFollowing={false}
            onFollow={() => console.log("Followed")}
          />

          {/* Video Description */}
          <div className={styles.videoDescription}>
            <p>{videoData.description}</p>
            <div className={styles.videoTags}>
              {videoData.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Earnings Card */}
          <div className={styles.earningsCard}>
            <div className={styles.earningItem}>
              <FaCoins className={styles.earningIcon} />
              <div>
                <h4>{videoData.earnings.tokens} $BLESS</h4>
                <p>Earned from this video</p>
              </div>
            </div>
            <div className={styles.earningItem}>
              <FaUsers className={styles.earningIcon} />
              <div>
                <h4>{videoData.earnings.votes} votes</h4>
                <p>Community engagement</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            comments={comments}
            newComment={newComment}
            onCommentChange={(e) => setNewComment(e.target.value)}
            onCommentSubmit={handleCommentSubmit}
            onCommentLike={handleCommentLike}
          />
        </div>
      </div>

      {/* Related Videos Column */}
      <RelatedVideos
        currentVideoId={videoId}
        creatorId={videoData.creator.id}
      />
      {/* Tip Modal */}
      {showTipModal && (
        <TipModal
          creatorName={videoData.creator.name}
          onClose={() => setShowTipModal(false)}
          onTipSubmit={(amount) => {
            console.log(`Tipped ${amount} $BLESS`);
            setShowTipModal(false);
          }}
        />
      )}
    </main>
  );
};

export default WatchPage;

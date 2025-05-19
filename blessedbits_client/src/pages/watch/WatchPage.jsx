import { useState, useEffect } from "react";
import {
  FaHeart,
  FaCoins,
  FaShareAlt,
  FaBookmark,
  FaArrowLeft,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./WatchPage.module.css";
import VideoPlayer from "../../components/watch/video-player/VideoPlayer";
import CreatorCard from "../../components/watch/creator-card/CreatorCard";
import CommentSection from "../../components/watch/comment-section/CommentSection";
import RelatedVideos from "../../components/watch/related-videos/RelatedVideos";
import TipModal from "../../components/watch/tip-modal/TipModal";
import { useNetworkVariables } from "../../config/networkConfig";
import { useVideoData } from "../../hooks/useVideoData";
import { useUserData } from "../../hooks/useUserData";
import useCreateContent from "../../hooks/useCreateContent";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useVideoVotingData } from "../../hooks/useVideoVotingData";

const WatchPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [showTipModal, setShowTipModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { packageId, platformStateId, treasuryCapId } = useNetworkVariables(
    "packageId",
    "platformStateId",
    "treasuryCapId"
  );
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { video, isPending, refetch } = useVideoData(platformStateId, videoId);
  const { likes, userVote } = useVideoVotingData(
    platformStateId,
    videoId,
    account?.address
  );

  const { userProfile, videos } = useUserData(platformStateId, video?.creator);
  const { vote } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

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
    const voteValue = userVote === null ? true : false;

    vote(videoId, voteValue, treasuryCapId, () => {
      // This function will be called after the vote completes
      refetch();
      console.log("Vote registered and data refreshed");
    });
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

  if (isPending) {
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
            src={video?.video_url}
            poster={video?.thumbnail_url}
            title={video?.title}
          />

          {/* Video Info */}
          <div className={styles.videoHeader}>
            <h1>{video?.title}</h1>
            <div className={styles.videoMeta}>
              <span className={styles.uploadDate}>
                Uploaded {video?.created_at}
              </span>
            </div>
          </div>

          {/* Video Actions */}
          <div className={styles.videoActions}>
            <button
              className={`${styles.actionBtn} ${styles.likeBtn} ${
                userVote ? styles.active : ""
              }`}
              onClick={handleLike}
            >
              <FaHeart />
              <span>{likes.toLocaleString()}</span>
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
            creator={userProfile}
            isFollowing={false}
            onFollow={() => console.log("Followed")}
          />

          {/* Video Description */}
          <div className={styles.videoDescription}>
            <p>{video?.description}</p>
            <div className={styles.videoTags}>
              {video?.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
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
        relatedVideos={videos
          .filter((vid) => vid.id.id !== videoId)
          .slice(0, 5)}
        creator={userProfile?.username}
      />
      {/* Tip Modal */}
      {showTipModal && (
        <TipModal
          creatorName={video?.creator}
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

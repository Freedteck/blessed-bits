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
import { useSocialData } from "../../hooks/useSocialData";
import { formatDate } from "../../utils/formatDate";
import { useCreators } from "../../hooks/useCreators";

const WatchPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [showTipModal, setShowTipModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [suggestedCreators, setSuggestedCreators] = useState([]);
  const { packageId, platformStateId, treasuryCapId, badgeCollectionId } =
    useNetworkVariables(
      "packageId",
      "platformStateId",
      "treasuryCapId",
      "badgeCollectionId"
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
  const { isFollowing } = useSocialData(platformStateId, account?.address);

  const isFollowingUser = isFollowing(video?.creator);

  const { userProfile, videos } = useUserData(platformStateId, video?.creator);
  const { vote, followUser, sendReward } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  const {
    getSuggestedCreators,
    isPending: creatorsPending,
    refetch: refetchSuggestedCreators,
  } = useCreators(platformStateId);

  useEffect(() => {
    if (video && !creatorsPending) {
      setSuggestedCreators(getSuggestedCreators(video));
    }
  }, [video, creatorsPending, getSuggestedCreators]);

  const isOwner = video?.creator === account?.address;

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
      refetch();
    });
  };

  const handleFollow = () => {
    const followValue = isFollowingUser ? false : true;
    followUser(video?.creator, followValue, badgeCollectionId, () => refetch());
  };

  const handleFollowSuggested = (creatorAddress) => {
    const followValue = isFollowing(creatorAddress) ? false : true;
    followUser(creatorAddress, followValue, badgeCollectionId, () =>
      refetchSuggestedCreators()
    );
  };

  const handleTip = (amount) => {
    sendReward(
      video?.creator,
      amount,
      "Tip sent for great content!",
      treasuryCapId,
      () => {
        setShowTipModal(false);
        refetch();
      }
    );
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
                Uploaded {formatDate(video?.created_at)}
              </span>
            </div>
          </div>

          {/* Video Actions */}
          <div className={styles.videoActions}>
            <button
              className={`${styles.actionBtn} ${styles.likeBtn} ${
                userVote ? styles.active : ""
              }`}
              disabled={isOwner}
              onClick={handleLike}
            >
              <FaHeart />
              <span>{likes.toLocaleString()}</span>
            </button>
            <button
              className={styles.actionBtn}
              disabled={isOwner}
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
            isFollowing={isFollowingUser}
            onFollow={handleFollow}
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
        suggestedCreators={suggestedCreators}
        handleFollow={handleFollowSuggested}
      />
      {/* Tip Modal */}
      {showTipModal && (
        <TipModal
          creatorName={userProfile?.username}
          onClose={() => setShowTipModal(false)}
          onTipSubmit={handleTip}
        />
      )}
    </main>
  );
};

export default WatchPage;

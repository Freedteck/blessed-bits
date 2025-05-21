import { FaHeart, FaCoins } from "react-icons/fa";
import styles from "./RelatedVideos.module.css";
import VideoCard from "../../shared/video-card/VideoCard";
import { Link } from "react-router-dom";
import { formatCoin } from "../../../utils/formatCoin";
import { useCurrentAccount } from "@mysten/dapp-kit";

const RelatedVideos = ({
  relatedVideos,
  creator,
  suggestedCreators,
  handleFollow,
}) => {
  const account = useCurrentAccount();
  const isFollowingUser = (creator) =>
    creator.followers.includes(account?.address);

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
          {suggestedCreators?.map((creator) => (
            <div key={creator.id.id} className={styles.creatorItem}>
              <div className={styles.creatorAvatar}>
                {creator.username.slice(0, 2)}
              </div>
              <div>
                <h4>{creator.username}</h4>
                <p>{formatCoin(creator.followers.length)} Followers</p>
              </div>
              <button
                className={
                  isFollowingUser(creator)
                    ? styles.followingButton
                    : styles.followButton
                }
                onClick={() => handleFollow(creator.address)}
              >
                {isFollowingUser(creator) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedVideos;

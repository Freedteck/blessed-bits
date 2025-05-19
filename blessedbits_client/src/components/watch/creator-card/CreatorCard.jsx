import Button from "../../shared/button/Button";
import styles from "./CreatorCard.module.css";

const CreatorCard = ({ creator, isFollowing, onFollow }) => {
  return (
    <div className={styles.creatorCard}>
      <div className={styles.creatorInfo}>
        <div className={styles.creatorAvatar}>
          {creator?.username.slice(0, 2)}
        </div>
        <div>
          <h3>{creator?.username}</h3>
          <p>{creator?.followers.length} Followers</p>
        </div>
      </div>
      <Button variant={isFollowing ? "primary" : "outline"} onClick={onFollow}>
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default CreatorCard;

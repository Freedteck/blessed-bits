import Button from "../../shared/button/Button";
import styles from "./CreatorCard.module.css";

const CreatorCard = ({ creator, isFollowing, onFollow }) => {
  return (
    <div className={styles.creatorCard}>
      <div className={styles.creatorInfo}>
        <div className={styles.creatorAvatar}>{creator.initials}</div>
        <div>
          <h3>{creator.name}</h3>
          <p>{creator.followers}</p>
        </div>
      </div>
      <Button variant={isFollowing ? "primary" : "outline"} onClick={onFollow}>
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default CreatorCard;

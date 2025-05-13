import styles from "./CreatorCard.module.css";

const CreatorCard = ({ initials, name, description, followers, earnings }) => {
  return (
    <div className={styles.creatorCard}>
      <div className={styles.creatorAvatar}>{initials}</div>
      <h3>{name}</h3>
      <p className={styles.creatorDescription}>{description}</p>
      <div className={styles.creatorStats}>
        <span>{followers}</span>
        <span>{earnings}</span>
      </div>
    </div>
  );
};

export default CreatorCard;

import styles from "./BadgeCard.module.css";

const BadgeCard = ({
  title,
  description,
  icon,
  date,
  progress,
  isEarned,
  isRare,
}) => {
  return (
    <div
      className={`${styles.badgeCard} ${
        isEarned ? styles.earned : styles.locked
      } ${isRare ? styles.rare : ""}`}
    >
      <div
        className={`${styles.badgeIcon} ${!isEarned ? styles.lockedIcon : ""}`}
      >
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {date && <div className={styles.badgeDate}>Earned: {date}</div>}
      {progress && (
        <div className={styles.badgeProgress}>Progress: {progress}</div>
      )}
    </div>
  );
};

export default BadgeCard;

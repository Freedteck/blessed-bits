import * as FaIcons from "react-icons/fa";
import { formatBadgeDetails } from "../../../utils/formatBadgeDetails";
import styles from "./BadgeCard.module.css";

const BadgeCard = ({ userBadge, progress, isEarned, isRare }) => {
  const badge = formatBadgeDetails(userBadge);
  const IconComponent = FaIcons[`Fa${badge.iconName}`] || FaIcons.FaStar;

  return (
    <div
      className={`${styles.badgeCard} ${
        isEarned ? styles.earned : styles.locked
      } ${isRare ? styles.rare : ""}`}
    >
      <div
        className={`${styles.badgeIcon} ${!isEarned ? styles.lockedIcon : ""}`}
      >
        <IconComponent />
      </div>
      <h3>{badge.title}</h3>
      <p>{badge.description}</p>
      {badge.date && (
        <div className={styles.badgeDate}>Earned: {badge.date}</div>
      )}
      {progress && (
        <div className={styles.badgeProgress}>Progress: {progress}</div>
      )}
    </div>
  );
};

export default BadgeCard;

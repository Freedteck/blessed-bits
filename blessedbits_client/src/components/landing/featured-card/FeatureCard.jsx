import styles from "./FeatureCard.module.css";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className={styles.step}>
      <div className={styles.stepIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;

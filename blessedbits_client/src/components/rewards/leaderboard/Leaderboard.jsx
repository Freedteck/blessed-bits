import styles from "./Leaderboard.module.css";

const Leaderboard = ({ data }) => {
  return (
    <div className={styles.leaderboard}>
      {data.map((item) => (
        <div key={item.rank} className={styles.leaderboardItem}>
          <div className={styles.rank}>{item.rank}</div>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{item.initials}</div>
            <span className={styles.userName}>{item.name}</span>
          </div>
          <div className={styles.earnings}>
            {item.earnings.toLocaleString()} $BLESS
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;

import { useState } from "react";
import {
  FaTrophy,
  FaUpload,
  FaHeart,
  FaCoins,
  FaGem,
  FaPray,
  FaStar,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "./BadgesPage.module.css";
import BadgeCard from "../../components/badges/badge-card/BadgeCard";

const BadgesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Badge data
  const badges = [
    {
      id: 1,
      title: "First Upload",
      description: "Successfully posted your first video",
      icon: <FaUpload />,
      date: "Jan 15, 2025",
      category: "earned",
      progress: null,
      rare: false,
    },
    {
      id: 2,
      title: "100 Hearts",
      description: "Received 100+ likes on your content",
      icon: <FaHeart />,
      date: "Feb 3, 2025",
      category: "earned",
      progress: null,
      rare: false,
    },
    {
      id: 3,
      title: "1K $BLESS",
      description: "Earned 1,000 $BLESS tokens",
      icon: <FaCoins />,
      date: "Mar 10, 2025",
      category: "earned",
      progress: null,
      rare: false,
    },
    {
      id: 4,
      title: "Top Creator",
      description: "Rank in top 10 creators for a month",
      icon: <FaTrophy />,
      date: null,
      category: "locked",
      progress: "25/100 videos",
      rare: false,
    },
    {
      id: 5,
      title: "1K Followers",
      description: "Grow your audience to 1,000 followers",
      icon: <FaUsers />,
      date: null,
      category: "locked",
      progress: "1.2K/1K",
      rare: false,
    },
    {
      id: 6,
      title: "Golden Creator",
      description: "Earn 10K $BLESS in a month",
      icon: <FaGem />,
      date: null,
      category: "locked",
      progress: "4.8K/10K",
      rare: true,
    },
    {
      id: 7,
      title: "Faithful Creator",
      description: "Upload 30+ spiritual videos",
      icon: <FaPray />,
      date: "Apr 5, 2025",
      category: "earned",
      progress: null,
      rare: false,
    },
    {
      id: 8,
      title: "Community Star",
      description: "Get 500+ comments on your videos",
      icon: <FaStar />,
      date: null,
      category: "locked",
      progress: "210/500",
      rare: false,
    },
  ];

  // Filter badges based on active category
  const filteredBadges = badges.filter((badge) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "earned") return badge.category === "earned";
    if (activeCategory === "locked") return badge.category === "locked";
    if (activeCategory === "rare") return badge.rare;
    return true;
  });

  // Calculate badge statistics
  const totalBadges = badges.length;
  const earnedBadges = badges.filter((b) => b.category === "earned").length;
  const progressPercentage = Math.round((earnedBadges / totalBadges) * 100);

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Your Achievements</h2>
        <div className={styles.badgesSummary}>
          <span>
            {earnedBadges}/{totalBadges} Badges Unlocked
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className={styles.badgesCategories}>
        <button
          className={`${styles.category} ${
            activeCategory === "all" ? styles.active : ""
          }`}
          onClick={() => setActiveCategory("all")}
        >
          All Badges
        </button>
        <button
          className={`${styles.category} ${
            activeCategory === "earned" ? styles.active : ""
          }`}
          onClick={() => setActiveCategory("earned")}
        >
          Earned
        </button>
        <button
          className={`${styles.category} ${
            activeCategory === "locked" ? styles.active : ""
          }`}
          onClick={() => setActiveCategory("locked")}
        >
          Locked
        </button>
        <button
          className={`${styles.category} ${
            activeCategory === "rare" ? styles.active : ""
          }`}
          onClick={() => setActiveCategory("rare")}
        >
          Rare
        </button>
      </div>

      <div className={styles.badgesGrid}>
        {filteredBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            title={badge.title}
            description={badge.description}
            icon={badge.icon}
            date={badge.date}
            progress={badge.progress}
            isEarned={badge.category === "earned"}
            isRare={badge.rare}
          />
        ))}
      </div>

      <div className={styles.benefitsCard}>
        <h3>Why Earn Badges?</h3>
        <div className={styles.benefitsList}>
          <div className={styles.benefitItem}>
            <FaCheckCircle className={styles.benefitIcon} />
            <span>
              <strong>Exclusive Perks:</strong> Special profile frames & early
              access
            </span>
          </div>
          <div className={styles.benefitItem}>
            <FaCheckCircle className={styles.benefitIcon} />
            <span>
              <strong>Higher Earnings:</strong> +10% $BLESS rewards for badge
              holders
            </span>
          </div>
          <div className={styles.benefitItem}>
            <FaCheckCircle className={styles.benefitIcon} />
            <span>
              <strong>NFT Value:</strong> Trade rare badges on Sui NFT markets
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BadgesPage;

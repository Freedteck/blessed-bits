import { useState } from "react";
import {
  FaShareAlt,
  FaEdit,
  FaHeart,
  FaCoins,
  FaUpload,
  FaTrophy,
  FaGem,
} from "react-icons/fa";
import styles from "./ProfilePage.module.css";
import VideoCard from "../../components/shared/video-card/VideoCard";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(
    "Daily devotionals & prayers | Web3 believer | Sharing God's word"
  );

  // Mock user data
  const user = {
    name: "JohnDoe",
    initials: "JD",
    followers: "1.2K",
    videos: 56,
    earnings: "4.8K",
    bannerImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=200&q=80",
  };

  // Mock badges data
  const badges = [
    {
      icon: <FaUpload />,
      name: "First Upload",
      earned: true,
      date: "Jan 15, 2025",
    },
    { icon: <FaHeart />, name: "100 Likes", earned: true, date: "Feb 3, 2025" },
    {
      icon: <FaCoins />,
      name: "1K $BLESS",
      earned: true,
      date: "Mar 10, 2025",
    },
    {
      icon: <FaTrophy />,
      name: "Top Creator",
      earned: false,
      progress: "25/100 videos",
    },
    {
      icon: <FaGem />,
      name: "Golden Creator",
      earned: false,
      progress: "4.8K/10K",
    },
  ];

  // Mock videos data
  const videos = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:52",
      title: "Evening Prayer Session",
      likes: 201,
      earnings: "58",
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:48",
      title: "God in Nature",
      likes: 112,
      earnings: "31",
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:58",
      title: "Morning Meditation",
      likes: 124,
      earnings: "32",
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:55",
      title: "Bible Study Tips",
      likes: 78,
      earnings: "22",
    },
    {
      id: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1503764654157-72d97966e920?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:45",
      title: "Scripture Reflection",
      likes: 89,
      earnings: "24",
    },
    {
      id: 6,
      thumbnail:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "1:00",
      title: "Christian Yoga Flow",
      likes: 156,
      earnings: "42",
    },
  ];

  return (
    <main className={styles.mainContent}>
      {/* Profile Banner */}
      <div className={styles.profileBanner}>
        <img
          src={user.bannerImage}
          alt="Banner"
          className={styles.bannerImage}
        />
        <div className={styles.profileOverlay}>
          <div className={styles.profileAvatar}>{user.initials}</div>
          <div className={styles.profileActions}>
            <button className={styles.actionBtn}>
              <FaShareAlt /> Share
            </button>
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(!isEditing)}
            >
              <FaEdit /> {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className={styles.profileInfo}>
        <h1>{user.name}</h1>

        {isEditing ? (
          <textarea
            className={styles.bioInput}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
          />
        ) : (
          <p className={styles.profileBio}>{bio}</p>
        )}

        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{user.followers}</div>
            <div className={styles.statLabel}>Followers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{user.videos}</div>
            <div className={styles.statLabel}>Videos</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{user.earnings} $BLESS</div>
            <div className={styles.statLabel}>Earnings</div>
          </div>
        </div>

        {/* Badges Section */}
        <div className={styles.badgesSection}>
          <h3>Top Badges</h3>
          <div className={styles.badgesScroll}>
            {badges.slice(0, 4).map((badge, index) => (
              <div
                key={index}
                className={`${styles.badgeIcon} ${
                  !badge.earned ? styles.locked : ""
                }`}
              >
                {badge.icon}
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className={styles.videosSection}>
        <h2>Your Content</h2>
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              thumbnail={video.thumbnail}
              duration={video.duration}
              title={video.title}
              likes={video.likes}
              earnings={video.earnings}
              creatorInitials={user.initials}
              videoId={video.id}
              creatorName={user.name}
              tags={["devotional", "prayer", "worship"]}
              description="A short description of the video goes here."
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

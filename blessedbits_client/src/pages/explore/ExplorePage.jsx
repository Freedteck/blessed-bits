// src/pages/ExplorePage.jsx
import { useState } from "react";
import {
  FaFire,
  FaClock,
  FaSearch,
  FaHeart,
  FaCoins,
  FaHashtag,
} from "react-icons/fa";
import styles from "./ExplorePage.module.css";
import VideoCard from "../../components/shared/video-card/VideoCard";

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Sample categories
  const categories = [
    { id: "all", name: "All" },
    { id: "prayer", name: "Prayer" },
    { id: "meditation", name: "Meditation" },
    { id: "bible", name: "Bible Study" },
    { id: "worship", name: "Worship" },
    { id: "testimony", name: "Testimony" },
    { id: "teaching", name: "Teaching" },
  ];

  // Sample videos data
  const allVideos = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:58",
      title: "Morning Meditation Routine",
      creatorInitials: "MG",
      creatorName: "MindfulGuide",
      description: "Start your day with this 5-minute grounding meditation",
      likes: 124,
      earnings: "32",
      tags: ["meditation", "morning"],
      category: "meditation",
      isTrending: true,
    },
    // Add 11 more video objects following the same structure
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1503764654157-72d97966e920?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:45",
      title: "Daily Scripture Reflection",
      creatorInitials: "FP",
      creatorName: "FaithPath",
      description: "Today's reading from John 3:16 with commentary",
      likes: 89,
      earnings: "24",
      tags: ["bible", "scripture"],
      category: "bible",
      isTrending: false,
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "1:00",
      title: "Christian Yoga Flow",
      creatorInitials: "SL",
      creatorName: "SpiritualLife",
      description: "Combine movement and prayer in this gentle flow",
      likes: 156,
      earnings: "42",
      tags: ["yoga", "prayer"],
      category: "prayer",
      isTrending: true,
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:52",
      title: "Evening Prayer Session",
      creatorInitials: "PW",
      creatorName: "PrayerWarrior",
      description: "Wind down your day with this peaceful prayer",
      likes: 201,
      earnings: "58",
      tags: ["prayer", "evening"],
      category: "prayer",
      isTrending: true,
    },
    {
      id: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:48",
      title: "God in Nature",
      creatorInitials: "CG",
      creatorName: "CreationGlory",
      description: "Seeing the divine in the natural world",
      likes: 112,
      earnings: "31",
      tags: ["nature", "meditation"],
      category: "meditation",
      isTrending: false,
    },
    {
      id: 6,
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:55",
      title: "Bible Study Tips",
      creatorInitials: "BS",
      creatorName: "BibleScholar",
      description: "5 methods for deeper scripture understanding",
      likes: 78,
      earnings: "22",
      tags: ["bible", "study"],
      category: "bible",
      isTrending: false,
    },
    {
      id: 7,
      thumbnail:
        "https://images.unsplash.com/photo-1503764654157-72d97966e920?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:45",
      title: "Psalm 23 Meditation",
      creatorInitials: "SM",
      creatorName: "ScriptureMeditations",
      description: "Reflect on the comforting words of Psalm 23",
      likes: 95,
      earnings: "28",
      tags: ["bible", "meditation"],
      category: "meditation",
      isTrending: true,
    },
    {
      id: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:58",
      title: "Breath Prayer Technique",
      creatorInitials: "PP",
      creatorName: "PrayerPractices",
      description: "Ancient prayer method for modern believers",
      likes: 132,
      earnings: "38",
      tags: ["prayer", "technique"],
      category: "prayer",
      isTrending: false,
    },
    {
      id: 9,
      thumbnail:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "1:00",
      title: "Worship Movement Flow",
      creatorInitials: "WM",
      creatorName: "WorshipMoves",
      description: "Express your worship through movement",
      likes: 87,
      earnings: "25",
      tags: ["worship", "movement"],
      category: "worship",
      isTrending: false,
    },
    {
      id: 10,
      thumbnail:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:52",
      title: "Healing Testimony",
      creatorInitials: "HT",
      creatorName: "HealingTestimonies",
      description: "How God healed my chronic illness",
      likes: 210,
      earnings: "62",
      tags: ["testimony", "healing"],
      category: "testimony",
      isTrending: true,
    },
    {
      id: 11,
      thumbnail:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:48",
      title: "The Prodigal Son Explained",
      creatorInitials: "BT",
      creatorName: "BibleTeachers",
      description: "Deep dive into this famous parable",
      likes: 76,
      earnings: "21",
      tags: ["bible", "teaching"],
      category: "teaching",
      isTrending: false,
    },
    {
      id: 12,
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      duration: "0:55",
      title: "Praying the Scriptures",
      creatorInitials: "SP",
      creatorName: "ScripturePrayers",
      description: "How to use Bible verses in your prayers",
      likes: 143,
      earnings: "41",
      tags: ["prayer", "bible"],
      category: "prayer",
      isTrending: true,
    },
  ];

  // Sample creators data
  const recommendedCreators = [
    {
      id: "mg",
      initials: "MG",
      name: "MindfulGuide",
      description: "Daily mindfulness tips",
      followers: "1.2K",
      isFollowing: false,
    },
    {
      id: "sl",
      initials: "SL",
      name: "SpiritualLife",
      description: "Meditation guidance",
      followers: "2.4K",
      isFollowing: true,
    },
    {
      id: "pw",
      initials: "PW",
      name: "PrayerWarrior",
      description: "Daily prayer sessions",
      followers: "1.7K",
      isFollowing: false,
    },
  ];

  // Filter videos based on active tab and category
  const filteredVideos = allVideos.filter((video) => {
    const matchesCategory =
      activeCategory === "all" || video.category === activeCategory;
    const matchesTab = activeTab === "trending" ? video.isTrending : true;
    const matchesSearch =
      searchQuery === "" ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesTab && matchesSearch;
  });

  // Group videos by category for discovery section
  const videosByCategory = categories
    .slice(1)
    .map((category) => ({
      ...category,
      videos: allVideos.filter((v) => v.category === category.id).slice(0, 4),
    }))
    .filter((category) => category.videos.length > 0);

  return (
    <main className={styles.mainContent}>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search videos, creators, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "trending" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("trending")}
        >
          <FaFire /> Trending
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "latest" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("latest")}
        >
          <FaClock /> Latest
        </button>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.category} ${
              activeCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {activeTab === "trending" && searchQuery === "" && (
        <section className={styles.discoverySection}>
          <h2>Discover Content</h2>
          <div className={styles.categoryGrid}>
            {videosByCategory.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <h3>
                  <FaHashtag /> {category.name}
                </h3>
                <div className={styles.categoryVideos}>
                  {category.videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      thumbnail={video.thumbnail}
                      duration={video.duration}
                      title={video.title}
                      creatorInitials={video.creatorInitials}
                      creatorName={video.creatorName}
                      description={video.description}
                      likes={video.likes}
                      earnings={video.earnings}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.videoSection}>
        <h2>{activeTab === "trending" ? "Trending Now" : "Latest Uploads"}</h2>
        {filteredVideos.length > 0 ? (
          <div className={styles.videoGrid}>
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                thumbnail={video.thumbnail}
                duration={video.duration}
                title={video.title}
                creatorInitials={video.creatorInitials}
                creatorName={video.creatorName}
                description={video.description}
                likes={video.likes}
                earnings={video.earnings}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No videos found</h3>
            <p>Try a different search or category</p>
          </div>
        )}
      </section>

      <section className={styles.creatorsSection}>
        <h2>Recommended Creators</h2>
        <div className={styles.creatorsGrid}>
          {recommendedCreators.map((creator) => (
            <div key={creator.id} className={styles.creatorCard}>
              <div className={styles.creatorInfo}>
                <div className={styles.creatorAvatar}>{creator.initials}</div>
                <div>
                  <h3>{creator.name}</h3>
                  <p>{creator.description}</p>
                  <span className={styles.followers}>
                    {creator.followers} followers
                  </span>
                </div>
              </div>
              <button
                className={`${styles.followButton} ${
                  creator.isFollowing ? styles.following : ""
                }`}
              >
                {creator.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ExplorePage;

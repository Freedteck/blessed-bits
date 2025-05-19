import { useState } from "react";
import { FaFire, FaClock, FaSearch, FaHashtag } from "react-icons/fa";
import styles from "./ExplorePage.module.css";
import VideoCard from "../../components/shared/video-card/VideoCard";
import { Link } from "react-router-dom";
import { useVideoData } from "../../hooks/useVideoData";
import { useNetworkVariable } from "../../config/networkConfig";
import Loading from "../../components/shared/loading/Loading";

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const platformStateId = useNetworkVariable("platformStateId");

  const categories = [
    { id: "All", name: "All" },
    { id: "Inspiration", name: "Daily Inspiration" },
    { id: "Scripture", name: "Scripture Nuggets" },
    { id: "Prayer", name: "Prayers & Declarations" },
    { id: "Testimony", name: "Life Testimonies" },
    { id: "Wisdom", name: "Wisdom Shorts" },
    { id: "Music", name: "Spiritual Music & Chants" },
  ];

  const { allVideos, isPending } = useVideoData(platformStateId);

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

  const filteredVideos = allVideos
    .filter((video) => {
      const matchesCategory =
        activeCategory.toLowerCase() === "all" ||
        video.tags?.some(
          (tag) => tag.toLowerCase() === activeCategory.toLowerCase()
        );

      const matchesTab =
        activeTab === "trending" ? Number(video.likes) > 0 : true;

      const matchesSearch =
        searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.creator &&
          video.creator.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (video.tags &&
          video.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return matchesCategory && matchesTab && matchesSearch;
    })
    .reverse();

  const videosByCategory = categories
    .slice(1)
    .map((category) => ({
      ...category,
      videos: allVideos
        .reverse()
        .filter((v) =>
          v.tags?.some((tag) => tag.toLowerCase() === category.id.toLowerCase())
        )
        .slice(0, 4),
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

      {isPending ? (
        <Loading />
      ) : (
        <>
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
                        <Link
                          to={`/app/video/${video.id.id}`}
                          key={video.id.id}
                        >
                          <VideoCard
                            thumbnail={video.thumbnail_url}
                            videoUrl={video.video_url}
                            title={video.title}
                            creator={video.creator}
                            description={video.description}
                            likes={video.likes}
                            compact
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.videoSection}>
            <h2>
              {activeTab === "trending" ? "Trending Now" : "Latest Uploads"}
            </h2>
            {filteredVideos.length > 0 ? (
              <div className={styles.videoGrid}>
                {filteredVideos.map((video) => (
                  <Link to={`/app/video/${video.id.id}`} key={video.id.id}>
                    <VideoCard
                      thumbnail={video.thumbnail_url}
                      videoUrl={video.video_url}
                      title={video.title}
                      creator={video.creator}
                      description={video.description}
                      likes={video.likes}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h3>No videos found</h3>
                <p>Try a different search or category</p>
              </div>
            )}
          </section>
        </>
      )}

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

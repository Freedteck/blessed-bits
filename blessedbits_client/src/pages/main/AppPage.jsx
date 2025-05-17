import { useState } from "react";
import VideoCard from "../../components/shared/video-card/VideoCard";
import SearchBar from "../../components/shared/searchbar/SearchBar";
import styles from "./AppPage.module.css";
import { Link } from "react-router-dom";

const AppPage = () => {
  // Sample video data
  const allVideos = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: "0:58",
      title: "Morning Meditation Routine",
      creatorInitials: "MG",
      creatorName: "MindfulGuide",
      description: "Start your day with this 5-minute grounding meditation",
      likes: 124,
      earnings: "32",
      tags: ["meditation", "morning", "mindfulness"],
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80", // Fixed thumbnail
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration: "0:45",
      title: "Daily Scripture Reflection",
      creatorInitials: "FP",
      creatorName: "FaithPath",
      description: "Today's reading from John 3:16 with commentary",
      likes: 89,
      earnings: "24",
      tags: ["bible", "scripture", "christian"],
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      duration: "1:00",
      title: "Christian Yoga Flow",
      creatorInitials: "SL",
      creatorName: "SpiritualLife",
      description: "Combine movement and prayer in this gentle flow",
      likes: 156,
      earnings: "42",
      tags: ["yoga", "prayer", "movement"],
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      duration: "0:52",
      title: "Evening Prayer Session",
      creatorInitials: "PW",
      creatorName: "PrayerWarrior",
      description: "Wind down your day with this peaceful prayer",
      likes: 201,
      earnings: "58",
      tags: ["prayer", "evening", "peace"],
    },
    {
      id: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      duration: "0:48",
      title: "God in Nature",
      creatorInitials: "CG",
      creatorName: "CreationGlory",
      description: "Seeing the divine in the natural world",
      likes: 112,
      earnings: "31",
      tags: ["nature", "creation", "meditation"],
    },
    {
      id: 6,
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      duration: "0:55",
      title: "Bible Study Tips",
      creatorInitials: "BS",
      creatorName: "BibleScholar",
      description: "5 methods for deeper scripture understanding",
      likes: 78,
      earnings: "22",
      tags: ["bible", "study", "learning"],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState(allVideos);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setVideos(allVideos);
      return;
    }

    const filtered = allVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.creatorName.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );
    setVideos(filtered);
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Today's Inspiration</h2>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search videos, creators, or tags..."
        />
      </header>

      {videos.length > 0 ? (
        <div className={styles.videoFeed}>
          {videos.map((video) => (
            <Link to={`/app/video/${video.id}`} key={video.id}>
              <VideoCard
                key={video.id}
                videoId={video.id}
                videoUrl={video.videoUrl}
                thumbnail={video.thumbnail}
                duration={video.duration}
                title={video.title}
                creatorInitials={video.creatorInitials}
                creatorName={video.creatorName}
                description={video.description}
                likes={video.likes}
                earnings={video.earnings}
                tags={video.tags}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h3>No videos found for "{searchQuery}"</h3>
          <p>Try a different search term</p>
        </div>
      )}
    </main>
  );
};

export default AppPage;

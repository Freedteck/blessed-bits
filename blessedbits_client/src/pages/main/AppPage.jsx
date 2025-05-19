import { useState } from "react";
import VideoCard from "../../components/shared/video-card/VideoCard";
import SearchBar from "../../components/shared/searchbar/SearchBar";
import styles from "./AppPage.module.css";
import { Link } from "react-router-dom";
import { useNetworkVariables } from "../../config/networkConfig";
import Loading from "../../components/shared/loading/Loading";
import { useVideoData } from "../../hooks/useVideoData";

const AppPage = () => {
  const { platformStateId } = useNetworkVariables(
    "packageId",
    "platformStateId"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);

  const { allVideos, isPending } = useVideoData(platformStateId);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setVideos(allVideos);
      return;
    }

    const filtered = allVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.creatorName?.toLowerCase().includes(query.toLowerCase()) ||
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

      {isPending ? (
        <Loading />
      ) : videos.length > 0 ? (
        <div className={styles.videoFeed}>
          {videos
            .map((video) => (
              <Link to={`/app/video/${video.id.id}`} key={video.id.id}>
                <VideoCard
                  videoId={video.id.id}
                  videoUrl={video.video_url}
                  thumbnail={video.thumbnail_url}
                  title={video.title}
                  creator={video.creator}
                  description={video.description}
                  likes={video.likes}
                  tags={video.tags}
                />
              </Link>
            ))
            .reverse()}
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

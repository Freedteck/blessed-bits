import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const useVideoData = (platformStateId, videoId = null) => {
  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);

  const {
    data: platformState,
    refetch,
    isPending,
  } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId }
  );

  useEffect(() => {
    if (platformState?.data?.content?.fields?.videos?.fields?.contents) {
      const videoEntries =
        platformState.data.content.fields.videos.fields.contents;
      const videosList = videoEntries.map((entry) => ({
        id: entry.fields.key,
        ...entry.fields.value.fields,
      }));

      setAllVideos(videosList);

      if (videoId) {
        const foundVideo = videosList.find((v) => v.id.id === videoId);
        setVideo(foundVideo);

        if (foundVideo) {
          const related = videosList.filter(
            (v) =>
              v.id.id !== videoId &&
              (v.creator === foundVideo.creator ||
                v.tags.some((tag) => foundVideo.tags.includes(tag)))
          );
          setRelatedVideos(related.slice(0, 5));
        }
      }
    }
  }, [platformState, videoId]);

  return {
    video,
    allVideos,
    relatedVideos,
    isPending,
    refetch,
  };
};

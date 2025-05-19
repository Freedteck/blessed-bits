import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

const useVideoList = (platformStateId) => {
  const [videos, setVideos] = useState([]);

  // Fetch the platform state object
  const {
    data: platformState,
    refetch,
    isPending,
  } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!platformStateId,
    }
  );

  // Process the platform state to extract videos
  useEffect(() => {
    if (platformState?.data?.content?.fields?.videos?.fields?.contents) {
      const videoEntries =
        platformState.data.content.fields.videos.fields.contents;
      const videoList = videoEntries.map((entry) => ({
        id: entry.fields.key,
        ...entry.fields.value.fields,
      }));
      setVideos(videoList);
    }
  }, [platformState]);

  return { videos, isPending, refetch };
};

export default useVideoList;

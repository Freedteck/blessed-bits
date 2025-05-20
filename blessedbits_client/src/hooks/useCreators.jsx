import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState } from "react";

export const useCreators = (platformStateId) => {
  const [creators, setCreators] = useState([]);
  const [suggestedCreators, setSuggestedCreators] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const { data: platformState, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId }
  );

  useEffect(() => {
    if (platformState?.data?.content?.fields) {
      setIsPending(true);

      // Extract all creators from videos
      const videoCreators =
        platformState.data.content.fields.videos.fields.contents
          .map((entry) => entry.fields.value.fields.creator)
          .filter((creator, index, self) => self.indexOf(creator) === index); // Unique creators

      // Get creator profiles
      const creatorProfiles =
        platformState.data.content.fields.user_profiles.fields.contents
          .filter((entry) => videoCreators.includes(entry.fields.key))
          .map((entry) => ({
            address: entry.fields.key,
            ...entry.fields.value.fields,
          }));

      setCreators(creatorProfiles);
      setIsPending(false);
    }
  }, [platformState]);

  // Function to get suggested creators (call this when you have a video context)
  const getSuggestedCreators = useCallback(
    (currentVideo) => {
      if (!platformState?.data?.content?.fields || !currentVideo) return;

      const allVideos =
        platformState.data.content.fields.videos.fields.contents.map(
          (entry) => entry.fields.value.fields
        );

      // 1. Find creators with similar tags
      const similarCreators = allVideos
        .filter(
          (video) =>
            video.id.id !== currentVideo.id.id && // Exclude current video
            video.tags.some((tag) => {
              const tagLower = tag.toLowerCase();
              return (
                currentVideo.tags.includes(tagLower) ||
                currentVideo.tags.some((t) => t.toLowerCase() === tagLower)
              );
            }) // Shared tags
        )
        .map((video) => video.creator);

      // 2. Find popular creators (most videos)
      const creatorVideoCounts = allVideos.reduce((acc, video) => {
        acc[video.creator] = (acc[video.creator] || 0) + 1;
        return acc;
      }, {});

      // Combine and dedupe suggestions
      const suggestions = [
        ...new Set([
          ...similarCreators,
          ...Object.entries(creatorVideoCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([creator]) => creator),
        ]),
      ].filter((creator) => creator !== currentVideo.creator);

      // Get full profiles for suggestions
      const suggestedProfiles = creators.filter((c) =>
        suggestions.includes(c.address)
      );
      setSuggestedCreators(suggestedProfiles);
      return suggestedProfiles;
    },
    [platformState, creators]
  );

  return {
    creators,
    suggestedCreators,
    isPending,
    refetch,
    getSuggestedCreators, // Call this when you have video context
  };
};

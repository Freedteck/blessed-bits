import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const useUserData = (platformStateId, userAddress) => {
  const [userProfile, setUserProfile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [videos, setVideos] = useState([]);

  // Fetch platform state
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

  // Process data when platform state loads
  useEffect(() => {
    if (platformState?.data?.content?.fields) {
      const { user_profiles, videos } = platformState.data.content.fields;

      // Get user profile
      const profileEntry = user_profiles.fields.contents.find(
        (entry) => entry.fields.key === userAddress
      );
      if (profileEntry) {
        const profile = profileEntry.fields.value.fields;
        setUserProfile(profile);
        setFollowers(profile.followers || []);
        setFollowing(profile.following || []);
      }

      // Get user's videos
      const userVideos = videos.fields.contents
        .filter((entry) => entry.fields.value.fields.creator === userAddress)
        .map((entry) => ({
          id: entry.fields.key,
          ...entry.fields.value.fields,
        }));
      setVideos(userVideos);
    }
  }, [platformState, userAddress]);

  return {
    userProfile,
    followers,
    following,
    videos,
    isPending,
    refetch,
  };
};

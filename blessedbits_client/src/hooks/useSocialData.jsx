import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const useSocialData = (platformStateId, userAddress) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowingMap, setIsFollowingMap] = useState({});

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
    { enabled: !!platformStateId && !!userAddress }
  );

  useEffect(() => {
    if (platformState?.data?.content?.fields?.user_profiles?.fields?.contents) {
      const userProfiles =
        platformState.data.content.fields.user_profiles.fields.contents;

      // Find the current user's profile
      const currentUser = userProfiles.find(
        (entry) => entry.fields.key === userAddress
      );

      if (currentUser) {
        const profile = currentUser.fields.value.fields;
        setFollowers(profile.followers || []);
        setFollowing(profile.following || []);

        // Create a map of who the user is following
        const followingMap = {};
        profile.following.forEach((address) => {
          followingMap[address] = true;
        });
        setIsFollowingMap(followingMap);
      }
    }
  }, [platformState, userAddress]);

  // Helper function to check if following specific address
  const isFollowing = (address) => isFollowingMap[address] || false;

  return {
    followers,
    following,
    isFollowing,
    isPending,
    refetch,
  };
};

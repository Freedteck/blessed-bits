import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const useBadgeData = (badgeCollectionId, userAddress = null) => {
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [hasBadge, setHasBadge] = useState({});

  const {
    data: badgeCollection,
    refetch,
    isPending,
  } = useSuiClientQuery(
    "getObject",
    {
      id: badgeCollectionId,
      options: { showContent: true },
    },
    { enabled: !!badgeCollectionId }
  );

  useEffect(() => {
    if (badgeCollection?.data?.content?.fields?.badges?.fields?.contents) {
      const badgesList =
        badgeCollection.data.content.fields.badges.fields.contents.map(
          (entry) => ({
            id: entry.fields.key,
            ...entry.fields.value.fields,
          })
        );

      setAllBadges(badgesList);

      if (userAddress) {
        const userBadgesList = badgesList.filter(
          (badge) => badge.awarded_to === userAddress
        );
        setUserBadges(userBadgesList);

        // Create a map of badge types the user has
        const badgeMap = {};
        userBadgesList.forEach((badge) => {
          badgeMap[badge.badge_type] = true;
        });
        setHasBadge(badgeMap);
      }
    }
  }, [badgeCollection, userAddress]);

  return {
    allBadges,
    userBadges,
    hasBadge,
    isPending,
    refetch,
  };
};

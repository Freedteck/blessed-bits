import { formatDate } from "./formatDate";

export const formatBadgeDetails = (badge) => {
  const { badge_type, description, awarded_at } = badge || {};

  // Default structure
  const defaultBadge = {
    title: badge_type,
    description,
    iconName: "Star",
    date: formatDate(awarded_at),
  };

  const badgeMap = {
    FirstUpload: {
      title: "First Upload",
      iconName: "Upload",
    },
    TopCreator: {
      title: "Top Creator",
      iconName: "Trophy",
    },
    Consistency: {
      title: "Consistent Creator",
      iconName: "PrayingHands",
    },
    FaithfulCreator: {
      title: "Faithful Creator",
      iconName: "Pray",
    },
    BlessedCreator: {
      title: "1K $BLESS",
      iconName: "Coins",
    },
    HeartfeltCreator: {
      title: "100 Hearts",
      iconName: "Heart",
    },
    ThousandFollowers: {
      title: "1K Followers",
      description: "Grow your audience to 1,000 followers",
      iconName: "Users",
    },
    GoldenCreator: {
      title: "Golden Creator",
      description: "Earn 10K $BLESS in a month",
      iconName: "Gem",
    },
    CommunityStar: {
      title: "Community Star",
      description: "Get 500+ comments on your videos",
      iconName: "Star",
    },
  };

  return {
    ...defaultBadge,
    ...(badgeMap[badge_type] || {}),
    description: description || defaultBadge.description,
  };
};

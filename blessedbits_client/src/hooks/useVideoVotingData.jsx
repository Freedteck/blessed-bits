import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const useVideoVotingData = (
  platformStateId,
  videoId,
  userAddress = null
) => {
  const [voters, setVoters] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState(null); // null = no vote, true = like, false = dislike
  const [totalRewards, setTotalRewards] = useState(0);
  const [isPending, setIsPending] = useState(true);

  const { data: platformState, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId && !!videoId }
  );

  useEffect(() => {
    if (platformState?.data?.content?.fields?.videos?.fields?.contents) {
      setIsPending(true);

      const videoEntry =
        platformState.data.content.fields.videos.fields.contents.find(
          (entry) => entry.fields.key === videoId
        );

      if (videoEntry) {
        const videoData = videoEntry.fields.value.fields;

        // Extract voters data
        const votersList = videoData.voters.fields.contents.map((voter) => ({
          address: voter.fields.key,
          votedFor: voter.fields.value, // true = like, false = dislike
        }));

        setVoters(votersList);
        setLikes(videoData.likes);
        setDislikes(videoData.dislikes);
        setTotalRewards(videoData.total_rewards);

        // Check if specific user has voted
        if (userAddress) {
          const userVoteEntry = votersList.find(
            (voter) => voter.address === userAddress
          );
          setUserVote(userVoteEntry ? userVoteEntry.votedFor : null);
        }
      }

      setIsPending(false);
    }
  }, [platformState, videoId, userAddress]);

  return {
    voters, // Array of { address, votedFor }
    likes, // Total like count
    dislikes, // Total dislike count
    totalRewards, // Total rewards distributed
    userVote, // null | true (like) | false (dislike)
    isPending,
    refetch,

    // Helper functions
    hasUserVoted: () => userVote !== null,
    getUserVoteType: () => userVote, // returns true (like) / false (dislike) / null (no vote)
    getVoterCount: () => voters.length,
    getLikePercentage: () => {
      const totalVotes = likes + dislikes;
      return totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 0;
    },
  };
};

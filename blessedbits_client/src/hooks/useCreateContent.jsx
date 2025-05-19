import { Transaction } from "@mysten/sui/transactions";
import useSubmitTransaction from "./useSubmitTransaction";
import { useGetCoin } from "./useVoteDebug";

const useCreateContent = (
  packageId,
  platformStateId,
  suiClient,
  signAndExecute
) => {
  const { executeTransaction } = useSubmitTransaction(
    suiClient,
    signAndExecute
  );
  const { getBlessedCoin } = useGetCoin(packageId);

  const uploadVideo = async (
    videoUrl,
    thumbnail_url,
    badgeCollectionId,
    title,
    description,
    tags,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(videoUrl),
        tx.pure.string(thumbnail_url),
        tx.object(badgeCollectionId),
        tx.pure.string(title),
        tx.pure.string(description),
        tx.pure.vector("string", tags),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::upload_video`,
    });

    return executeTransaction(tx, {
      successMessage: "Video uploaded successfully!",
      errorMessage: "Error uploading video. Please try again.",
      loadingMessage: "Uploading video...",
      onSuccess,
    });
  };

  const deleteVideo = async (videoId, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(platformStateId), tx.object(videoId)],
      target: `${packageId}::blessedbits::delete_video`,
    });

    return executeTransaction(tx, {
      successMessage: "Video deleted successfully!",
      errorMessage: "Error deleting video. Please try again.",
      loadingMessage: "Deleting video...",
      onSuccess,
    });
  };

  const refreshDailyPool = async (onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(platformStateId), tx.object("0x6")],
      target: `${packageId}::blessedbits::refresh_daily_pool`,
    });

    return executeTransaction(tx, {
      successMessage: "Daily pool refreshed successfully!",
      errorMessage: "Error refreshing daily pool. Please try again.",
      loadingMessage: "Refreshing daily pool...",
      onSuccess,
    });
  };

  const registerUser = async (username, bio, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(username),
        tx.object("0x6"),
        tx.pure.string(bio),
      ],
      target: `${packageId}::blessedbits::register_user`,
    });

    return executeTransaction(tx, {
      successMessage: "User registered successfully!",
      errorMessage: "Error registering user. Please try again.",
      loadingMessage: "Registering user...",
      onSuccess,
    });
  };

  const updateProfile = async (newUserName, newBio, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(newUserName),
        tx.pure.string(newBio),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::update_profile`,
    });

    return executeTransaction(tx, {
      successMessage: "Profile updated successfully!",
      errorMessage: "Error updating profile. Please try again.",
      loadingMessage: "Updating profile...",
      onSuccess,
    });
  };

  const updateUsername = async (newUserName, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(newUserName),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::update_username`,
    });

    return executeTransaction(tx, {
      successMessage: "Username updated successfully!",
      errorMessage: "Error updating username. Please try again.",
      loadingMessage: "Updating username...",
      onSuccess,
    });
  };

  const updateBio = async (newBio, onSuccess) => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(newBio),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::update_bio`,
    });
    return executeTransaction(tx, {
      successMessage: "Bio updated successfully!",
      errorMessage: "Error updating bio. Please try again.",
      loadingMessage: "Updating bio...",
      onSuccess,
    });
  };

  const vote = async (videoId, isLike, treasuryId, onSuccess) => {
    const tx = new Transaction();
    const coinObjectId = await getBlessedCoin();
    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.id(videoId),
        tx.pure.bool(isLike),
        tx.object(coinObjectId),
        tx.object(treasuryId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::vote`,
    });

    return executeTransaction(tx, {
      successMessage: "Vote submitted successfully!",
      errorMessage: "Error submitting vote. Please try again.",
      loadingMessage: "Submitting vote...",
      onSuccess,
    });
  };

  const sendReward = async (
    recipient,
    amount,
    message,
    treasuryId,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.address(recipient),
        tx.pure.u64(amount),
        tx.pure.string(message),
        tx.object(treasuryId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::send_tip`,
    });

    return executeTransaction(tx, {
      successMessage: "Reward sent successfully!",
      errorMessage: "Error sending reward. Please try again.",
      loadingMessage: "Sending reward...",
      onSuccess,
    });
  };

  const followUser = async (
    userToFollow,
    isFollow,
    badgeCollectionId,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.address(userToFollow),
        tx.pure.bool(isFollow),
        tx.object(badgeCollectionId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::follow_user`,
    });

    return executeTransaction(tx, {
      successMessage: "Follow status updated successfully!",
      errorMessage: "Error updating follow status. Please try again.",
      loadingMessage: "Updating follow status...",
      onSuccess,
    });
  };

  const claimDailyCashback = async (treasuryId, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.object(treasuryId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::claim_daily_cashback`,
    });

    return executeTransaction(tx, {
      successMessage: "Daily cashback claimed successfully!",
      errorMessage: "Error claiming daily cashback. Please try again.",
      loadingMessage: "Claiming daily cashback...",
      onSuccess,
    });
  };

  return {
    uploadVideo,
    deleteVideo,
    refreshDailyPool,
    registerUser,
    updateProfile,
    updateUsername,
    updateBio,
    vote,
    sendReward,
    followUser,
    claimDailyCashback,
  };
};

export default useCreateContent;

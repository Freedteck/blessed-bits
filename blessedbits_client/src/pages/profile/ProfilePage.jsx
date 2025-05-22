import { useEffect, useState } from "react";
import { FaShareAlt, FaEdit, FaSave, FaCheckCircle } from "react-icons/fa";
import styles from "./ProfilePage.module.css";
import VideoCard from "../../components/shared/video-card/VideoCard";
import { useUserData } from "../../hooks/useUserData";
import { useNetworkVariables } from "../../config/networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useUserBlessBalance } from "../../hooks/useUserBlessBalance";
import Loading from "../../components/shared/loading/Loading";
import { formatCoin } from "../../utils/formatCoin";
import useCreateContent from "../../hooks/useCreateContent";
import { useBadgeData } from "../../hooks/useBadgeData";
import BadgeCard from "../../components/badges/badge-card/BadgeCard";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("content"); // 'content' or 'badges'
  const [bio, setBio] = useState("");

  const { packageId, platformStateId, badgeCollectionId } = useNetworkVariables(
    "packageId",
    "platformStateId",
    "badgeCollectionId"
  );

  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { userProfile, videos, followers, refetch, isPending } = useUserData(
    platformStateId,
    account?.address
  );

  const { updateBio } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  const { userBadges } = useBadgeData(badgeCollectionId, account?.address);

  const { totalBless } = useUserBlessBalance(
    account?.address,
    packageId,
    platformStateId
  );

  useEffect(() => {
    if (userProfile) {
      setBio(userProfile?.bio);
    }
  }, [isEditing, userProfile, totalBless]);

  const handleBioChange = () => {
    const previousBio = userProfile?.bio;
    if (previousBio !== bio) {
      updateBio(bio, () => {
        refetch();
        setIsEditing(false);
      });
    } else {
      setIsEditing(false);
    }
  };

  const bannerImage =
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=200&q=80";

  return (
    <main className={styles.mainContent}>
      {isPending ? (
        <Loading />
      ) : (
        <>
          {/* Profile Banner */}
          <div className={styles.profileBanner}>
            <img
              src={bannerImage}
              alt="Banner"
              className={styles.bannerImage}
            />
            <div className={styles.profileOverlay}>
              <div className={styles.profileAvatar}>
                {userProfile?.username.slice(0, 2).toUpperCase()}
              </div>
              <div className={styles.profileActions}>
                <button className={styles.actionBtn}>
                  <FaShareAlt /> <span>Share</span>
                </button>
                <button
                  className={styles.editBtn}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FaEdit />{" "}
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
                {isEditing && (
                  <button className={styles.saveBtn} onClick={handleBioChange}>
                    <FaSave /> <span>Save</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className={styles.profileInfo}>
            <h1>{userProfile?.username}</h1>

            {isEditing ? (
              <textarea
                className={styles.bioInput}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
              />
            ) : (
              <p className={styles.profileBio}>{bio}</p>
            )}

            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{followers?.length}</div>
                <div className={styles.statLabel}>Followers</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{videos?.length}</div>
                <div className={styles.statLabel}>Videos</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  {formatCoin(totalBless)} $BLESS
                </div>
                <div className={styles.statLabel}>Earnings</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNavigation}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "content" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("content")}
              >
                Your Content ({videos?.length || 0})
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "badges" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("badges")}
              >
                Badges ({userBadges?.length || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === "content" ? (
                <div className={styles.videoGrid}>
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id.id}
                      thumbnail={video.thumbnail_url}
                      videoUrl={video.video_url}
                      title={video.title}
                      likes={video.likes}
                      videoId={video.id}
                      creator={account?.address}
                      tags={video.tags}
                      description="A short description of the video goes here."
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.badgesSection}>
                  <div className={styles.badgesGrid}>
                    {userBadges?.map((badge) => (
                      <BadgeCard
                        userBadge={badge}
                        key={badge.id.id}
                        isEarned={true}
                      />
                    ))}
                  </div>

                  <div className={styles.benefitsCard}>
                    <h3>Why Earn Badges?</h3>
                    <div className={styles.benefitsList}>
                      <div className={styles.benefitItem}>
                        <FaCheckCircle className={styles.benefitIcon} />
                        <span>
                          <strong>Exclusive Perks:</strong> Special profile
                          frames & early access
                        </span>
                      </div>
                      <div className={styles.benefitItem}>
                        <FaCheckCircle className={styles.benefitIcon} />
                        <span>
                          <strong>Higher Earnings:</strong> +10% $BLESS rewards
                          for badge holders
                        </span>
                      </div>
                      <div className={styles.benefitItem}>
                        <FaCheckCircle className={styles.benefitIcon} />
                        <span>
                          <strong>NFT Value:</strong> Trade rare badges on Sui
                          NFT markets
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ProfilePage;

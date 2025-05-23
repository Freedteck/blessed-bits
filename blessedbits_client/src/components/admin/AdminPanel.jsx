import { useState } from "react";
import {
  FaCoins,
  FaAward,
  FaUserCog,
  FaCog,
  FaSyncAlt,
  FaChevronDown,
} from "react-icons/fa";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import styles from "./AdminPanel.module.css";
import useCreateContent from "../../hooks/useCreateContent";

// Badge types from your smart contract
const BADGE_TYPES = [
  { value: "FirstUpload", label: "First Upload" },
  { value: "TopCreator", label: "Top Creator (100+ followers)" },
  { value: "Consistency", label: "Consistency (5+ videos)" },
  { value: "FaithfulCreator", label: "Faithful Creator (30+ videos)" },
  { value: "BlessedCreator", label: "Blessed Creator (1000+ $BLESS)" },
  { value: "HeartfeltCreator", label: "Heartfelt Creator (100+ likes)" },
  { value: "ThousandFollowers", label: "1K Followers" },
];

const AdminPanel = ({
  packageId,
  platformStateId,
  badgeCollectionId,
  treasuryCapId,
  platformConfigId,
  adminCapId,
}) => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const {
    awardBadge,
    distributeStakerRewards,
    updatePlatformConfig,
    refreshDailyPool,
  } = useCreateContent(packageId, platformStateId, suiClient, signAndExecute);

  // Form states
  const [badgeRecipient, setBadgeRecipient] = useState("");
  const [selectedBadgeType, setSelectedBadgeType] = useState("");
  const [badgeDescription, setBadgeDescription] = useState("");
  const [configValues, setConfigValues] = useState({
    dailyCashback: "10",
    minPurchase: "100",
    blessPerSui: "10000",
    dailyRewardsBase: "100000",
    stakingRewardPercent: "10",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAwardBadge = async () => {
    if (!badgeRecipient || !selectedBadgeType) return;

    // Set default description based on badge type if empty
    const description =
      badgeDescription ||
      BADGE_TYPES.find((b) => b.value === selectedBadgeType)?.label ||
      "";

    await awardBadge(
      badgeCollectionId,
      selectedBadgeType,
      description,
      badgeRecipient,
      () => {
        setBadgeRecipient("");
        setSelectedBadgeType("");
        setBadgeDescription("");
      }
    );
  };

  const handleUpdateConfig = async () => {
    await updatePlatformConfig(
      platformConfigId,
      Number(configValues.dailyCashback),
      Number(configValues.minPurchase),
      Number(configValues.blessPerSui),
      Number(configValues.dailyRewardsBase),
      Number(configValues.stakingRewardPercent),
      adminCapId,
      () => {
        // Keep values for easy editing
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaUserCog /> Platform Administration
        </h1>
        <p className={styles.walletAddress}>
          Connected as: <span>{account?.address}</span>
        </p>
      </div>

      <div className={styles.grid}>
        {/* Token Management Card */}
        <div className={`${styles.card} ${styles.managementCard}`}>
          <div className={styles.cardHeader}>
            <FaCoins className={styles.cardIcon} />
            <h2>Token Management</h2>
          </div>
          <div className={styles.cardContent}>
            <button
              className={styles.actionButton}
              onClick={() => distributeStakerRewards(treasuryCapId)}
            >
              <FaSyncAlt /> Distribute Staking Rewards
            </button>
            <button
              className={styles.actionButton}
              onClick={() => refreshDailyPool(platformConfigId)}
            >
              <FaSyncAlt /> Refresh Daily Pool
            </button>
          </div>
        </div>

        {/* Badge Management Card */}
        <div className={`${styles.card} ${styles.badgeCard}`}>
          <div className={styles.cardHeader}>
            <FaAward className={styles.cardIcon} />
            <h2>Award Badges</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.inputGroup}>
              <label>Recipient Address</label>
              <input
                type="text"
                value={badgeRecipient}
                onChange={(e) => setBadgeRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Badge Type</label>
              <div
                className={styles.dropdown}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={styles.dropdownHeader}>
                  {selectedBadgeType || "Select a badge type"}
                  <FaChevronDown
                    className={`${styles.dropdownIcon} ${
                      isDropdownOpen ? styles.rotate : ""
                    }`}
                  />
                </div>
                {isDropdownOpen && (
                  <div className={styles.dropdownList}>
                    {BADGE_TYPES.map((badge) => (
                      <div
                        key={badge.value}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setSelectedBadgeType(badge.value);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {badge.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Custom Description (optional)</label>
              <input
                type="text"
                value={badgeDescription}
                onChange={(e) => setBadgeDescription(e.target.value)}
                placeholder="Custom description..."
              />
            </div>

            <button
              className={styles.submitButton}
              onClick={handleAwardBadge}
              disabled={!badgeRecipient || !selectedBadgeType}
            >
              Award Badge
            </button>
          </div>
        </div>

        {/* Platform Configuration Card */}
        <div className={`${styles.card} ${styles.configCard}`}>
          <div className={styles.cardHeader}>
            <FaCog className={styles.cardIcon} />
            <h2>Platform Configuration</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.configGrid}>
              <div className={styles.inputGroup}>
                <label>Daily Cashback</label>
                <input
                  type="number"
                  value={configValues.dailyCashback}
                  onChange={(e) =>
                    setConfigValues({
                      ...configValues,
                      dailyCashback: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Min Purchase ($BLESS)</label>
                <input
                  type="number"
                  value={configValues.minPurchase}
                  onChange={(e) =>
                    setConfigValues({
                      ...configValues,
                      minPurchase: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>BLESS per SUI</label>
                <input
                  type="number"
                  value={configValues.blessPerSui}
                  onChange={(e) =>
                    setConfigValues({
                      ...configValues,
                      blessPerSui: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Daily Rewards Base</label>
                <input
                  type="number"
                  value={configValues.dailyRewardsBase}
                  onChange={(e) =>
                    setConfigValues({
                      ...configValues,
                      dailyRewardsBase: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Staking Reward %</label>
                <input
                  type="number"
                  value={configValues.stakingRewardPercent}
                  onChange={(e) =>
                    setConfigValues({
                      ...configValues,
                      stakingRewardPercent: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              className={styles.submitButton}
              onClick={handleUpdateConfig}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

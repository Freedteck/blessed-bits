import { useEffect, useState } from "react";
import {
  FaUser,
  FaShieldAlt,
  FaBell,
  FaLink,
  FaWallet,
  FaExclamationTriangle,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import styles from "./SettingsPage.module.css";
import Button from "../../components/shared/button/Button";
import { useUserData } from "../../hooks/useUserData";
import { useNetworkVariables } from "../../config/networkConfig";
import {
  useCurrentAccount,
  useDisconnectWallet,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import useCreateContent from "../../hooks/useCreateContent";
import { formatAddress } from "@mysten/sui/utils";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("JohnDoe");
  const [bio, setBio] = useState("Sharing daily devotionals and prayers");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { packageId, platformStateId } = useNetworkVariables(
    "packageId",
    "platformStateId"
  );
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const { userProfile, isPending, refetch } = useUserData(
    platformStateId,
    account?.address
  );

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const { updateProfile } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  const noChanges =
    displayName === userProfile?.username && bio === userProfile?.bio;

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile?.username);
      setBio(userProfile?.bio);
    }
  }, [userProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
  };

  const handleSaveChanges = () => {
    if (noChanges) return;
    updateProfile(displayName, bio, () => {
      refetch();
      setAvatarPreview(null);
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account?.address || "");
    toast.success("Address copied to clipboard");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "blockchain", label: "Blockchain", icon: <FaLink /> },
  ];

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Account Settings</h2>
      </header>

      <div className={styles.settingsTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h3>Profile Information</h3>
            <div className={styles.formGroup}>
              <label>Display Name</label>
              <input
                type="text"
                className={styles.formControl}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea
                className={styles.formControl}
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              disabled={isPending || noChanges}
              onClick={handleSaveChanges}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className={styles.card}>
            <h3>Profile Picture</h3>
            <div className={styles.avatarUpload}>
              <div className={styles.avatarPreview}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" />
                ) : (
                  <div className={styles.initialsAvatar}>
                    {userProfile?.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={styles.uploadActions}>
                <Button
                  variant="outline"
                  disabled={true}
                  onClick={() => setShowAvatarModal(true)}
                >
                  <FaUpload /> Change
                </Button>
                {avatarPreview && (
                  <button
                    className={styles.removeButton}
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h3>Wallet Connection</h3>
            <div className={styles.walletInfo}>
              <div
                className={styles.walletAddress}
                onClick={copyAddress}
                title="Click to copy"
              >
                <FaWallet />
                <span>{formatAddress(account?.address)}</span>
              </div>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
            <p className={styles.hint}>Connected via zkLogin</p>
          </div>

          <div className={styles.card}>
            <h3>Two-Factor Authentication</h3>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                id="2fa"
                checked={is2FAEnabled}
                onChange={() => setIs2FAEnabled(!is2FAEnabled)}
              />
              <label htmlFor="2fa">Enable 2FA</label>
            </div>
            {is2FAEnabled && (
              <div className={styles.twoFactorSetup}>
                <p>Scan this QR code with your authenticator app:</p>
                <div className={styles.qrCodePlaceholder}></div>
                <p>
                  Or enter this code manually: <strong>JBSWY3DPEHPK3PXP</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h3>Notification Preferences</h3>
            <div className={styles.notificationSetting}>
              <div>
                <h4>New Followers</h4>
                <p>Get notified when someone follows you</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.notificationSetting}>
              <div>
                <h4>Video Likes</h4>
                <p>Get notified when someone likes your video</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.notificationSetting}>
              <div>
                <h4>Comments</h4>
                <p>Get notified when someone comments on your video</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.notificationSetting}>
              <div>
                <h4>Rewards</h4>
                <p>Get notified when you earn $BLESS tokens</p>
              </div>
              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Tab */}
      {activeTab === "blockchain" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h3>Blockchain Settings</h3>
            <div className={styles.formGroup}>
              <label>Default Network</label>
              <select className={styles.formControl}>
                <option>Sui Mainnet</option>
                <option>Sui Testnet</option>
                <option>Localhost</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Transaction Speed</label>
              <select className={styles.formControl}>
                <option>Standard</option>
                <option>Fast</option>
                <option>Instant</option>
              </select>
            </div>
            <Button variant="primary">Save Settings</Button>
          </div>
        </div>
      )}

      {/* Danger Zone (shown on all tabs) */}
      <div className={`${styles.card} ${styles.dangerZone}`}>
        <h3>Danger Zone</h3>
        <div className={styles.dangerItem}>
          <div>
            <h4>
              <FaExclamationTriangle /> Deactivate Account (Coming soon)
            </h4>
            <p>Temporarily disable your BlessedBits account</p>
          </div>
          <Button variant="danger" disabled>
            Deactivate
          </Button>
        </div>
        <div className={styles.dangerItem}>
          <div>
            <h4>
              <FaExclamationTriangle /> Delete Account (Coming soon)
            </h4>
            <p>Permanently remove your account and data</p>
          </div>
          <Button variant="danger" disabled>
            Delete
          </Button>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Upload Profile Picture</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowAvatarModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.uploadArea}>
                <p>Drag and drop an image here, or click to browse</p>
                <input
                  type="file"
                  id="avatarUpload"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="avatarUpload" className={styles.uploadButton}>
                  Select Image
                </label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button
                variant="primary"
                onClick={() => {
                  setShowAvatarModal(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SettingsPage;

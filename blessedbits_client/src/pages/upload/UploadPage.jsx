import { useState, useRef, useContext } from "react";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimes,
  FaWallet,
  FaPlusCircle,
  FaCircle,
} from "react-icons/fa";
import styles from "./UploadPage.module.css";
import Button from "../../components/shared/button/Button";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import {
  useNetworkVariable,
  useNetworkVariables,
} from "../../config/networkConfig";
import { Link, useNavigate } from "react-router-dom";
import { WalletContext } from "../../components/context/walletContext";
import useCreateContent from "../../hooks/useCreateContent";
import { uploadFile } from "../../utils/walrusService";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(["Prayer", "Faith"]);
  const [newTag, setNewTag] = useState("");
  const [isMonetized, setIsMonetized] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { blessBalance } = useContext(WalletContext);
  const navigate = useNavigate();

  const packageId = useNetworkVariable("packageId");

  const { platformStateId, treasuryCapId, badgeCollectionId } =
    useNetworkVariables(
      "platformStateId",
      "treasuryCapId",
      "badgeCollectionId"
    );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const { claimDailyCashback, uploadVideo } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const videoUrl = await uploadFile(file);
    uploadVideo(
      videoUrl,
      "",
      badgeCollectionId,
      title,
      description,
      tags,
      () => {
        setFile(null);
        setTitle("");
        setDescription("");
        setTags(["Prayer", "Faith"]);
        setNewTag("");
        setIsMonetized(true);
        setUploadProgress(0);
        setIsUploading(false);
        navigate("/app");
      }
    );

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleClaim = () => {
    claimDailyCashback(treasuryCapId, () => {
      console.log("Claimed daily cashback successfully!");
    });
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Upload Short</h2>
        <div className={styles.walletBalance}>
          <FaWallet />
          <span>{blessBalance} $BLESS</span>
        </div>
        <button onClick={handleClaim}>{isPending ? "Pending" : "Claim"}</button>
      </header>

      <div className={styles.uploadContainer}>
        {/* Upload Area */}
        <div className={styles.uploadArea} onClick={handleUploadAreaClick}>
          {file ? (
            <>
              <FaCheckCircle className={styles.uploadIcon} />
              <h3>{file.name}</h3>
              <p>Ready to upload</p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className={styles.uploadIcon} />
              <h3>Drag & Drop Video</h3>
              <p>or click to browse files (60s max)</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            style={{ display: "none" }}
          />
        </div>

        {/* Title Input */}
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className={styles.formControl}
            placeholder="e.g., Morning Prayer for Peace"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Textarea */}
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className={styles.formControl}
            rows="3"
            placeholder="Share the message behind this video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Tags Input */}
        <div className={styles.formGroup}>
          <label>Tags (AI Suggestions)</label>
          <div className={styles.tagInput}>
            {tags.map((tag) => (
              <div key={tag} className={styles.tag}>
                #{tag}
                <button
                  className={styles.tagRemove}
                  onClick={() => handleTagRemove(tag)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add tags..."
              className={styles.tagInputField}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagAdd}
            />
          </div>
        </div>

        {/* Monetization Toggle */}
        <div className={styles.formGroup}>
          <label>Monetization</label>
          <div className={styles.toggleSwitch}>
            <input
              type="checkbox"
              id="monetize"
              checked={isMonetized}
              onChange={() => setIsMonetized(!isMonetized)}
            />
            <label htmlFor="monetize">Earn $BLESS from votes</label>
          </div>
        </div>

        {/* Upload Actions */}
        <div className={styles.uploadActions}>
          {/* <Button variant="outline">Save Draft</Button> */}
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!file || isUploading || isPending}
          >
            {isUploading || isPending ? (
              <>
                <FaCircle />
                Uploading...
              </>
            ) : (
              <>
                <FaPlusCircle /> Upload
              </>
            )}
          </Button>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className={styles.uploadProgress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span>Uploading to decentralized storage... {uploadProgress}%</span>
          </div>
        )}
      </div>
    </main>
  );
};

export default UploadPage;

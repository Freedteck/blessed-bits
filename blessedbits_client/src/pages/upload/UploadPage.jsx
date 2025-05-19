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

// Recommended tags that will be suggested as users type
const RECOMMENDED_TAGS = [
  "Prayer",
  "Faith",
  "Bible",
  "Gospel",
  "Christian",
  "Worship",
  "Devotional",
  "Inspiration",
  "Testimony",
  "Hope",
  "Love",
  "Peace",
  "Joy",
  "Salvation",
  "Scripture",
  "Muslim",
  "Islam",
  "Quran",
  "Salah",
  "Dua",
  "Hadith",
  "Zakat",
  "Sadaqah",
  "Wisdom",
  "Music",
];

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(["Prayer", "Faith"]);
  const [newTag, setNewTag] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [isMonetized, setIsMonetized] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const { blessBalance } = useContext(WalletContext);
  const navigate = useNavigate();

  const packageId = useNetworkVariable("packageId");
  const { platformStateId, badgeCollectionId } = useNetworkVariables(
    "platformStateId",
    "treasuryCapId",
    "badgeCollectionId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const { uploadVideo } = useCreateContent(
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

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setNewTag(value);

    if (value) {
      const filtered = RECOMMENDED_TAGS.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
      );
      setTagSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      handleTagAdd(newTag.trim());
    }
  };

  const handleSuggestionClick = (tag) => {
    handleTagAdd(tag);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
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
          // setIsMonetized(true);
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
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Upload Short</h2>
        <div className={styles.walletBalance}>
          <FaWallet />
          <span>{blessBalance} $BLESS</span>
        </div>
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

        {/* Tags Input with Suggestions */}
        <div className={styles.formGroup}>
          <label>Tags</label>
          <div className={styles.tagInputContainer}>
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
                ref={tagInputRef}
                placeholder="Add tags..."
                className={styles.tagInputField}
                value={newTag}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                onFocus={() => newTag && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>
            {showSuggestions && tagSuggestions.length > 0 && (
              <div className={styles.tagSuggestions}>
                {tagSuggestions.map((tag) => (
                  <div
                    key={tag}
                    className={styles.tagSuggestion}
                    onClick={() => handleSuggestionClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monetization Toggle */}
        {/* <div className={styles.formGroup}>
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
        </div> */}

        {/* Upload Actions */}
        <div className={styles.uploadActions}>
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

import { useState } from "react";
import { FaPrayingHands } from "react-icons/fa";
import styles from "./OnboardingPage.module.css";
import Input from "../../components/shared/input/Input";
import Button from "../../components/shared/button/Button";
import useCreateContent from "../../hooks/useCreateContent";
import { useNetworkVariables } from "../../config/networkConfig";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const { packageId, platformStateId } = useNetworkVariables(
    "packageId",
    "platformStateId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const { registerUser } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username && bio) {
      registerUser(username, bio, () => navigate("/app/upload"));
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingCard}>
        <div className={styles.onboardingLogo}>
          <FaPrayingHands className={styles.logoIcon} />
          <span>BlessedBits</span>
        </div>

        <form className={styles.onboardingForm} onSubmit={handleSubmit}>
          <h1>Complete Your Profile</h1>
          <p className={styles.subtext}>
            Just two steps to start sharing inspiration
          </p>

          <Input
            label="Username"
            placeholder="SpiritualGuide"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            charCount
            error="Only letters, numbers and underscores allowed"
            hint="This will be your public identity"
            id="username"
          />

          <Input
            label="Short Bio"
            type="textarea"
            placeholder="Tell others what inspires you..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            minLength={10}
            maxLength={100}
            rows={3}
            error="Please write at least 10 characters"
            id="bio"
          />

          <Button
            variant="primary"
            block
            icon="arrowRight"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creating profile..." : "Continue to BlessedBits"}
          </Button>

          <p className={styles.termsText}>
            By continuing, you agree to our <a href="#">Terms</a> and
            <a href="#">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;

import { useState } from "react";
import { FaPrayingHands, FaArrowRight } from "react-icons/fa";
import styles from "./OnboardingPage.module.css";
import Input from "../../components/shared/input/Input";
import useCreateContent from "../../hooks/useCreateContent";
import { useNetworkVariables } from "../../config/networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import GasWarning from "../../components/shared/gas-warning/GasWarning";
import Button from "../../components/shared/button/Button";
import Loading from "../../components/shared/loading/Loading";

const OnboardingPage = () => {
  const BIO_MAX_LENGTH = 160;
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    bio: false,
  });
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const account = useCurrentAccount();
  const { packageId, platformStateId, treasuryCapId } = useNetworkVariables(
    "packageId",
    "platformStateId",
    "treasuryCapId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { registerUser } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  // Validation rules
  const validateUsername = (value) => {
    if (!value) return "Username is required";
    if (value.length < 3) return "Must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Only letters, numbers and underscores allowed";
    return null;
  };

  const validateBio = (value) => {
    if (!value) return "Bio is required";
    if (value.length < 10) return "Must be at least 10 characters";
    if (value.length > BIO_MAX_LENGTH)
      return `Must be less than ${BIO_MAX_LENGTH} characters`;
    return null;
  };

  const usernameError = touched.username
    ? validateUsername(formData.username)
    : null;
  const bioError = touched.bio ? validateBio(formData.bio) : null;
  const isFormValid =
    !validateUsername(formData.username) && !validateBio(formData.bio);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    setTouched({
      username: true,
      bio: true,
    });

    if (!isFormValid) {
      setMessage({
        text: "Please fix the errors in the form",
        isError: true,
      });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      registerUser(formData.username, formData.bio, treasuryCapId, () => {
        setMessage({
          text: "Registration complete! You received 1000 $BLESS to get started",
          isError: false,
        });

        setIsProcessing(false);
        setTimeout(() => {
          window.location.href = "/app";
        }, 2000);
      });
    } catch (error) {
      setMessage({
        text: "Registration failed. Please try again.",
        isError: true,
      });
      console.error("Registration error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingCard}>
        {isProcessing && <Loading />}
        <div className={styles.onboardingLogo}>
          <FaPrayingHands className={styles.logoIcon} />
          <span>BlessedBits</span>
        </div>

        <GasWarning userAddress={account?.address} />

        {message && (
          <div
            className={`${styles.message} ${
              message.isError ? styles.error : styles.success
            }`}
          >
            {message.text}
          </div>
        )}

        <form className={styles.onboardingForm} onSubmit={handleSubmit}>
          <h1>Complete Your Profile</h1>
          <p className={styles.subtext}>
            Join our community of inspiration seekers and sharers
          </p>

          <Input
            label="Username"
            name="username"
            placeholder="SpiritualGuide"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={usernameError}
            hint="This will be your public identity"
            id="username"
            disabled={isProcessing}
          />

          <Input
            label="Short Bio"
            name="bio"
            type="textarea"
            placeholder="Tell others what inspires you..."
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            error={bioError}
            id="bio"
            disabled={isProcessing}
            rows={3}
            hint={`${formData.bio.length}/${BIO_MAX_LENGTH} characters`}
            maxLength={BIO_MAX_LENGTH}
          />

          <div className={styles.btn}>
            <Button
              variant="primary"
              icon={isProcessing ? null : <FaArrowRight />}
              type="submit"
              disabled={isProcessing || !isFormValid}
              className={isProcessing ? styles.loading : ""}
            >
              {isProcessing
                ? "Creating your profile..."
                : "Continue to BlessedBits"}
            </Button>
          </div>

          <div className={styles.note}>
            <strong>Welcome gift:</strong> Receive 100 $BLESS tokens when you
            register!
          </div>

          <p className={styles.termsText}>
            By continuing, you agree to our <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;

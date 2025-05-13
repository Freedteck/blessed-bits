// src/pages/LandingPage.jsx
import {
  FaPrayingHands,
  FaPlay,
  FaHeart,
  FaCoins,
  FaVideo,
  FaUsers,
  FaWallet,
  FaFingerprint,
  FaShieldAlt,
  FaUser,
  FaCloud,
  FaServer,
  FaTwitter,
  FaDiscord,
  FaTelegram,
} from "react-icons/fa";
import styles from "./LandingPage.module.css";
import Button from "../../components/shared/button/Button";
import FeatureCard from "../../components/landing/featured-card/FeatureCard";
import CreatorCard from "../../components/landing/creator-card/CreatorCaed";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <FaVideo />,
      title: "Create & Upload",
      description:
        "Record 60-second inspirational shorts and upload to our decentralized platform.",
    },
    {
      icon: <FaUsers />,
      title: "Community Votes",
      description:
        "Viewers vote on content they find meaningful. More votes = more rewards.",
    },
    {
      icon: <FaWallet />,
      title: "Earn Tokens",
      description:
        "Get paid in $BLESS tokens that you can trade, stake, or cash out.",
    },
  ];

  const benefits = [
    {
      icon: <FaFingerprint />,
      title: "True Ownership",
      description:
        "Your content is stored on IPFS - no one can take it down or claim it as theirs.",
    },
    {
      icon: <FaCoins />,
      title: "Fair Monetization",
      description:
        "Earn directly from your audience, not through exploitative ad systems.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Censorship-Resistant",
      description:
        "No algorithms suppressing spiritual content. The community decides what's valuable.",
    },
  ];

  const creators = [
    {
      initials: "MG",
      name: "MindfulGuide",
      description: "Daily mindfulness tips",
      followers: "1.2K Followers",
      earnings: "5.6K $BLESS",
    },
    {
      initials: "FP",
      name: "FaithPath",
      description: "Scripture reflections",
      followers: "890 Followers",
      earnings: "3.2K $BLESS",
    },
    {
      initials: "SL",
      name: "SpiritualLife",
      description: "Meditation guidance",
      followers: "2.4K Followers",
      earnings: "8.1K $BLESS",
    },
    {
      initials: "PW",
      name: "PrayerWarrior",
      description: "Daily prayer sessions",
      followers: "1.7K Followers",
      earnings: "6.3K $BLESS",
    },
  ];

  return (
    <div className={styles.landingContainer}>
      {/* Background overlay div */}
      <div className={styles.backgroundOverlay}></div>

      <header className={styles.landingHeader}>
        <div className={styles.logo}>
          <FaPrayingHands className={styles.logoIcon} />
          <span>
            Blessed<span>Bits</span>
          </span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#">How It Works</a>
          <a href="#">Creators</a>
          <a href="#">About</a>
          <Button variant="outline" className={styles.navButton}>
            Early Access
          </Button>
        </nav>
      </header>

      <main className={styles.landingHero}>
        <div className={styles.heroContent}>
          <h1>
            Inspirational Shorts.
            <br />
            Owned by <span>You</span>.
          </h1>
          <p className={styles.subtitle}>
            A Web3 platform for spiritual & motivational content where creators
            earn rewards and keep ownership.
          </p>
          <div className={styles.ctaButtons}>
            <Button variant="primary" onClick={() => navigate("app")}>
              Enter App
            </Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        <div className={styles.heroPreview}>
          <div className={styles.videoPreview}>
            <div className={styles.videoThumb}>
              <FaPlay className={styles.playIcon} />
            </div>
            <div className={styles.videoInfo}>
              <div className={styles.creator}>@spiritualguide</div>
              <div className={styles.title}>Finding peace in chaotic times</div>
              <div className={styles.stats}>
                <span>
                  <FaHeart className={styles.statIcon} /> 245
                </span>
                <span>
                  <FaCoins className={styles.statIcon} /> 56 $BLESS
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.howItWorks}>
        <h2>How BlessedBits Works</h2>
        <div className={styles.steps}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section className={styles.web3Benefits}>
        <div className={styles.benefitsContent}>
          <h2>Why Web3 Changes Everything</h2>
          <div className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <div className={styles.benefit} key={index}>
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.benefitsVisual}>
          <div className={styles.blockchainVisual}>
            <div className={styles.node}>
              <FaUser />
            </div>
            <div className={styles.node}>
              <FaCloud />
            </div>
            <div className={styles.node}>
              <FaServer />
            </div>
            <div className={styles.connections}></div>
          </div>
        </div>
      </section>

      <section className={styles.trendingCreators}>
        <h2>Featured Creators</h2>
        <div className={styles.creatorsGrid}>
          {creators.map((creator, index) => (
            <CreatorCard
              key={index}
              initials={creator.initials}
              name={creator.name}
              description={creator.description}
              followers={creator.followers}
              earnings={creator.earnings}
            />
          ))}
        </div>
      </section>

      <footer className={styles.landingFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerAbout}>
            <div className={styles.footerLogo}>
              <FaPrayingHands className={styles.footerLogoIcon} />
              <span>BlessedBits</span>
            </div>
            <p>Decentralized inspiration for the soul</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h4>Platform</h4>
              <a href="#">How It Works</a>
              <a href="#">Tokenomics</a>
              <a href="#">Roadmap</a>
            </div>
            <div className={styles.linkGroup}>
              <h4>Community</h4>
              <a href="#">Discord</a>
              <a href="#">Twitter</a>
              <a href="#">Blog</a>
            </div>
            <div className={styles.linkGroup}>
              <h4>Legal</h4>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 BlessedBits. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaDiscord />
            </a>
            <a href="#">
              <FaTelegram />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

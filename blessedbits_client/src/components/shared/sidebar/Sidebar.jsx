import {
  FaHome,
  FaCompass,
  FaPlusCircle,
  FaCoins,
  FaTrophy,
  FaUser,
  FaCog,
  FaPrayingHands,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navLinks = [
    { icon: <FaHome />, label: "Home", path: "/app", key: "home", end: true },
    { icon: <FaCompass />, label: "Explore", path: "explore", key: "explore" },
    { icon: <FaPlusCircle />, label: "Upload", path: "upload", key: "upload" },
    { icon: <FaCoins />, label: "Rewards", path: "rewards", key: "rewards" },
    { icon: <FaTrophy />, label: "Badges", path: "badges", key: "badges" },
    { icon: <FaUser />, label: "Profile", path: "profile", key: "profile" },
    { icon: <FaCog />, label: "Settings", path: "settings", key: "settings" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.navLogo}>
        <FaPrayingHands className={styles.logoIcon} />
        <span>
          Blessed<span>Bits</span>
        </span>
      </div>

      <nav className={styles.navMenu}>
        {navLinks.map((link) => (
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
            end={link.end}
            key={link.key}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.navFooter}>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>JD</div>
          <div>
            <div className={styles.username}>JohnDoe</div>
            <div className={styles.walletAddress}>0x1a2...3b4c</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

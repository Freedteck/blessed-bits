import {
  FaHome,
  FaCompass,
  FaPlusCircle,
  FaCoins,
  FaUser,
  FaCog,
  FaPrayingHands,
  FaUserShield, // Admin icon
} from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../../config/networkConfig";

const Sidebar = () => {
  const account = useCurrentAccount();
  const { adminCapId } = useNetworkVariables("adminCapId");

  const { data } = useSuiClientQuery(
    "getObject",
    {
      id: adminCapId,
      options: {
        showOwner: true,
      },
    },
    {
      enabled: !!account?.address && !!adminCapId,
    }
  );

  const isAdmin = data?.data?.owner?.AddressOwner === account?.address;

  const navLinks = [
    { icon: <FaHome />, label: "Home", path: "/app", key: "home", end: true },
    { icon: <FaCompass />, label: "Explore", path: "explore", key: "explore" },
    { icon: <FaPlusCircle />, label: "Upload", path: "upload", key: "upload" },
    { icon: <FaCoins />, label: "Rewards", path: "rewards", key: "rewards" },
    { icon: <FaUser />, label: "Profile", path: "profile", key: "profile" },
    { icon: <FaCog />, label: "Settings", path: "settings", key: "settings" },
    ...(isAdmin
      ? [
          {
            icon: <FaUserShield />, // Using shield icon for admin
            label: "Admin",
            path: "admin",
            key: "admin",
          },
        ]
      : []),
  ].filter(Boolean);

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
        <ConnectButton />
      </div>
    </aside>
  );
};

export default Sidebar;

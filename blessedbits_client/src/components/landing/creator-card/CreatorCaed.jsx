import { useNetworkVariables } from "../../../config/networkConfig";
import { useUserBlessBalance } from "../../../hooks/useUserBlessBalance";
import { formatCoin } from "../../../utils/formatCoin";
import styles from "./CreatorCard.module.css";
import { formatAddress } from "@mysten/sui/utils";

const CreatorCard = ({ initials, name, address, followers }) => {
  const { packageId, platformStateId } = useNetworkVariables(
    "packageId",
    "platformStateId"
  );
  const { totalBless } = useUserBlessBalance(
    address,
    packageId,
    platformStateId
  );
  return (
    <div className={styles.creatorCard}>
      <div className={styles.creatorAvatar}>{initials}</div>
      <h3>{name}</h3>
      <p className={styles.creatorDescription}>{formatAddress(address)}</p>
      <div className={styles.creatorStats}>
        <span>{followers} Followers</span>
        <span>{formatCoin(totalBless)} $BLESS</span>
      </div>
    </div>
  );
};

export default CreatorCard;

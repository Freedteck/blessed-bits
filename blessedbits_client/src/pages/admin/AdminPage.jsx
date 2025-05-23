import AdminPanel from "../../components/admin/AdminPanel";
import { useNetworkVariables } from "../../config/networkConfig";

const AdminPage = () => {
  const {
    packageId,
    platformStateId,
    badgeCollectionId,
    treasuryCapId,
    platformConfigId,
    adminCapId,
  } = useNetworkVariables(
    "packageId",
    "platformStateId",
    "badgeCollectionId",
    "treasuryCapId",
    "platformConfigId",
    "adminCapId"
  );
  return (
    <AdminPanel
      packageId={packageId}
      badgeCollectionId={badgeCollectionId}
      platformConfigId={platformConfigId}
      platformStateId={platformStateId}
      treasuryCapId={treasuryCapId}
      adminCapId={adminCapId}
    />
  );
};

export default AdminPage;

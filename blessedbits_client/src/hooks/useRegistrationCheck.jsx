import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRegistrationCheck = (platformStateId, userAddress) => {
  const navigate = useNavigate();
  const { data: platformState } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId && !!userAddress }
  );

  useEffect(() => {
    if (platformState?.data?.content?.fields?.user_profiles?.fields?.contents) {
      const isRegistered =
        platformState.data.content.fields.user_profiles.fields.contents.some(
          (entry) => entry.fields.key === userAddress
        );

      console.log("isRegistered", isRegistered);

      if (!isRegistered && userAddress) {
        navigate("/app/register", {
          state: {
            message:
              "Welcome to BlessedBits! Please complete your profile to continue",
            severity: "info",
          },
        });
      }
    }
  }, [platformState, userAddress, navigate]);
};

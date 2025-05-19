import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_BADGE_COLLECTION_ID,
  DEVNET_COIN_METADATA_ID,
  DEVNET_PACKAGE_ID,
  DEVNET_PLATFORM_STATE_ID,
  DEVNET_TREASURY_CAP_ID,
  MAINNET_BADGE_COLLECTION_ID,
  MAINNET_COIN_METADATA_ID,
  MAINNET_PACKAGE_ID,
  MAINNET_PLATFORM_STATE_ID,
  MAINNET_TREASURY_CAP_ID,
  TESTNET_BADGE_COLLECTION_ID,
  TESTNET_COIN_METADATA_ID,
  TESTNET_PACKAGE_ID,
  TESTNET_PLATFORM_STATE_ID,
  TESTNET_TREASURY_CAP_ID,
} from "./constants.js";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        badgeCollectionId: DEVNET_BADGE_COLLECTION_ID,
        packageId: DEVNET_PACKAGE_ID,
        platformStateId: DEVNET_PLATFORM_STATE_ID,
        treasuryCapId: DEVNET_TREASURY_CAP_ID,
        coinMetadataId: DEVNET_COIN_METADATA_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        badgeCollectionId: TESTNET_BADGE_COLLECTION_ID,
        packageId: TESTNET_PACKAGE_ID,
        platformStateId: TESTNET_PLATFORM_STATE_ID,
        treasuryCapId: TESTNET_TREASURY_CAP_ID,
        coinMetadataId: TESTNET_COIN_METADATA_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        badgeCollectionId: MAINNET_BADGE_COLLECTION_ID,
        packageId: MAINNET_PACKAGE_ID,
        platformStateId: MAINNET_PLATFORM_STATE_ID,
        treasuryCapId: MAINNET_TREASURY_CAP_ID,
        coinMetadataId: MAINNET_COIN_METADATA_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };

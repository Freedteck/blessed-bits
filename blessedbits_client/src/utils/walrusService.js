import toast from "react-hot-toast";
import { pinataConfig } from "../config/pinataConfig";

const WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";

export const uploadFile = async (file, sendToAddress = "") => {
  if (!file) {
    throw new Error("No file provided");
  }

  const toastId = toast.loading(`Uploading ${file.name}...`);

  try {
    // Try primary upload service first
    const url = await uploadFileToPrimary(file, sendToAddress);
    toast.success(`Successfully uploaded ${file.name}`, { id: toastId });
    return url;
  } catch (primaryError) {
    console.log("Primary upload failed, trying fallback...", primaryError);

    try {
      // If primary fails, try fallback service
      const url = await uploadFileToFallback(file);
      toast.success(`Successfully uploaded ${file.name}`, { id: toastId });
      return url;
    } catch (fallbackError) {
      toast.error(`Failed to upload ${file.name}`, { id: toastId });
      throw new Error(`Upload failed: ${fallbackError.message}`);
    }
  }
};

export const uploadMultipleFiles = async (files, sendToAddress = "") => {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  const toastId = toast.loading(`Uploading ${files.length} files...`);

  try {
    // Try primary upload service first
    const urls = await uploadMultipleToPrimary(files, sendToAddress);
    toast.success(`Successfully uploaded ${files.length} files`, {
      id: toastId,
    });
    return urls;
  } catch (primaryError) {
    console.log(
      "Primary multiple upload failed, trying fallback...",
      primaryError
    );

    try {
      // If primary fails, try fallback service
      const urls = await uploadMultipleToFallback(files);
      toast.success(`Successfully uploaded ${files.length} files`, {
        id: toastId,
      });
      return urls;
    } catch (fallbackError) {
      toast.error(`Failed to upload files`, { id: toastId });
      throw new Error(`Multiple upload failed: ${fallbackError.message}`);
    }
  }
};

const uploadFileToPrimary = async (file, sendToAddress = "") => {
  const numEpochs = 50;
  const sendToParam = sendToAddress ? `&send_object_to=${sendToAddress}` : "";

  const response = await fetch(
    `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${numEpochs}${sendToParam}`,
    {
      method: "PUT",
      body: file,
    }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to upload: ${response.statusText}`);
  }

  const data = await response.json();

  let blobId;
  if ("alreadyCertified" in data) {
    blobId = data.alreadyCertified.blobId;
  } else if ("newlyCreated" in data) {
    blobId = data.newlyCreated.blobObject.blobId;
  } else {
    throw new Error("Unexpected response format");
  }

  return `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`;
};

const uploadMultipleToPrimary = async (files, sendToAddress = "") => {
  const numEpochs = 50;
  const sendToParam = sendToAddress ? `&send_object_to=${sendToAddress}` : "";

  const uploadPromises = files.map((file) =>
    fetch(
      `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${numEpochs}${sendToParam}`,
      {
        method: "PUT",
        body: file,
      }
    )
  );

  const responses = await Promise.all(uploadPromises);

  // Check if any responses failed
  const failedResponse = responses.find((response) => response.status !== 200);
  if (failedResponse) {
    throw new Error(`Failed to upload: ${failedResponse.statusText}`);
  }

  const blobUrls = await Promise.all(
    responses.map(async (response) => {
      const data = await response.json();

      let blobId;
      if ("alreadyCertified" in data) {
        blobId = data.alreadyCertified.blobId;
      } else if ("newlyCreated" in data) {
        blobId = data.newlyCreated.blobObject.blobId;
      } else {
        throw new Error("Unexpected response format");
      }

      return `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`;
    })
  );

  return blobUrls;
};

const uploadFileToFallback = async (file) => {
  const gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY_URL;

  const fileData = await pinataConfig.upload.public.file(file);
  const fileCid = fileData.cid;

  return `https://${gatewayUrl}/ipfs/${fileCid}`;
};

const uploadMultipleToFallback = async (files) => {
  const gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY_URL;

  const uploadPromises = files.map((file) =>
    pinataConfig.upload.public.file(file)
  );

  const fileDataArray = await Promise.all(uploadPromises);

  const fileUrls = fileDataArray.map((fileData) => {
    const fileCid = fileData.cid;
    return `https://${gatewayUrl}/ipfs/${fileCid}`;
  });

  return fileUrls;
};

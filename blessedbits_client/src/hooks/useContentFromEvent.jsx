import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

const useContentFromEvents = (eventsData) => {
  const [objectIds, setObjectIds] = useState([]);
  const [timestampMs, setTimeStampMs] = useState([]);
  const [contentList, setContentList] = useState([]);

  // Process events data to extract object IDs and timestamps
  useEffect(() => {
    if (eventsData) {
      const ids = eventsData.map((event) => event.parsedJson.video_id);
      const timestamps = eventsData.map((event) => event.timestampMs);
      setObjectIds(ids);
      setTimeStampMs(timestamps);
    }
  }, [eventsData]);

  // Fetch the actual content objects
  const {
    data: contentData,
    isPending,
    refetch,
  } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: objectIds,
      options: {
        showType: true,
        showOwner: true,
        showPreviousTransaction: false,
        showDisplay: false,
        showContent: true,
        showBcs: false,
        showStorageRebate: false,
      },
    },
    {
      enabled: objectIds.length > 0,
    }
  );

  // Combine content data with timestamps
  useEffect(() => {
    if (contentData && timestampMs.length > 0) {
      const contentWithTimestamp = contentData.map((content, index) => {
        return {
          ...content,
          timestampMs: timestampMs[index] || 0,
        };
      });
      setContentList(contentWithTimestamp);
    }
  }, [contentData, timestampMs]);

  return { contentList, isPending, objectIds, timestampMs, refetch };
};

export default useContentFromEvents;

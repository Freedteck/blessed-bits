import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";

export const useQueryEvents = ({
  packageId,
  eventType,
  filters = {},
  queryOptions = {},
}) => {
  const { contentType, userAddress, sender } = filters;

  return useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${packageId}::blessedbits::${eventType}`,
      },
      cursor: null,
    },
    {
      ...queryOptions,
      select: (data) => {
        let events = data.pages.flatMap((page) => page.data);

        if (contentType !== undefined) {
          events = events.filter(
            (x) => x.parsedJson.content_type === contentType
          );
        }

        if (userAddress) {
          events = events.filter(
            (x) => x.parsedJson.user_address === userAddress
          );
        }

        if (sender) {
          events = events.filter((x) => x.sender === sender);
        }

        return events;
      },
    }
  );
};

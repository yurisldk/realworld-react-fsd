import { InfiniteData } from '@tanstack/react-query';

export function infinityQueryDataUpdater<D, K extends keyof D>(config: {
  id: K;
  data?: D;
}): (
  infinityData?: InfiniteData<D[]>,
) => InfiniteData<D[], unknown> | undefined {
  const { id, data } = config;

  return (
    infinityData?: InfiniteData<D[]>,
  ): InfiniteData<D[], unknown> | undefined => {
    if (!infinityData || !data) return;

    const dataOrderIdx = infinityData.pages
      .flat()
      .findIndex((item) => item[id] === data[id]);

    if (dataOrderIdx === -1) return infinityData;

    const pageLength = infinityData.pages[0].length;
    const [pageIdx, dataIdx] = [
      Math.floor(dataOrderIdx / pageLength),
      dataOrderIdx % pageLength,
    ];

    const updatedInfinityData: InfiniteData<D[]> = {
      pages: [
        ...infinityData.pages.slice(0, pageIdx),
        [
          ...infinityData.pages[pageIdx].slice(0, dataIdx),
          data,
          ...infinityData.pages[pageIdx].slice(dataIdx + 1),
        ],
        ...infinityData.pages.slice(pageIdx + 1),
      ],

      pageParams: [...infinityData.pageParams],
    };

    return updatedInfinityData;
  };
}

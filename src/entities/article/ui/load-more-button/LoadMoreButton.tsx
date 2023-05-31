type LoadMoreButtonProps = {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  onClick: VoidFunction;
};

export function LoadMoreButton(props: LoadMoreButtonProps) {
  const { hasNextPage, isFetchingNextPage, onClick } = props;
  return (
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={onClick}
      disabled={!hasNextPage || isFetchingNextPage}
      type="button"
    >
      {isFetchingNextPage ? 'Loading more...' : 'Load More'}
    </button>
  );
}

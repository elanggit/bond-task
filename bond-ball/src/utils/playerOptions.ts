const getPlayerOptions = (
  playersPerPage: number,
  page: number,
  searchTerm = '',
  cursor: number | null | undefined
) => {
  const params: {
    limit: number;
    page: number;
    search?: string;
    cursor?: number | null;
  } = {
    limit: playersPerPage,
    page,
  };
  if (searchTerm.length > 1) params.search = searchTerm;
  if (cursor) params.cursor = cursor;
  return { params };
};

const getFavoritePlayerOptions = (userId: number) => ({ params: { userId: userId } });

export { getFavoritePlayerOptions, getPlayerOptions} ;

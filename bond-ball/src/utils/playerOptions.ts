const getPlayerOptions = (
  playersPerPage,
  page,
  searchTerm = '',
  cursor
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

const getFavoritePlayerOptions = (user_id) => ({ params: { user_id: user_id } });

export { getFavoritePlayerOptions, getPlayerOptions} ;

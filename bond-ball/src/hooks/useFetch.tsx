import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

type FetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export function useFetch<T>(url: string, options?: AxiosRequestConfig) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ data: null, error: null, loading: true });
      try {
        const response = await axios.get(url, options);
        setState({ data: response.data, error: null, loading: false });
      } catch (error) {
        setState({
          data: null,
          error: error instanceof Error ? error.message : 'An error occurred',
          loading: false,
        });
      }
    };

    fetchData();
  }, [url, options]);

  return state;
}

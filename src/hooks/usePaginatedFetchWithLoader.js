import { useState, useEffect, useContext } from "react";
import { LoadingBarContext } from "../App";
import api from "../components/api/api";

export default function usePaginatedFetchWithLoader(url, perPage = 10) {
  const { startLoading, completeLoading } = useContext(LoadingBarContext);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      startLoading();
      const response = await api.get(`${url}?page=${page}&per_page=${perPage}`);
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (err) {
      console.error("Pagination API Error:", err);
      setError(err);
    } finally {
      setLoading(false);
      completeLoading();
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [url]);

  return {
    data,
    currentPage,
    lastPage,
    error,
    loading,
    fetchData, // for pagination navigation
    setData,   // for local updates like delete
  };
}

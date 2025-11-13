import { useContext, useEffect, useState } from "react";
import { LoadingBarContext } from "../App";
import api from "../components/api/api";

export default function useFetchWithLoader(url, options = {}) {
  const { startLoading, updateLoading, completeLoading } = useContext(LoadingBarContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    startLoading();

    api.get(url, options)
      .then((res) => {
        updateLoading(70); // mid-progress
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err);
      })
      .finally(() => {
        setTimeout(() => {
          completeLoading(); // ensures 100% completion
        }, 300);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, error };
}

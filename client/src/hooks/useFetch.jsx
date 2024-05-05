import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";

const useFetch = (url, method = "GET", bodyData = null, canFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useData();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data from", url);
      setLoading(true);

      try {
        let options = {
          method,
          headers: {
            Authorization: `${token}`,
          },
          body: bodyData ? JSON.stringify(bodyData) : null,
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (canFetch) {
      fetchData();
    }

    // Cleanup function to cancel fetch on component unmount
    return () => {};
  }, [url, canFetch]);

  return { data, loading, error };
};

export default useFetch;

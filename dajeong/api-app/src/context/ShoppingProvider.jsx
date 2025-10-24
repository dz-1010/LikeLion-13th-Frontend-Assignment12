import { createContext, useContext, useState } from "react";
import axios from "axios";

const ShoppingContext = createContext();

export function ShoppingProvider({ children }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShoppingData = async (requestBody) => {
    setLoading(true);
    setError(null);
    setChartData(null);

    try {
      const response = await axios.post(
        "/v1/datalab/shopping/category/keyword/age",
        requestBody,
        {
          headers: {
            "X-Naver-Client-Id": import.meta.env.VITE_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": import.meta.env.VITE_NAVER_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
        }
      );
      setChartData(response.data.results);
    } catch (e) {
      if (e.response) {
        setError(
          `API 오류 (Status ${e.response.status}): ${e.response.data.errorMessage}`
        );
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    chartData,
    loading,
    error,
    fetchShoppingData,
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("Cannot use useShopping outside of ShoppingProvider");
  }
  return context;
}

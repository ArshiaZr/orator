"use client";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const addAlert = ({ message, type, time = 3000 }) => {
    let tmp = [...alerts];
    message = message.toString();
    tmp.push({
      message,
      type,
      time,
    });
    setAlerts(tmp);
  };

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  let userFetched = false;
  useEffect(() => {
    if (
      !localStorage.getItem("token") &&
      !token &&
      !userFetched &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup" &&
      window.location.pathname !== "/"
    ) {
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        addAlert,
        alerts,
        setAlerts,
        saveToken,
        token,
        setLoadingModal,
        loadingModal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

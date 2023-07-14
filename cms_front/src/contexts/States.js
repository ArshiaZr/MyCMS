import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Context = createContext();

export function AppStates({ children }) {
  const router = useRouter();

  const [alerts, setAlerts] = useState([]);
  const [token, setToken] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [activeSidebar, setActiveSidebar] = useState("");
  const [sidebarShow, setSidebarShow] = useState(true);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    if (localStorage.getItem("auth token")) {
      setToken(localStorage.getItem("auth token"));
    }
    if (localStorage.getItem("admin")) {
      setAdmin(JSON.parse(localStorage.getItem("admin")));
    }
  }, []);

  const getAdmin = () => {
    axios
      .get(`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/admins/self`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        if (res.data.admin) {
          setAdmin(res.data.admin);
          let toString = JSON.stringify(res.data.admin);
          if (toString !== localStorage.getItem("admin")) {
            localStorage.setItem("admin", toString);
          }
        }
      })
      .catch((err) => {
        addAlert({
          message: "Something went wrong. Reload.",
          type: "error",
          time: 3000,
        });
      });
  };

  const addAlert = ({ message, type, time }) => {
    let tmp = [...alerts];
    tmp.push({
      message,
      type,
      time,
    });
    setAlerts(tmp);
  };

  const logout = () => {
    setAdmin({});
    setToken("");
    if (localStorage.getItem("auth token")) {
      localStorage.removeItem("auth token");
    }
    if (localStorage.getItem("admin")) {
      localStorage.removeItem("admin");
    }
    router.push("/login");
  };

  return (
    <Context.Provider
      value={{
        alerts,
        setAlerts,
        addAlert,
        token,
        setToken,
        resetToken,
        setResetToken,
        activeSidebar,
        setActiveSidebar,
        sidebarShow,
        setSidebarShow,
        admin,
        setAdmin,
        getAdmin,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAppStatesContext() {
  return useContext(Context);
}

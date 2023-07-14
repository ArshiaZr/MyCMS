import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAppStatesContext } from "@/contexts/States";

import styles from "../styles/Dashboard.module.scss";

export default function Dashboard() {
  const { push } = useRouter();

  const { token, setActiveSidebar, sidebarShow, admin } = useAppStatesContext();

  useEffect(() => {
    if (token === "" && !localStorage.getItem("auth token")) {
      push("/login");
    } else if (!admin.verified) {
      push("/complete");
    }
  }, [token]);

  useEffect(() => {
    setActiveSidebar("dashboard");
  }, [token]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main id={`${styles.mainPage} ${!sidebarShow ? styles.full : ""}`}></main>
    </>
  );
}

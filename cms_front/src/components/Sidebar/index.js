import { useState } from "react";
import styles from "../../styles/components/Sidebar.module.scss";
import { useAppStatesContext } from "@/contexts/States";

export default function Sidebar({ children }) {
  // const [toggled, setToggled] = useState(true);

  const { setSidebarShow, sidebarShow } = useAppStatesContext();

  return (
    <aside
      id={styles.sidebar}
      className={`${sidebarShow ? styles.toggled : ""}`}
    >
      <div className={styles.sectionsWrapper}>{children}</div>
      <div
        className={`${styles.toggle} ${sidebarShow ? styles.toggled : ""}`}
        onClick={() => {
          setSidebarShow(!sidebarShow);
        }}
      >
        <img src="/icons/downIconThickDark.svg" alt="toggle sidebar" />
      </div>
      <a
        href="https://versall.ca"
        target="_blank"
        className={`${styles.poweredby} ${sidebarShow ? styles.toggled : ""}`}
      >
        Powered by <img src="/versall.svg" alt="Versall inc." />
      </a>
    </aside>
  );
}

import { useState } from "react";
import styles from "../../styles/components/SidebarItem.module.scss";
import { useAppStatesContext } from "@/contexts/States";
import { useRouter } from "next/router";

export default function SidebarItem({ title, icon, icon1, count, link = "/" }) {
  const { activeSidebar, setActiveSidebar } = useAppStatesContext();

  const { push } = useRouter();

  const onClick = () => {
    if (activeSidebar !== title) {
      setActiveSidebar(title);
      push(link);
    }
  };

  return (
    <div
      className={`${styles.sidebarItem} ${
        activeSidebar == title ? styles.active : ""
      }`}
      onClick={onClick}
    >
      <div className={styles.left}>
        <div className={styles.iconWrapper}>
          <img src={icon} alt={title} />
          <img src={icon1} alt={title} />
        </div>
        <div className={styles.titleWrapper}>
          {title.length >= 24 ? title.substr(0, 21) + "..." : title}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.countWrapper}>
          <span>{count}</span>
        </div>
      </div>
    </div>
  );
}

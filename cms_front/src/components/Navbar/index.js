import { useAppStatesContext } from "@/contexts/States";
import styles from "../../styles/components/Navbar.module.scss";
import { MdOutlineExpandMore, MdExpandLess } from "react-icons/md";
import { useState } from "react";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function Navbar() {
  const { admin, logout } = useAppStatesContext();
  const [showList, setShowList] = useState(false);

  return (
    <div id={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.profileWrapper}>
          <div className={styles.imageWrapper}>
            <img
              src={`${publicRuntimeConfig.SERVER_MANAGEMENT_URL}/images/admin/${admin.image}`}
              alt={admin.username}
            />
          </div>
          <div style={{ position: "relative" }}>
            <p>
              Welcome {admin.username}!
              {showList ? (
                <MdExpandLess
                  onClick={() => setShowList(false)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <MdOutlineExpandMore
                  onClick={() => setShowList(true)}
                  style={{ cursor: "pointer" }}
                />
              )}
            </p>
            <ul
              className={`${styles.profileList} ${showList ? styles.show : ""}`}
            >
              <li onClick={() => logout()}>Log Out</li>
            </ul>
          </div>
        </div>
        <a
          href="https://nhqueens.com"
          target="_blank"
          className={styles.logoWrapper}
        >
          <img alt="NH Qheeens" src="/NHLogo.svg" />
        </a>
      </div>
      <div className={styles.right}>
        <div className={styles.iconsWrapper}>
          <div className={`${styles.icon} ${styles.notifications}`}>
            <div className={styles.iconWrapper}>
              <img src="/icons/notifications.svg" alt={admin.username} />
            </div>
          </div>
          <div className={`${styles.icon} ${styles.chats}`}>
            <div className={styles.iconWrapper}>
              <img src="/icons/chats.svg" alt={admin.username} />
            </div>
          </div>
          <div className={`${styles.icon} ${styles.admins}`}>
            <div className={styles.iconWrapper}>
              <img src="/icons/people.svg" alt={admin.username} />
            </div>
          </div>
          <div className={`${styles.icon} ${styles.statistics}`}>
            <div className={styles.iconWrapper}>
              <img src="/icons/statistics.svg" alt={admin.username} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

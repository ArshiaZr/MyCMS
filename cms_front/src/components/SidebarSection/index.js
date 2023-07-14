import styles from "../../styles/components/SidebarSection.module.scss";

export default function SidebarSection({ title, children }) {
  return (
    <div className={styles.sidebarSection}>
      <div className={styles.titleWrapper}>
        <p>{title}</p>
      </div>
      <div className={styles.itemsWrapper}>{children}</div>
    </div>
  );
}

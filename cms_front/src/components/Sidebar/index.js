import styles from "../../styles/components/Sidebar.module.scss";

export default function Sidebar({ children }) {
  return (
    <aside id={styles.sidebar}>
      <div className={styles.sectionsWrapper}>{children}</div>
      <a href="https://vima.team" target="_blank" className={styles.poweredby}>
        Powered by <img src="/icons/VIMA_logo.svg" alt="" />
      </a>
    </aside>
  );
}

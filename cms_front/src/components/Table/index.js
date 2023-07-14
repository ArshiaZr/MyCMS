import styles from "../../styles/components/Table.module.scss";

export default function Table({ tableWidth = "100%", children }) {
  return (
    <div className={styles.tableWrapper} style={{ width: tableWidth }}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

import styles from "../../styles/components/Table.module.scss";

export default function Table({
  tableWidth = "100%",
  marginTop = "3rem",
  children,
}) {
  return (
    <div
      className={styles.tableWrapper}
      style={{ width: tableWidth, marginTop: marginTop }}
    >
      <table className={styles.table}>{children}</table>
    </div>
  );
}

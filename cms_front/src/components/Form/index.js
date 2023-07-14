import styles from "../../styles/components/Form.module.scss";

export default function Form({
  children,
  onSubmit,
  alignment = "vertical",
  alignItems = "center",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`${styles.form} ${
        alignment === "horizontal" ? styles.horiz : styles.vert
      }`}
      style={{ alignItems: alignItems }}
    >
      {children}
    </form>
  );
}

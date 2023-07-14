import styles from "../../styles/components/ItemsWrapper.module.scss";

export default function ItemsWrapper({ children }) {
  return <div id={styles.itemsWrapper}>{children}</div>;
}

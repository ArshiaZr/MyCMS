import { useState } from "react";
import styles from "../../styles/components/Sortby.module.scss";
import { camelToNormal } from "@/utils/parse";

export default function Sortby({
  sortSelected = "",
  SetSortSelected = () => {},
  options = [],
}) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className={styles.orderby}>
      <div
        className={styles.title}
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Order by:{" "}
        <div className={styles.selected}>{camelToNormal(sortSelected)}</div>
        <div
          className={`${styles.iconWrapper} ${toggle ? styles.toggled : ""}`}
        >
          <img src="/icons/downIconThickDark.svg" alt="order by" />
        </div>
      </div>
      <div className={`${styles.options} ${toggle ? styles.toggled : ""}`}>
        {options.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`${styles.option} ${
                sortSelected == item ? styles.selected : ""
              }`}
              onClick={() => {
                SetSortSelected(item);
                setToggle(false);
              }}
            >
              {camelToNormal(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

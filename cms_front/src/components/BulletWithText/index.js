import { useState } from "react";
import styles from "../../styles/components/BulletWithText.module.scss";

export default function BulletWithText({ text, onChange, name }) {
  const [value, setValue] = useState(false);
  return (
    <div
      className={styles.bulletWithText}
      onClick={() => {
        setValue(!value);
        let e = {};
        e.target = { name: name, value: !value };
        onChange(e);
      }}
    >
      <div className={styles.outerCircle}>
        <div
          className={`${styles.innerCircle} ${value ? styles.active : ""}`}
        ></div>
      </div>
      <p>{text}</p>
    </div>
  );
}

import styles from "../../styles/components/TextArea.module.scss";

import { useEffect, useRef } from "react";

export default function TextArea({
  originalValue,
  onChange,
  name,
  error = "",
  interprets = {},
}) {
  const ref = useRef(null);

  const interpret = (value) => {
    let tmp = value;
    let keys = Object.keys(interprets);
    for (let i = 0; i < keys.length; i++) {
      tmp = tmp.replaceAll(keys[i], interprets[keys[i]]);
    }
    return tmp;
  };

  const reverseInterpret = (value) => {
    let tmp = value;
    let keys = Object.keys(interprets);
    for (let i = 0; i < keys.length; i++) {
      tmp = tmp.replaceAll(interprets[keys[i]], keys[i]);
    }
    return tmp;
  };

  useEffect(() => {
    ref.current.value = reverseInterpret(originalValue);
  }, [ref, originalValue]);

  return (
    <div className={styles.textInputWrapper}>
      <div className={styles.container}>
        <textarea
          className={styles.textInput}
          onChange={(e) => {
            e.target.value = interpret(e.target.value);
            onChange(e);
          }}
          name={name}
          ref={ref}
        />
      </div>
      <span
        className={styles.error}
        style={{ display: error.length > 0 ? "inline-block" : "none" }}
      >
        {error}
      </span>
    </div>
  );
}

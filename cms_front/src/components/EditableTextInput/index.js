import styles from "../../styles/components/EditableTextInput.module.scss";

import { useEffect, useRef } from "react";

export default function EditableTextInput({
  originalValue,
  onChange,
  name,
  error = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.value = originalValue;
  }, [ref, originalValue]);

  return (
    <div className={styles.textInputWrapper}>
      <div className={styles.container}>
        <input
          type="text"
          className={styles.textInput}
          onChange={onChange}
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

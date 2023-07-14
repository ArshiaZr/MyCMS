import styles from "../../styles/components/PasswordInput.module.scss";
import { useState } from "react";

export default function PasswordInput({
  placeholder,
  onChange,
  openedIcon,
  lockedIcon,
  name,
  error = "",
}) {
  const [toggle, setToggle] = useState(true);
  return (
    <div className={styles.passwordInputWrapper}>
      <div className={styles.container}>
        <input
          type={toggle ? "password" : "text"}
          className={styles.passwordInput}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
        />
        <div className={styles.iconWrapper} onClick={() => setToggle(!toggle)}>
          {toggle ? (
            <img src={lockedIcon} alt={`input-${placeholder}`} />
          ) : (
            <img src={openedIcon} alt={`input-${placeholder}`} />
          )}
        </div>
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

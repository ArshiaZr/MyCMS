import styles from "../../styles/components/TextInput.module.scss";

export default function TextInput({
  placeholder = "",
  onChange,
  icon,
  onIconClick,
  name,
  error = "",
}) {
  return (
    <div className={styles.textInputWrapper}>
      <div className={styles.container}>
        <input
          type="text"
          className={styles.textInput}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
        />
        <div className={styles.iconWrapper} onClick={onIconClick}>
          <img src={icon} alt={`input-${placeholder}`} />
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

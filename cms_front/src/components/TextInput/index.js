import styles from "../../styles/components/TextInput.module.scss";

export default function TextInput({
  placeholder = "",
  onChange,
  icon,
  onIconClick,
  name,
  error = "",
  maxWidth = "",
  direction = "normal",
  background,
  borderRadius,
}) {
  return (
    <div
      className={styles.textInputWrapper}
      style={{ maxWidth: maxWidth != "" ? maxWidth : "18rem" }}
    >
      <div
        className={styles.container}
        style={{
          flexDirection: direction == "normal" ? "row" : "row-reverse",
          background: background ? background : "",
          borderRadius: borderRadius ? borderRadius : "",
        }}
      >
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

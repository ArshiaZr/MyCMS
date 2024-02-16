import styles from "../../styles/components/Select.module.scss";

export default function Select({
  showingTitle,
  title,
  options,
  onChange,
  error = "",
  titleShow = false,
  defaultValue = "",
  border = false,
  center = false,
  placeholder = "",
  width,
}) {
  return (
    <div
      className={`${styles.selectWrapper} ${center ? styles.center : ""}`}
      style={{ width: width ? width : "" }}
    >
      <p className={`${styles.title} ${titleShow ? styles.show : ""}`}>
        {showingTitle}
      </p>
      <div className={styles.container}>
        <select
          className={`${styles.select} ${border ? styles.border : ""}`}
          name={title}
          onChange={onChange}
        >
          <option value="" disabled selected>
            {placeholder}
          </option>
          {options.map((option, idx) => {
            return (
              <option
                selected={option === defaultValue}
                key={idx}
                value={option}
              >
                {option}
              </option>
            );
          })}
        </select>
        <span
          className={styles.error}
          style={{ display: error.length > 0 ? "inline-block" : "none" }}
        >
          {error}
        </span>
      </div>
    </div>
  );
}

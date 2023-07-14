import styles from "../../styles/components/Select.module.scss";

export default function Select({
  showingTitle,
  title,
  options,
  onChange,
  error = "",
  titleShow = true,
  defaultValue = "",
  backgroundColor = "rgba(227, 227, 227, 0.2)",
  border = false,
  center = false,
}) {
  return (
    <div className={`${styles.selectWrapper} ${center ? styles.center : ""}`}>
      <p className={`${styles.title} ${titleShow ? styles.show : ""}`}>
        {showingTitle}
      </p>
      <div className={styles.container}>
        <select
          className={`${styles.select} ${border ? styles.border : ""}`}
          name={title}
          onChange={onChange}
          style={{ background: backgroundColor }}
        >
          <option value=""></option>
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

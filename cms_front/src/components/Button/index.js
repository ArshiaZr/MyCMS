import { useState } from "react";
import styles from "../../styles/components/Button.module.scss";

export default function Button({
  type,
  text,
  color,
  hoverColor,
  backgroundColor,
  hoverBackgroundColor,
  width,
  marginTop = "0",
  maxWidth,
  minWidth,
  icon,
  borderRadius,
  onClick = null,
}) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  return (
    <button
      type={type}
      className={styles.button}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        background: isHover ? hoverBackgroundColor : backgroundColor,
        color: isHover ? color : hoverColor,
        marginTop: marginTop,
        maxWidth: maxWidth ? maxWidth : "",
        minWidth: minWidth ? minWidth : "",
        borderRadius: borderRadius ? borderRadius : "",
        width: width ? width : "",
      }}
    >
      {text}
      {icon ? <img src={icon} alt={text} /> : ""}
    </button>
  );
}

import { useState } from "react";
import styles from "../../styles/components/Button.module.scss";

export default function Button({
  type,
  text,
  color,
  hoverColor,
  backgroundColor,
  hoverBackgroundColor,
  width = "100%",
  marginTop = "0",
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
      style={{
        background: isHover ? hoverBackgroundColor : backgroundColor,
        color: isHover ? color : hoverColor,
        width: width,
        marginTop: marginTop,
      }}
    >
      {text}
    </button>
  );
}

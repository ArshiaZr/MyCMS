import Link from "next/link";
import styles from "../../styles/components/SubLink.module.scss";

export default function SubLink({ text, link, color }) {
  return (
    <div className={styles.subLink}>
      <Link href={link} style={{ color: color }}>
        {text}
      </Link>
    </div>
  );
}

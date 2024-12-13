import Link from "next/link";
import styles from "./page.module.css";


export default function Page() {
  return (
    <div className={styles.linkContainer}>
      <Link href={"/json/123"}>123</Link>
      <Link href={"/json/124"}>124</Link>
      <Link href={"/json/125"}>125</Link>
      <Link href={"/json/126"}>126</Link>
    </div>
  );
}

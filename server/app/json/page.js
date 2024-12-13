import Link from "next/link";
import styles from "./page.module.css";


export default function Page() {
  return (
    <div className={styles.linkContainer}>
      <Link href={"/json/123th"}>123</Link>
      <Link href={"/json/124th"}>124</Link>
      <Link href={"/json/125th"}>125</Link>
      <Link href={"/json/126th"}>126</Link>
    </div>
  );
}

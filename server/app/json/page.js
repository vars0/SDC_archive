import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  const perform = Array.from(
    { length: 127 - 118 + 1 },
    (_, index) => 127 - index
  );

  return (
    <div className={styles.linkTopContainer}>
      <div className={styles.linkContainer}>
        {perform.map((number) => (
          <Link key={number} href={`/json/${number}th`} className={styles.link}>
            {`${number}회 대공연`}
          </Link>
        ))}
      </div>
      <div className={styles.linkContainer}>
        <Link href={"/json/W55thHssc"} className={styles.link}>
          55회 명륜 워크샵
        </Link>
        <Link href={"/json/W55thNsc"} className={styles.link}>
          55회 율전 워크샵
        </Link>
        <Link href={"/json/W54th"} className={styles.link}>
          54회 워크샵
        </Link>
        <Link href={"/json/W53th"} className={styles.link}>
          53회 워크샵
        </Link>
        <Link href={"/json/W52th"} className={styles.link}>
          52회 워크샵
        </Link>
        <Link href={"/json/W51thHssc"} className={styles.link}>
          51회 명륜 워크샵
        </Link>
        <Link href={"/json/W50thNsc"} className={styles.link}>
          50회 율전 워크샵
        </Link>
        <Link href={"/json/W49thHssc"} className={styles.link}>
          49회 명륜 워크샵
        </Link>
        <Link href={"/json/W49thNsc"} className={styles.link}>
          49회 율전 워크샵
        </Link>
      </div>
    </div>
  );
}

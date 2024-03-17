import Head from 'next/head';
import LifeTable from '../components/LifeTable';
import { DateTime } from 'luxon';
import styles from '../styles/Home.module.css';

export default function Home() {
  const highlightCriteria = [
    {
      date: DateTime.now().toISODate(),
      color: 'red', // Highlight the current week in red
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Anand's Life in Weeks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://anandvalavalkar.com">Anand's Life in Weeks</a>
        </h1>

        <p className={styles.description}>
          An experiment in mortality.
        </p>

        <LifeTable birthday="2001-12-14" highlightCriteria={highlightCriteria} />
      </main>

      <footer className={styles.footer}>
        <p>
          *Years have been normalized to 52 weeks (the last week of the year contains the extra 1-2 days)
          <br /><br />
          Inspired by Life In Weeks and the Tail End by WaitButWhy
        </p>
      </footer>
    </div>
  );
}

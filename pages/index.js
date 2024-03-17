import Head from 'next/head';
import styles from '../styles/Home.module.css';
import LifeTable from '../components/LifeTable';
import Week from '../components/Week';
import { DateTime } from 'luxon';

const highlightCriteria = [
  {
    date: DateTime.now().toISODate(),
    color: 'red' // Assuming you want the current week to be highlighted in red
  }
];


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Anand's Life in Weeks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          <a href="https://anandvalavalkar.com">Anand's</a> Life in Weeks
        </h1>


        <p className={styles.description}>
		  An experiment in mortality.
        </p>

		 <LifeTable birthday="2001-12-14" highlightCriteria={highlightCriteria}/>
      </main>





      <footer>


			<p>*years have been normalized to 52 weeks (the last week of the year contains the extra 1-2 days)
			 <br /><br /><br />inspired by Life In Weeks and the Tail End by WaitButWhy</p>

      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

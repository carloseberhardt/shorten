import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

function Form() {
  const router = useRouter()
  const shortenLink = async event => {
    event.preventDefault()
    router.push({
      pathname: "/api/shorten",
      query: {
        u: event.target.URL.value,
        q: event.target.Query.value,
        v: event.target.Variables.value
      }
    })
  }
  return (
    <p className={styles.Form}>
    <form onSubmit={shortenLink} style={{display:'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
      <label htmlFor="URL">URL</label>
      <input style={{height: '20px', width: '400px', margin: '6px'}} id="URL" type="text" autoComplete="URL" required /><br/>
      <label htmlFor="Query">Query</label>
      <textarea style={{height: '180px', width: '400px', margin: '6px'}} id="Query" type="text" autoComplete="Query" required /><br/>
      <label htmlFor="Variables">Variables</label>
      <textarea style={{height: '80px', width: '400px', margin: '6px'}} id="Variables" type="text" autoComplete="Variables" /><br/>
      <br/><button type="submit">Shorten</button>
    </form></p>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Shorten</title>
        <meta name="description" content="shorten try graphiqls" />
        <link rel="icon" href="//stepzen.com/images/favicon/favicon-32x32.png" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          Sharing Shorter is Caring More
        </p>

        <Form></Form>

      </main>

    </div>
  )
}

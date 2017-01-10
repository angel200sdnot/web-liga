import Footer from '../components/footer'
import Head from 'next/head'
import Header from '../components/header'
import Link from 'next/link'

export default ({ children, title = 'This is the default title', user }) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>

    <Header user={user}/>
      { children }
    <Footer user={user}/>
  </div>
)
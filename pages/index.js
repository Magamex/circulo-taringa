import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'

const axios = require('axios');

export default function Home({initialId,onSave}) {
  // const router = useRouter()
  const [newId, setNewId] = useState(initialId)
  const [showMe, setShowMe] = useState(false)
  const [hideButton, setHideButton] = useState(false)
  const [imgRes, setImgRes] = useState('')
  const [msgStatus, setmsgStatus] = useState('Al ingresar el usuario se generar una imagen con todos los usuarios que te rodean')

  const handleClick = async(e, path) => {
   e.preventDefault()

    if (path === "/api/imagen") {
      setmsgStatus('Generando imagen...')
      setHideButton(true)
      try {
        const post_res = await axios.get(`/api/imagen?user=${newId}`);
        setShowMe(!showMe);
        setImgRes(post_res.data.img)
      }catch(err){
        setmsgStatus(err)
        return 404
      }
    }
  };

  return (
    
    <div className={styles.container}>
      <Head>
        <title>Circulo Taringuero</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{display: showMe?"none":"block"}}>

          <h1 className={styles.title}>
            Circulo <a href="https://taringa.net">Taringuero</a> 
          </h1>

          <p className={styles.description}>
            Mira los usuarios que te rodean!!!
          </p>

          <div id="cuerpo">
            <div className={styles.description}>
              <input className={styles.code} type="text" onChange={(e) => setNewId(e.target.value)}  placeholder="Ingresar Usuario"/>
            </div>
            <br/>
            <div className={styles.description} style={{display: hideButton?"none":"block"}}>
              <button className={styles.btn} onClick={(e) => handleClick(e, "/api/imagen")}>Generar</button>
            </div>
          </div>

          <div className={styles.card}>{msgStatus}</div>

        </div>
      
        <div className={styles.description} style={{display: showMe?"block":"none"}}>
          <br/>
          <div className={styles.title}>{newId}</div>
          <hr/>
          <div className={styles.description}>
            <img className={styles.size} src={imgRes}/>
          </div>
          <a className={styles.btn} href="http://localhost:3000">Volver</a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://www.taringa.net/22matutex22" target="_blank" rel="noopener noreferrer">
          Created by 22matutex22
        </a>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

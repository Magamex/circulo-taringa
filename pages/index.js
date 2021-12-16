import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState} from 'react';
import Router from 'next/router';

const axios = require('axios');

export default function Home({initialId,onSave}) {
  // const router = useRouter()
  const [newId, setNewId] = useState(initialId)
  const [showMe, setShowMe] = useState(false)
  const [hideButton, setHideButton] = useState(false)
  const [respTable, setRespTable] = useState('')
  const [msgStatus, setmsgStatus] = useState('Al ingresar el usuario se genera una tabla por nivel con todos los usuarios que te rodean')

  const handleClick = async(e, path) => {
    e.preventDefault()

    if (path === "/api/imagen") {
      setmsgStatus('Investigando...')
      setHideButton(true)
      try {
        const user_res = await axios.get(`/api/usuario?user=${newId}`);
        console.log(user_res.data);
        const post_res = await axios.post(`/api/test`,user_res.data);
        console.log(post_res.data);
        setShowMe(!showMe);
        setRespTable(`${post_res.data.code}`)
      }catch(err){
        setmsgStatus('No se encontro el usuario o No genera contenido')
        setHideButton(false)
      }
    }
  };

  return (
    
    <div className={styles.container}>
      <Head>
        <title>Circulo Taringuero</title>
        <meta name="description" content="Mini Proyecto similar a chirpty utilizando la tecnología NextJS y la API de Taringa.
Al ingresar un usuario visualizas en diferentes niveles los usuarios que te rodean, de mayor actividad a menor actividad."></meta>
        <meta name="author" content="Matias Angeluk"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{display: showMe?"none":"block"}}>

          <div className={styles.description}>
            <img src="/circulotaringuero.png"/>
          </div>

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
          <div className={styles.card} dangerouslySetInnerHTML={{ __html: respTable}}></div>
          <br/>
          <a className={styles.btn} href="https://circulo-taringa.vercel.app/">Volver</a>
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

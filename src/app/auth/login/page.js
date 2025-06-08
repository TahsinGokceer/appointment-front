'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import api from "../../../../lib/api"

export default function Login() {
    const router = useRouter()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/auth/login", { email, password })
            console.log(response.data.user);
            console.log("11111111111");            
            router.push("/dashboard")
            console.log("22222222222");
            
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message);

                setTimeout(() => {
                    setError(null)
                }, 3000)
            } else {
                setError("Sunucu hatası");
            }
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.img}>
                <Image src="/login.png" alt="login" width={400} height={300} />
            </div>
            <div className={styles.box}>
                <h2>Login</h2>
                <form className={styles.form} onSubmit={e => handleSubmit(e)}>
                    <div className={styles.formDiv}>
                        <FontAwesomeIcon className={styles.icon} icon={faEnvelope} />
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ornek@mail.com" required/>
                    </div>

                    <div className={styles.formDiv}>
                        <FontAwesomeIcon className={styles.icon} icon={faLock} />
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" required/>
                    </div>
                    <button className={styles.btn} type="submit">Login</button>

                    <div className={styles.register}>
                        <p className={styles.minitext}>Don't you have an account?</p>
                        <Link className={styles.link} href="/auth/register">Patient</Link>
                        <Link className={styles.link} href="/auth/doctor-register">Doctor</Link>
                    </div>

                    <Link className={styles.minitext} href="/auth/forgot-password">Forget Password?</Link>

                    { error && <p className={styles.error}>{error}</p> }
                </form>
            </div>            
        </div>
    )
}
'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import api from "../../../../lib/api"

export default function Register() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")


    const handleSubmit = async (e) => { 
        e.preventDefault()

        try {
            await api.post("/auth/register", { username, email, password, role: "PATIENT" })
            router.push("/auth/login")

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
                <Image src="/patient.png" alt="login" width={400} height={300} />
            </div>
            <div className={styles.box}>
                <h2>Register</h2>
                <form className={styles.form} onSubmit={e => handleSubmit(e)}>
                    <div className={styles.formDiv}>
                        <FontAwesomeIcon className={styles.icon} icon={faUser} />
                        <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="fullname" required/>
                    </div>

                    <div className={styles.formDiv}>
                        <FontAwesomeIcon className={styles.icon} icon={faEnvelope} />
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ornek@mail.com" required/>
                    </div>

                    <div className={styles.formDiv}>
                        <FontAwesomeIcon className={styles.icon} icon={faLock} />
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" required/>
                    </div>
                    <button className={styles.btn} type="submit">Register</button>

                    <div className={styles.register}>
                        <p className={styles.minitext}>Already have an account?</p>
                        <Link className={styles.link} href="/auth/login">Login</Link>
                    </div>

                    <Link className={styles.minitext} href="/auth/forgot-password">Forget Password?</Link>

                    { error && <p className={styles.error}>{error}</p> }
                </form>
            </div>            
        </div>
    )
}
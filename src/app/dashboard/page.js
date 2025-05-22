"use client"
import { useEffect, useState } from "react"
import api from "../../../lib/api"
import Navbar from "../components/navbar"
import styles from "./styles.module.css"

function Dashboard() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        api.get("/user")
        .then((res) => {            
            setUser(res.data);
        })
        .catch((err) => {
            console.error("Kullanıcı alınamadı:", err);
        });
    }, [])

    return (
        <div>
            <Navbar user={user && user.username}/>
            <div className={styles.mainContent}>
                <h1>Hoş Geldiniz</h1>
                <p>Burası ana içerik alanı.</p>
            </div>
            {user && <p>{user.username}</p> }
        </div>
    )
}

export default Dashboard
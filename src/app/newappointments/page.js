"use client"
import { useEffect, useState, useRef } from 'react'
import api from "../../../lib/api"
import Navbar from "../components/navbar"
import styles from "./styles.module.css"


export default function NewAppointments() {
    const noteRefs = useRef({});

    const [user, setUser] = useState(null)
    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        async function getUser() {
            await api.get("/user")
                .then((res) => setUser(res.data))
                .catch((err) => console.error("Kullanıcı alınamadı:", err));
        }

        getUser()
    }, [])

    useEffect(() => {
        async function getAppointments() {
            await api.get("/appointments/doctor")
                .then((res) => setAppointments(res.data))
                .catch((err) => console.error("Randevular alınamadı:", err));
        }

        getAppointments()
    }, [])

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    const handleAccept = async (appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/accept`);
            refreshAppointments();
        } catch (err) {
            console.error("Onaylama hatası:", err);
        }
    };

    const handleReject = async (appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/reject`);
            refreshAppointments();
        } catch (err) {
            console.error("Reddetme hatası:", err);
        }
    };

    const handleCancel = async (appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/cancel`);
            refreshAppointments();
        } catch (error) {
            console.error("İptal etme hatası:", err);
        }
    }

    const handleNoteSubmit = async (appointmentId, note) => {
        try {            
            await api.put(`/appointments/${appointmentId}/note`, { note: note });
            refreshAppointments();
        } catch (err) {
            console.error("Not ekleme hatası:", err);
        }
    };

    const refreshAppointments = async () => {
        try {
            const response = await api.get("/appointments/doctor");
            setAppointments(response.data);
        } catch (err) {
            console.error("Randevular yenilenemedi:", err);
        }
    };

    const filteredAppointments = filterStatus === "ALL" ? appointments : appointments.filter(app => app.status === filterStatus);

    return (
        <div>
            <Navbar user={user && user.username} role={user && user.role} />

            <div className={styles.mainContent}>
                <h2 className={styles.header}>Doktor Randevuları</h2>

                <div style={{ marginBottom: "10px" }}>
                    {["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELED"].map(status => (
                        <button key={status} onClick={() => handleFilterChange(status)} className={styles.button}>{status}</button>
                    ))}
                </div>

                {filteredAppointments.length === 0 ? (
                    <p>Gösterilecek randevu yok.</p>
                ) : (
                    <ul>
                        {filteredAppointments.map(app => (
                            <li key={app.id} className={styles.li}>
                                <div style={{marginRight: "1rem", width: "40%"}}>
                                    <p className={styles.p}><strong>Hasta:</strong> {app.patientName}</p>
                                    <p className={styles.p}><strong>Tarih/Saat:</strong> {new Date(app.time).toLocaleString()}</p>
                                    <p className={styles.p}><strong>Durum:</strong> {app.status}</p>
                                    <p className={styles.p}><strong>Not:</strong> {app.note || "Henüz not yok."}</p>

                                    {app.status === "PENDING" && (
                                        <div style={{marginTop: "1rem"}}>
                                            <button onClick={() => handleAccept(app.id)}  className={styles.small_btn}>Onayla</button>
                                            <button onClick={() => handleReject(app.id)} style={{ marginLeft: "10px" }}  className={styles.small_btn}>Reddet</button>
                                        </div>
                                    )}

                                    {app.status === "APPROVED" && (
                                        <div style={{marginTop: "1rem"}}>
                                            <button onClick={() => handleCancel(app.id)}  className={styles.small_btn}>İptal</button>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <textarea placeholder="Not ekle" defaultValue="" ref={(el) => (noteRefs.current[app.id] = el)} rows="4" cols="50" className={styles.textarea}/>
                                    <br />
                                    <button onClick={() => handleNoteSubmit(app.id, noteRefs.current[app.id]?.value || "")} style={{ marginTop: "1rem" }} className={styles.small_btn}>Notu Kaydet</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

"use client"
import { useEffect, useState } from "react"
import api from "../../../lib/api"
import Navbar from "../components/navbar"
import styles from "./styles.module.css"

function TakeAppointment() {
    const [user, setUser] = useState(null)
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [available, setAvailable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function getUser() {
            await api.get("/user")
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Kullanıcı alınamadı:", err));
        }        

        getUser()    
    }, [])

    useEffect(() => {
        async function getDoctors(){
            await api.get("/doctors")
            .then((res) => setDoctors(res.data))
            .catch((err) => console.error("Doktorlar alınamadı:", err))
            .finally(() => setLoading(false));
        }        

        getDoctors()
    }, []);

    useEffect(() => {
        async function checkAvailability(){
            if (!selectedDoctor || !date || !time) {
                setAvailable(null);
                return;
            }

            const dateTime = `${date}T${time}:00`;

            await api.get("/appointments/availability", {
                params: { doctorId: selectedDoctor, dateTime }
            })
            .then((res) => setAvailable(res.data.available))
            .catch((err) => {
                console.error("Uygunluk kontrolü hatası:", err);
                setAvailable(false);
            });
        }        
        
        checkAvailability()
    }, [selectedDoctor, date, time]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!available) return;

        setSaving(true);
        try {
            await api.post("/appointments", {
                doctorId: selectedDoctor,
                time: `${date}T${time}:00`
            });
            setMessage("Randevunuz oluşturuldu!");

            setSelectedDoctor("");
            setDate("");
            setTime("");
        } catch (err) {
            console.error("Kaydetme hatası:", err);
            setMessage("Randevu oluşturulamadı.");
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 4000);
        }
    }

    if (loading) return <p className={styles.loading}>Yükleniyor...</p>;

    return (
        <div>
            <Navbar user={user && user.username} role={user && user.role}/>
            <div className={styles.mainContent}>
                <div className={styles.container}>
                    <h2 className={styles.heading}>Randevu Al</h2>

                    {message && <div className={styles.message}>{message}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label className={styles.label}>
                            Doktor
                            <select className={styles.select} value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                                <option value="">Seçiniz...</option>
                                {doctors.map((d) => (
                                    <option key={d.id} value={d.id}>{d.username}</option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.label}>
                            Tarih
                            <input
                                type="date"
                                value={date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>

                        <label className={styles.label}>
                            Saat
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </label>

                        {/* Uygunluk durumu */}
                        {available === true && <p className={styles.ok}>Uygun ✅</p>}
                        {available === false && <p className={styles.error}>Bu saatte dolu ❌</p>}

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={!available || saving}
                        >
                            {saving ? "Kaydediliyor..." : "Randevu Oluştur"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TakeAppointment
"use client"
import { useEffect, useState } from "react"
import api from "../../../lib/api"
import Navbar from "../components/navbar"
import styles from "./styles.module.css"

function Appointments() {
  	const [user, setUser] = useState(null)
	const [active, setActive] = useState([]);
	const [past, setPast] = useState([]);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
		const getUser = async () => {
			await api.get("/user")
			.then((res) => {
				console.log(res.data);
				
				setUser(res.data);
			})
			.catch((err) => {
				console.error("Kullanıcı alınamadı:", err);
			});
		}

		getUser()
		getAppointments()        
    }, [])

	const getAppointments = async() => {
		let mounted = true;

		await api.get("/appointments/my")
		.then((res) => {
			if (!mounted) return;
			const now = new Date();

			const upcoming = [];
			const history = [];

			res.data.forEach((appt) => {
			const date = new Date(appt.time);
			(date > now ? upcoming : history).push({ ...appt, date });
			});

			// Tarihe göre sırala
			upcoming.sort((a, b) => a.date - b.date);
			history.sort((a, b) => b.date - a.date);

			setActive(upcoming);
			setPast(history);
		})
		.catch((err) => {
			console.error("Randevular çekilemedi:", err);
		})
		.finally(() => setLoading(false));

		return () => { mounted = false; };
	}

	const handleCancel = async (appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/cancel`);
            getAppointments();
        } catch (error) {
            console.error("İptal etme hatası:", err);
        }
    }

	if (loading) return <p className={styles.loading}>Yükleniyor...</p>;


    return (
        <div>
            <Navbar user={user && user.username} role={user && user.role}/>
            <div className={styles.mainContent}>
					<h2 className={styles.header}>Aktif Randevular</h2>
					{active.length === 0 && <p className={styles.empty}>Aktif randevu yok.</p>}
					<div className={styles.grid}>
						<ul>
							{active.map(app => (
								<li key={app.id} className={styles.li}>
									<div style={{marginRight: "5rem"}}>
										<p className={styles.p}><strong>Doktor:</strong> {app.doctorName}</p>
										<p className={styles.p}><strong>Tarih/Saat:</strong> {new Date(app.time).toLocaleString()}</p>
										<p className={styles.p}><strong>Durum:</strong> {app.status}</p>
										<p className={styles.p}><strong>Not:</strong> {app.note || "Henüz not yok."}</p>

										{(app.status === "PENDING" || app.status === "APPROVED") && (
											<button onClick={() => handleCancel(app.id)} className={styles.small_btn}>İptal</button>
                                    	)}
									</div>
								</li>
							))}
						</ul>
					</div>

					<h2 className={styles.header}>Geçmiş Randevular</h2>
					{past.length === 0 && <p className={styles.empty}>Geçmiş randevu yok.</p>}
					<div className={styles.grid}>
						<ul>
							{past.map(app => (
								<li key={app.id} className={styles.li}>
									<div style={{marginRight: "5rem"}}>
										<p className={styles.p}><strong>Doktor:</strong> {app.doctorName}</p>
										<p className={styles.p}><strong>Tarih/Saat:</strong> {new Date(app.time).toLocaleString()}</p>
										<p className={styles.p}><strong>Durum:</strong> {app.status}</p>
										<p className={styles.p}><strong>Not:</strong> {app.note || "Henüz not yok."}</p>
										{/* {app.status !== "CANCELED" && (
											<button onClick={() => handleCancel(app.id)} className={styles.small_btn}>İptal</button>                                        
                                    	)} */}
										{/* <button onClick={() => handleCancel(app.id)}  className={styles.small_btn}>İptal</button> */}
									</div>
								</li>
							))}
						</ul>
					</div>
			</div>            
        </div>
    )
}

export default Appointments
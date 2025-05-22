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
        api.get("/user")
        .then((res) => {
            console.log(res.data);
            
            setUser(res.data);
        })
        .catch((err) => {
            console.error("Kullanıcı alınamadı:", err);
        });
    }, [])

	useEffect(() => {
		let mounted = true;

		api.get("/appointments")
		.then((res) => {
			if (!mounted) return;
			const now = new Date();

			const upcoming = [];
			const history = [];

			res.data.forEach((appt) => {
			const date = new Date(appt.dateTime);
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
	}, []);

	if (loading) return <p className={styles.loading}>Yükleniyor...</p>;


    return (
        <div>
            <Navbar user={user && user.username}/>
            <div className={styles.mainContent}>
				<div className={styles.container}>
					<section>
						<h2 className={styles.heading}>Aktif Randevular</h2>
						{active.length === 0 && <p className={styles.empty}>Aktif randevu yok.</p>}
						<div className={styles.grid}>
						{active.map((a) => (
							<Card key={a.id} appt={a} />
						))}
						</div>
					</section>

					<section>
						<h2 className={styles.heading}>Geçmiş Randevular</h2>
						{past.length === 0 && <p className={styles.empty}>Geçmiş randevu yok.</p>}
						<div className={styles.grid}>
						{past.map((a) => (
							<Card key={a.id} appt={a} />
						))}
						</div>
					</section>
				</div>                
            </div>
        </div>
    )
}

export default Appointments
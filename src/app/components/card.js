import styles from "./card.css"

export default function Card({ appt }) {
    const dateStr = appt.date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={styles.card}>
            <h3 className={styles.doctor}>{appt.doctorName}</h3>
            <p className={styles.date}>{dateStr}</p>
            {appt.notes && <p className={styles.notes}>{appt.notes}</p>}
        </div>
    );
}
import Image from "next/image";
import './navbar.css';

export default function Navbar({ user }) {
    return (
        <div className="sidebar">
             <div className="img">
                <Image src="/user.png" alt="user" width={50} height={50} />
            </div>
            
            <h3 className="username">{user}</h3>
            <ul className="nav-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/newappointment">Take Appointment</a></li>
                <li><a href="/appointments">Appointments</a></li>
            </ul>
        </div>
    );
};

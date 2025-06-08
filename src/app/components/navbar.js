import Image from "next/image";
import Link from "next/link";
import './navbar.css';

export default function Navbar({ user, role }) {
    return (
        <div className="sidebar">
            <div className="img">
                <Image src="/user.png" alt="user" width={50} height={50} />
            </div>
            
            <h3 className="username">{user}</h3>
            <ul className="nav-links">
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/takeappointment">Take Appointment</a></li>
                <li><a href="/appointments">Appointments</a></li>
                
                {role === "DOCTOR" && <li><a href="/newappointments">New Appointments</a></li> }
            </ul>
            <Link className="logout" href="/auth/login">Logout</Link>
        </div>
    );
};

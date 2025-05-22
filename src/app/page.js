'use client'
import styles from "./page.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Home() {
	const router = useRouter();

	useEffect(() => {
		console.log("Use Effect");
		
		router.push("/auth/login")
	})

	return (
		<div>
			<h1>Home Page</h1>
			<Link href="/auth/login">Login</Link>
		</div>
	);
}

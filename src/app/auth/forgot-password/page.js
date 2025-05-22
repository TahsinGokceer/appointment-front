'use client'
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForgotPassword() {


    return(
        <div>
            <h1>Unutmasaydın knk napayım şimdi</h1>
            <Link href="/auth/login">Özür dilerim</Link>
        </div>
    )
}
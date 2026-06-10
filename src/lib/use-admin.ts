import { useEffect, useState } from "react";

const KEY = "dcw_admin_pw";

export function getAdminPassword(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setAdminPassword(pw: string) {
  localStorage.setItem(KEY, pw);
}

export function clearAdminPassword() {
  localStorage.removeItem(KEY);
}

export function useAdminAuth() {
  const [pw, setPw] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setPw(getAdminPassword());
    setReady(true);
  }, []);
  return { password: pw, authenticated: !!pw, ready };
}
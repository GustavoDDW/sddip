"use client";
import SslPage from "@/components/Dashboard/DashboardsSSL";

function redirecLogin() {
  const login = sessionStorage.getItem("login");
  if (!login) {
    window.location.href = "/auth/signin";
    return;
  }
}
export default function Home() {
  redirecLogin();
  return (
    <>
      <SslPage />
    </>
  );
}

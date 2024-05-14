"use client";
import ECommerce from "@/components/Dashboard/Dashboard";

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
      <ECommerce />
    </>
  );
}

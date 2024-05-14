"use client";
import ECommerce from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SDIP",
  description: "Painel para acompanhamento e verficação dos ips dos sites",
  // other metadata
};

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

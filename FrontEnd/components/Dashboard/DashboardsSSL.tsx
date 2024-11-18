"use client";
import React, { useState, useEffect } from "react";
import CardDataStats from "../CardDataStats";
import DomainImg from "../../assets/Images/domain-logo.svg";
import Image from "next/image";
import { Ssl } from "@/app/interfaces/ssl";
import TableTwo from "../Tables/TableTwo";

const SslPage: React.FC = () => {
  const [data, setData] = useState<Ssl[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState<string>("");

  // Busca os dados da API ao carregar a página
  useEffect(() => {
    fetch("http://localhost:3333/ssl")
      .then((res) => res.json())
      .then((sslData: Ssl[]) => {
        setData(sslData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados SSL:", error);
        setLoading(false);
      });
  }, []);

  // Filtra os dados com base no domínio digitado
  const filteredData = data.filter((item) =>
    item.dominio.toLowerCase().includes(filterDomain.toLowerCase())
  
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {/* Cartão de dados estatísticos */}
      <CardDataStats
        title="Domínios"
        total={filteredData.length.toString()}
        rate=""
      >
        <Image src={DomainImg} alt="Domain Image" />
      </CardDataStats>

      <br />

      {/* Tabela com os dados filtrados */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          <TableTwo data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default SslPage;

"use client";
import React, { useState, useEffect } from "react";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import DomainImg from "../../assets/Images/domain-logo.svg";
import Image from "next/image";
import { dataBase } from "@/app/interfaces/database";

const ECommerce: React.FC = () => {
  const [data, setData] = useState<dataBase[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [totalDomains, setTotalDomains] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>("Fora da Casa");
  const [filterAnalyst, setFilterAnalyst] = useState<string>("");
  const [filterAnalystCsm, setFilterAnalystCsm] = useState<string>("");

  useEffect(() => {
    fetch("http://sdip.mpitemporario.com.br:3000/ip")
      .then((res) => res.json())
      .then((data: dataBase[]) => {
        setData(data);
        setLoading(false);
        // Define o total de domínios para todos os dados
        const uniqueDomains = new Set(
          data.map((item: dataBase) => item.dominio)
        );
        setTotalDomains(uniqueDomains.size);
      });
  }, []);

  // Função para calcular o total de domínios de acordo com o status e analista filtrados
  const calculateTotalDomains = (filteredData: dataBase[]) => {
    const uniqueDomains = new Set(
      filteredData.map((item: dataBase) => item.dominio)
    );
    return uniqueDomains.size;
  };

  const handleChangeFilterStatus = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterStatus(event.target.value);
  };

  const handleChangeFilterAnalyst = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterAnalyst(event.target.value);
  };

  const handlerChangeFilterAnalystCsm = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterAnalystCsm(event.target.value);
  };

  if (isLoading) return <p>Loading...</p>;

  // Filtra os dados com base no status selecionado
  let filteredData =
    filterStatus === "Todos"
      ? data
      : data.filter((item: dataBase) => item.status === filterStatus);

  // Filtra os dados com base no analista de CS selecionado
  filteredData = filterAnalyst
    ? filteredData.filter((item: dataBase) => item.cs === filterAnalyst)
    : filteredData;

  filteredData = filterAnalystCsm
    ? filteredData.filter((item: dataBase) => item.csm === filterAnalystCsm)
    : filteredData;

  // Calcula o total de domínios de acordo com os dados filtrados
  const totalDomainsFiltered = calculateTotalDomains(filteredData);

  return (
    <>
      <div>
        <CardDataStats
          title="Domínios"
          total={totalDomainsFiltered.toString()}
          rate=""
        >
          <Image src={DomainImg} alt="Domain Image" />
        </CardDataStats>
      </div>

      <br />
      <div className="rounded-sm border border-stroke p-3 bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold mr-2">Filtrar por status:</span>
            <select
              className="text-sm font-semibold rounded-sm border border-stroke bg-white py-2 px-2 shadow-default dark:border-strokedark dark:bg-boxdark"
              value={filterStatus}
              onChange={handleChangeFilterStatus}
            >
              <option value="IP não encontrado">IP não encontrado</option>
              <option value="Sem Informação no Sense">
                Sem Informação no Sense
              </option>
              <option value="Fora da Casa">Fora da Casa</option>
              <option value="Atualizar SenseData">Atualizar SenseData</option>
              <option value="Analisar">Analisar</option>
              <option value="Todos">Todos</option>
            </select>
          </div>

          <div>
            <span className="text-lg font-bold mr-2">Filtrar por analista CSM:</span>
            <select
              className="text-sm font-semibold rounded-sm border border-stroke bg-white py-2 px-2 shadow-default dark:border-strokedark dark:bg-boxdark"
              value={filterAnalystCsm}
              onChange={handlerChangeFilterAnalystCsm}
            >
              <option value="">Todos</option>
              {/* Renderizar opções com base nos nomes dos analistas disponíveis */}
              {Array.from(new Set(data.map((item: dataBase) => item.csm))).map(
                (analystName, index) => (
                  <option key={index} value={analystName}>
                    {analystName}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <span className="text-lg font-bold mr-2">Filtrar por analista CS:</span>
            <select
              className="text-sm font-semibold rounded-sm border border-stroke bg-white py-2 px-2 shadow-default dark:border-strokedark dark:bg-boxdark"
              value={filterAnalyst}
              onChange={handleChangeFilterAnalyst}
            >
              <option value="">Todos</option>
              {/* Renderizar opções com base nos nomes dos analistas disponíveis */}
              {Array.from(new Set(data.map((item: dataBase) => item.cs))).map(
                (analystName, index) => (
                  <option key={index} value={analystName}>
                    {analystName}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartThree data={filteredData} />
        <ChartTwo data={filteredData} />
        <div className="col-span-12 xl:col-span-12">
          <TableOne data={filteredData} />
        </div>
      </div>
    </>
  );
};

export default ECommerce;

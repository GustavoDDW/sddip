"use client";
import { Ssl } from "@/app/interfaces/ssl";
import { useState } from "react";

interface TableOneProps {
  data: Ssl[];
}

const TableTwo: React.FC<TableOneProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Função para filtrar os dados com base na pesquisa
  const filteredData = data.filter(
    (item) =>
      item.dominio &&
      item.dominio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-y-auto h-500 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        {/* Campo de pesquisa */}
        <div className="flex">
          <h2 className="title">Pesquisar por domínio</h2>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="p-2.5 mb-3 rounded border border-gray-300 w-90pc"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Dominio
            </h5>
          </div>

          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Data de Expiração</h5>
          </div>
        </div>

        {filteredData.map((item, key) => (
          <div
            className={`grid grid-cols-2 ${
              key === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{item.dominio}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{item.sslExpiration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableTwo;

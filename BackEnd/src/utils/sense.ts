import * as fs from 'fs';
import fetch from 'node-fetch';

interface Customer {
  dominio: string;
  name_contract: string;
  servidor_hospedado: string | string[];
  id_legacy: string; // Adicionado id_legacy
  stage: string; // Adicionado stage
  cs: { name: string }; // Adicionado cs.name
  csm: { name: string }; // Adicionado csm.name
}

// FUNÇÃO CONEXÃO COM API SENSEDATA
async function JSONSense(url: string): Promise<any> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ZDMwMWU4NjZjN2U0YzFhOTlmNmMyZDg4MjYwMzEyZWI="
    },
  };

  const response = await fetch(url, requestOptions);
  const json = await response.json();
  return json;
}

// FUNÇÃO PARA BUSCAR TODOS OS PLAYBOOKS EM ABERTO
export async function fetchAndSaveCustomerData(): Promise<void> {
  const limit = 10; // Defina o limite desejado
  const clientArray: Customer[] = [];
  let currentPage = 1;

  try {
    while (currentPage !== null) {
      const customerJSON = await JSONSense(`https://api.sensedata.io/v2/customers?status=Ativo&limit=${limit}&page=${currentPage}`);
      if (!customerJSON.customers || customerJSON.customers.length === 0) {
        break;
      }
      clientArray.push(
        ...customerJSON.customers
          .filter((customer: any) => customer.custom_fields?.dominio)
          .map((customer: any) => ({
            dominio: customer.custom_fields.dominio.value,
            servidor_hospedado: Array.isArray(customer.custom_fields.servidor_hospedado?.value)
              ? customer.custom_fields.servidor_hospedado.value[0] || '' // Se for um array, pega o primeiro valor ou retorna uma string vazia se não houver nenhum
              : customer.custom_fields.servidor_hospedado?.value || '', // Se não for um array, verifica se há um valor ou retorna uma string vazia
            name_contract: customer.name_contract,
            id_legacy: customer.id_legacy,
            stage: customer.stage,
            cs: { name: customer.cs.name },
            csm: { name: customer.csm.name },
          }))
      );
      currentPage = customerJSON.next_page;
    }

    // Salvar as informações em um arquivo JSON
    const dataSense = JSON.stringify(clientArray, null, 2);
    fs.writeFileSync('dataSense.json', dataSense);

    console.log('Informações salvas com sucesso em dataSense.json');
  } catch (error) {
    console.error('Erro ao obter dados da API SenseData:', error.message);
  }
}

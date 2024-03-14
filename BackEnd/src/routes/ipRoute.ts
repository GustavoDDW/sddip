import dns from 'dns';
import { FastifyInstance } from 'fastify';
import fs from "fs";

interface Site {
    name_contract: string;
    dominio: string;
    servidor_hospedado: string;
    id_legacy: string;
    stage: string;
    cs: { name: string };
    csm: { name: string };
    fase: string
}

const dominiosExcluidos = [
    "www.tongsis.com.br/controle-remoto/", "www.marte.com.br/equipamentos-laboratorio/", "www.zandei.com.br/informacoes"
];

const dominiosProxy = [
    "www.vidagua.com.br", "www.diman.com.br", "www.evolutionplasticos.com.br", "www.bmeempilhadeiras.com.br", "www.bjbsinalizacao.com.br", "www.residencialdonage.com.br", "www.linaresidencialsenior.com.br", "www.casavivamoveis.com.br", "www.atividadesmontagens.com.br", "www.fenixalpinismo.com.br", "www.ventiservice.com.br", "www.banhoquenterj.com.br", "www.4likeprojetos.com.br", "www.pironpromocionais.com.br", "www.wra.ind.br", "www.viamanofitness.com.br"
];

const dominiosInternos = [
    "169.57.141.90", "169.57.169.70", "169.57.169.72", "169.57.141.85", "169.57.169.85", "169.57.169.91", "169.57.141.94", "169.57.169.74", "169.57.169.83", "169.57.169.77", "169.57.169.73", "169.57.141.91"
]

async function obterIpDoSite(nomeDoSite: string, stage: String): Promise<string | null> {
    if (dominiosExcluidos.includes(nomeDoSite)) {
        return null;
    }

    if (stage == "OnBoarding") {
        return null;
    }

    return new Promise((resolve, reject) => {
        dns.lookup(nomeDoSite, (err, enderecoIp) => {
            if (err) {
                reject(err);
            } else {
                resolve(enderecoIp);
            }
        });
    });
}

function calcularStatus(senseIP: string, domainIP: string, stage: string): string {
    if (senseIP === domainIP) {
        return 'OK';
    } else if (domainIP === 'IP não encontrado') {
        return 'IP não encontrado';
    } else if (senseIP === '') {
        return 'Sem Informação no Sense';
    } else if (senseIP !== domainIP && stage !== 'OnBoarding') {
        return 'Fora da Casa';
    } else if (senseIP !== domainIP && dominiosInternos.includes(domainIP)) {
        return 'Atualizar SenseData';
    } else {
        return 'Analisar';
    }
}

export async function IpRoute(fastify: FastifyInstance) {
    fastify.get('/ip', { timeout: 60000 }, async (request, reply) => {
        try {
            const data = fs.readFileSync('dataSense.json', 'utf8');
            const dataSense: Site[] = JSON.parse(data);

            const respostasPromises = dataSense.map(async (site: Site) => {
                return obterIpDoSite(site.dominio, site.stage)
                    .then(enderecoIp => {
                        const status = calcularStatus(site.servidor_hospedado, enderecoIp || 'IP não encontrado', site.stage);
                        if (
                            dominiosProxy.includes(site.dominio) &&
                            (enderecoIp === null)
                        ) {
                            // Se o site não tem erro ou não está na fase OnBoarding e está na lista de exclusão, não imprime no console
                            return null;
                        } else if (
                            enderecoIp &&
                            site.servidor_hospedado !== enderecoIp &&
                            !dominiosProxy.some(excluido => site.dominio.startsWith(excluido))
                        ) {
                            return {
                                idSense: site.id_legacy,
                                razaoSocial: site.name_contract,
                                dominio: site.dominio,
                                status: status,
                                cs: site.cs.name,
                                csm: site.csm.name,
                                ipSense: site.servidor_hospedado,
                                ipAr: enderecoIp,
                                fase: site.stage
                            };
                        } else {
                            // Retorna null para indicar que não atendeu à condição
                            return null;
                        }
                    })
                    .catch(error => {
                        console.error(`Erro ao obter IP para ${site.dominio}: ${error.message}`);
                        return { dominio: site.dominio, ipSense: site.servidor_hospedado, ipAr: 'Erro ao obter IP' };
                    });
            });

            const respostas = await Promise.allSettled(respostasPromises);

            const resultados = (await Promise.allSettled(respostasPromises))
                .filter((resposta: any) => resposta.status === 'fulfilled' && resposta.value !== null)
                .map((resposta: any) => resposta.value);

            reply.send(resultados); // Retorna os resultados diretamente para o usuário
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}

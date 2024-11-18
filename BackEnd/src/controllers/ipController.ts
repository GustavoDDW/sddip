import dns from 'dns';
import { FastifyInstance } from 'fastify';
import fs from 'fs';
import { sendEmail } from '../utils/email';

interface Site {
    name_contract: string;
    dominio: string;
    servidor_hospedado: string;
    id_legacy: string;
    stage: string;
    cs: { name: string };
    cs_email: { name: string };
    csm: { name: string };
    csm_email: { name: string };
    fase: string;
}

// Listas de domínios e IPs
const dominiosExcluidos = ["www.tongsis.com.br/controle-remoto/", "www.marte.com.br/equipamentos-laboratorio/", "www.zandei.com.br/informacoes"];
const dominiosProxy = ["www.vidagua.com.br", "www.diman.com.br", "www.evolutionplasticos.com.br", "www.bmeempilhadeiras.com.br", "www.bjbsinalizacao.com.br", "www.residencialdonage.com.br", "www.linaresidencialsenior.com.br", "www.casavivamoveis.com.br", "www.atividadesmontagens.com.br", "www.fenixalpinismo.com.br", "www.ventiservice.com.br", "www.banhoquenterj.com.br", "www.4likeprojetos.com.br", "www.pironpromocionais.com.br", "www.wra.ind.br", "www.viamanofitness.com.br", "bjbsinalizacao.com.br", "fzcozinhasindustriais.com.br"];
const dominiosInternos = ['169.57.141.90', '169.57.169.70', '169.57.169.72', '169.57.141.85', '169.57.169.85', '169.57.169.91', '169.57.141.94', '169.57.169.74', '169.57.169.83', '169.57.169.77', '169.57.169.73', '169.57.141.91', '149.18.102.86', '149.18.102.82', '149.18.102.91', '149.18.102.88'];

// Função para carregar o log dos sites que já receberam alerta
function loadEmailLog(): Set<string> {
    try {
        const logData = fs.readFileSync('emailLog.json', 'utf8');
        return new Set(JSON.parse(logData));
    } catch {
        return new Set();
    }
}

// Função para atualizar o log com um novo site
function updateEmailLog(dominio: string): void {
    const log = loadEmailLog();
    log.add(dominio);
    fs.writeFileSync('emailLog.json', JSON.stringify(Array.from(log)));
}

// Função para remover um site do log
function removeFromEmailLog(dominio: string): void {
    const log = loadEmailLog();
    if (log.has(dominio)) {
        log.delete(dominio);
        fs.writeFileSync('emailLog.json', JSON.stringify(Array.from(log)));
    }
}

// Função para calcular o status e enviar e-mail se necessário
async function calcularStatus(email: string, cs: string, domain: string, senseIP: string, domainIP: string, stage: string): Promise<string> {
    const emailLog = loadEmailLog();

    if (domainIP === 'IP não encontrado') {
        if (dominiosProxy.includes(senseIP)) {
            removeFromEmailLog(domain); // Remove do log se o status for "OK"
            return 'OK';
        }
        return 'IP não encontrado';
    } else if (senseIP === '') {
        return 'Sem Informação no Sense';
    } else if (senseIP === domainIP) {
        removeFromEmailLog(domain); // Remove do log se o status for "OK"
        return 'OK';
    } else if (stage !== 'OnBoarding' && dominiosProxy.includes(senseIP)) {
        removeFromEmailLog(domain); // Remove do log se o status for "OK"
        return 'OK';
    } else if (senseIP !== domainIP && stage !== 'OnBoarding' && !emailLog.has(domain)) {
        await sendEmail(email, cs, domain, senseIP);
        updateEmailLog(domain); // Adiciona ao log após enviar o e-mail
        return 'Fora da Casa';
    } else if (senseIP !== domainIP && dominiosInternos.includes(domainIP)) {
        return 'Atualizar SenseData';
    } else {
        return 'Analisar';
    }
}

// Função para obter o IP do site
async function obterIpDoSite(nomeDoSite: string, stage: string): Promise<{ enderecoIp: string | null, error: any }> {
    if (dominiosExcluidos.includes(nomeDoSite)) {
        return { enderecoIp: null, error: null };
    }
    if (stage === "OnBoarding") {
        return { enderecoIp: null, error: null };
    }

    return new Promise((resolve) => {
        dns.lookup(nomeDoSite, (err, enderecoIp) => {
            if (err) {
                resolve({ enderecoIp: null, error: err });
            } else {
                resolve({ enderecoIp: enderecoIp, error: null });
            }
        });
    });
}

// Rota principal para verificar o status do IP dos sites
export async function IpRoute(fastify: FastifyInstance) {
    fastify.get('/ip', { timeout: 60000 }, async (request, reply) => {
        try {
            const data = fs.readFileSync('dataSense.json', 'utf8');
            const dataSense: Site[] = JSON.parse(data);

            const respostasPromises = dataSense.map(async (site: Site) => {
                const { enderecoIp, error } = await obterIpDoSite(site.dominio, site.stage);
                const status = error
                    ? 'IP não encontrado'
                    : await calcularStatus(site.cs_email.name, site.cs.name, site.dominio, site.servidor_hospedado, enderecoIp || '', site.stage);

                return {
                    idSense: site.id_legacy,
                    razaoSocial: site.name_contract,
                    dominio: site.dominio,
                    status: status,
                    cs: site.cs.name,
                    csm: site.csm.name,
                    ipSense: site.servidor_hospedado,
                    ipAr: enderecoIp || '',
                    fase: site.stage,
                    error: error ? error.message : null,
                };
            });

            const resultados = await Promise.all(respostasPromises);
            reply.send(resultados);
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}
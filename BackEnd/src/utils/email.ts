import nodemailer, { Transporter } from "nodemailer";

// Configuração do servidor SMTP
const config = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'tiago.doutoresdaweb@gmail.com',
        pass: 'asquedtsduzppncd', // Senha de aplicativo sem espaços
    },
    tls: {
        rejectUnauthorized: false,
    },
};

// Cria um transportador de email
const transporter: Transporter = nodemailer.createTransport(config);

// Função para enviar email com nova senha
async function sendEmail(email: string, analistName: string, site: string, ipSense: string): Promise<void> {
    await transporter.sendMail({
        subject: `Alerta: Site ${site} fora do ar`,
        from: `Deploy / Publicação <deploy@doutoresdaweb.com.br>`,
        to: email,
        bcc: 'deploy@doutoresdaweb.com.br',
        html: `
        <html>
            <body>
                <p>Olá ${analistName},</p>
                <p>Identificamos que o site <b>${site}</b> está atualmente fora do ar. Para que o site volte a funcionar, entre em contato com o cliente e solicite as seguintes configurações:</p>
                <p><b>Configurações DNS</b><br>
                Entrada: ${site} ou '@'<br>
                Tipo/Registro: A<br>
                Valor/Target: ${ipSense}</p>
                <p><b>Configurações DNS</b><br>
                Entrada: www<br>
                Tipo/Registro: CNAME<br>
                Valor/Target: ${site}</p>
                <p>Este é um email automático, por favor, não responda a esta mensagem.</p>
                <p>Para qualquer dúvida ou tratativa adicional, abra um ticket pelo nosso formulário: <a href="https://idealtrends.typeform.com/to/AyQbGw55?typeform-source=idealtrends.atlassian.net">Typeform</a></p>
                <p>Obrigado pela atenção!</p>
            </body>
        </html>
        `,
    });
}

// Exportação das funções e configurações
export { sendEmail, config };

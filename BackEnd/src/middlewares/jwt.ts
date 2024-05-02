import Jwt from "jsonwebtoken";

function verifyJWT(req, res, next) {
    const secret = 'HJ@$#HSJJ/45815.134ewer';
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ messege: 'Token não informado.' });
    const parts = authHeader.split(' ');
    if (parts.legth !== 2) return res.status(401).send({ messege: 'Token Inválido.' });
    const [schema, token] = parts;
    if (!/^Bearer$/i.test(schema)) return res.status(401).send({ message: 'Token inválido' });
    Jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ messege: 'Usuário não autenticado.' })
        }
        req.infoUser = decoded.infoUser;
        return next();
    });
}

export {verifyJWT};
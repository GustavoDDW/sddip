import jwt from 'jsonwebtoken';

function generateToken(email: string, userName: string) {

  const secret = 'HJ@$#HSJJ/45815.134ewer';

  return jwt.sign({ infoUser: { email, userName } }, secret, { expiresIn: 60 * 60 * 5 });
}

export { generateToken };
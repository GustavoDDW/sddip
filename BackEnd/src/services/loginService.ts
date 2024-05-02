import { Connection } from 'mysql2/promise';
import { connect } from '../config/connection'; // Alteração aqui

async function selectLogin(email:string, password:string) {
    const conn: Connection = await connect();
    const sql = 'SELECT email, user_name, user_id FROM users_tbl WHERE email = ? AND user_password = ?';
    const dataLogin = [email, password];
    const [rows] = await conn.query(sql, dataLogin);
    conn.end();
    return rows;
}

export default { selectLogin};
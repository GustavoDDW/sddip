import { Connection, QueryResult } from 'mysql2/promise';
import { connect } from '../config/connection'; // Alteração aqui

async function findUser(): Promise<QueryResult> {
    const conn: Connection = await connect(); // Alteração aqui
    const sql = 'SELECT user_name, email, user_id FROM users_tbl';
    const [rows] = await conn.query(sql);
    conn.end();

    return rows;
}

async function insertUser(userName: string, email: string, password: string) {
    const conn: Connection = await connect();
    const sql = 'INSERT INTO users_tbl(user_name, email, user_password) VALUES(?,?,?);';
    const dataUser = [userName, email, password];

    await conn.query(sql, dataUser);

    console.log(userName, email, password)

    conn.end();
}

async function updateUser(idUser: number, userName: string, email: string, password: string) {
    const conn: Connection = await connect();

    const sql = 'UPDATE users_tbl SET user_name = ?, email = ?, user_password = ? WHERE user_id = ?'
    const dataUser = [userName, email, password, idUser];

    await conn.query(sql, dataUser);

    console.log(userName, email, password);


    conn.end();
}
 
async function deleteUser(idUser: number) {
    const conn: Connection = await connect();

    const sql = 'DELETE from users_tbl WHERE user_id = ?';
    const dataUser = [idUser];

    await conn.query(sql, dataUser);

    conn.end();
}

export default { insertUser, findUser, updateUser, deleteUser };
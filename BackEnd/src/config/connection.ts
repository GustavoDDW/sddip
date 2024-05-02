import mysql from 'mysql2/promise';

export async function connect() {
    const connection = await mysql.createConnection({
        host: 'bbchawwgm8rleikixbwr-mysql.services.clever-cloud.com',
        user: 'u78rhecfwpiss9m9',
        password: 'Wg9esNtwyK36AeyEuoTd',
        database: 'bbchawwgm8rleikixbwr'
    });

    return connection;
}

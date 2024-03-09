import mysql from 'mysql2/promise';


    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'postgres',
        database: 'Main'
    });

export const Index = async () => {
    try {
        const [rows, fields] = await connection.query('SELECT * FROM your_table');
        console.log(rows);
    } catch (err) {
        console.error(err);
    }
}



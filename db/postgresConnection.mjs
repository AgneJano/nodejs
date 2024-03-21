import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'RestaurantDB',
    password: 'test',
    port: 5432
});

export const connectDB = () => {
    return new Promise((resolve, reject) => {
        pool.connect((error) => {
            if (error) {
                console.log('connection error', error.stack);
                reject(error);
            } else {
                resolve('Database connected successfully');
            }
        });
    });
};

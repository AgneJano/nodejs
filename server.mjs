import express from 'express'
import usersRouter from "./routes/index.mjs";
// import menuRouter from './routes/index.mjs';

import { connectDB } from './db/postgresConnection.mjs';

const app = express();
app.use(express.json());

// app.use(usersRouter);
// app.use(menuRouter)

const startServer = async () => {
    try {
        const message = await connectDB()
        console.log(message);

        // app.use('/api/v1/restaurant', usersRouter, menuRouter)
        const PORT = 1000;

        //PORT
        app.listen(PORT, () => {
        console.log('Server is listening on PORT 1000')
        });

    } catch (error) {
        console.error('Failed to connect to server or database.', error);
    }
}

startServer()
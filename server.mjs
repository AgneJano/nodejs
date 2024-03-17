import express from 'express'
import usersRouter from "./routes/index.mjs";
import menuRouter from './routes/index.mjs';

const app = express();
app.use(express.json());

app.use('/api/v1/restaurant', usersRouter, menuRouter)

app.use(usersRouter);
app.use(menuRouter)

const PORT = 1000;

//PORT
app.listen(PORT, () => {
    console.log('Server is listening on PORT 1000')
})
import express from 'express';
import usersRouter from './users.mjs'
import menuRouter from './menu.mjs'

const router = express.Router();

router.use('/users', usersRouter);
router.use('/menu', menuRouter);

export default router;


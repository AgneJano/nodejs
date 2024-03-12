import express from 'express';
import userController from '../controller/usersController.mjs';

const router = express.Router();

router.get('/', userController.getUsers);

router.post('/register', userController.createUser);

router.get('/:id', userController.getUserId);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.post('/:userId/orders', userController.createOrderUser)

export default router;
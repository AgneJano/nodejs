import express from 'express';
import userController from '../controller/usersController.mjs';
import { validate } from '../middleware/schemaValidator.mjs';
import { validateUserId, userValidationSchema } from '../validators/userValidator.mjs'


const router = express.Router();

router.get('/', userController.getUsers);

router.post('/register', validate(userValidationSchema), userController.createUser);

router.get('/:id', validate(validateUserId), userController.getUserId);

router.put('/:id', validate(validateUserId), userController.updateUser);

router.delete('/:id', validate(validateUserId), userController.deleteUser);

router.post('/:userId/orders', userController.createOrderUser)

router.get("/:id/reservations", userController.getUserReservation)

router.delete("/:userId/reservations/:orderId", userController.deleteReservation);

export default router;
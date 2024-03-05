import express from 'express';
import menuController from '../controller/menuController.mjs';

const router = express.Router();

router.get('/', menuController.getMenu);

router.post('/register', menuController.createMenu);

//neveikia pagal id kazkodel.
router.get('/:id', menuController.getMenuId);

router.put('/:id', menuController.updateMenu);

router.delete('/:id', menuController.deleteMenu);

export default router;
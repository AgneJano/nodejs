import menu from '../db/menu.json' assert {type: "json"};

import fs from 'fs'

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const menuController = {

    getMenu: (req, res) => {
        try {
            if (req.query.paginate = 'true') {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;

                const start = (page - 1) * limit;
                const end = page * limit;

                const paginatedUser = menu.slice(start, end);

                res.status(200).json(paginatedUser);
            } else {
                res.status(200).json(menu);
            }
        } catch (error) {
            res.status(500).json({ message: 'An error occured while retrieving users.' })
        }
    },

    createMenu: async (req, res) => {
        try {
            const newMenu = {
                ...req.body,
            }

            menu.push(newMenu);
            menu.forEach((menu, index) => {
                menu.id = index + 1;
            });

            await fs.promises.writeFile(path.join(__dirname, '../db/menu.json'), JSON.stringify(menu, null, 2));

            res.status(201).json(newMenu)

        } catch (error) {
            res.status(500).json({ message: 'An error occured while adding new dish.' })
        }
    },

    getMenuId: (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const foundMenu = menuController.menu.find(menuItem => menuItem.id === id);

            if (!foundMenu) {
                res.status(404).json({ message: 'Dish not found.' });
                return;
            }
            res.status(200).json(foundMenu);

        } catch (error) {
            res.status(500).json({ message: 'An error occured while retrieving the dish by id.' })
        }
    },

    updateMenu: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updateMenu = { ...req.body, id };

            let menuIndex = menu.findIndex(menu => menu.id === id);

            if (menuIndex === -1) {
                res.status(404).json({ message: 'Dish not found' });
                return;
            }

            menu[menuIndex] = updateMenu;

            await fs.promises.writeFile(path.join(__dirname, '../db/menu.json'), JSON.stringify(menu, null, 2))

            res.status(200).json(updateMenu);
        } catch (error) {
            res.status(500).json({ message: 'An error occured while updating menu.' })
        }
    },

    deleteMenu: async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            let menuIndex = menu.findIndex(menu => menu.id === id);

            if (menuIndex === -1) {
                res.status(404).json({ message: 'Dish not found' });
                return;
            }

            menu.splice(menuIndex, 1)

            await fs.promises.writeFile(path.join(__dirname, '../db/menu.json'), JSON.stringify(menu, null, 2));

            res.status(200).json({message: "Dish successfully deleted."})

        } catch (error) {
            res.status(500).json({ message: 'An error occured while deleting dish.' })
        }


    }
}

export default menuController;
import users from '../db/users.json' assert {type: "json"};

import fs from 'fs';
import path, { dirname } from 'path';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const userController = {

    getUsers: (req, res) => {
        console.log(res);
        try {
            if (req.query.paginate = 'true') {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;

                const start = (page - 1) * limit;
                const end = page * limit;

                const paginatedMenu = menu.slice(start, end);

                res.status(200).json(paginatedMenu);
            } else {
                res.status(200).json(users);
            }
        } catch (error) {
            res.status(500).json({ message: 'An error occured while retrieving users.' })
        }
    },

    createUser: async (req, res) => {
        try {
            const newUser = {
                ...req.body,
                orders: []
            }

            users.push(newUser);
            users.forEach((user, index) => {
                user.id = index + 1;
            });

            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));

            res.status(201).json(newUser)

        } catch (error) {
            res.status(500).json({ message: 'An error occured while adding new user.' })
        }
    },

    getUserId: (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const user = users.find(user => user.id === id)

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }
            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: 'An error occured while retrieving the user by id.' })
        }
    },

    updateUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updateUser = { ...req.body, id };

            let userIndex = users.findIndex(user => user.id === id);

            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            users[userIndex] = updateUser;

            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2))

            res.status(200).json(updateUser);
        } catch (error) {
            res.status(500).json({ message: 'An error occured while updating user.' })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            let userIndex = users.findIndex(user => user.id === id);

            if (userIndex === -1) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            users.splice(userIndex, 1)

            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));

            res.status(200).json({message: "User successfully deleted."})

        } catch (error) {
            res.status(500).json({ message: 'An error occured while deleting user.' })
        }


    }

}

export default userController
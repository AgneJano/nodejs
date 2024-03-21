import users from '../db/users.json' assert {type: "json"};
import orders from '../db/orders.json' assert {type: "json"};
import menu from '../db/menu.json' assert {type: "json"};

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


    },

    getUserReservation: (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const user = users.find(user => user.id === id);
            // const order = orders.find(order => order.id === id);

            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            const orderedDishes = menu.filter(menu => user.orders.includes(menu.id));

            const orderMenuInfo = orderedDishes.map(menu => ({
                id: menu.id,
                name: menu.name,
                price: menu.price,
                category: menu.category
            }));
            res.status(200).json(orderMenuInfo);
        } catch (error) {
            res.status(500).json({ message: 'An error occured while getting user ordered menu.' })
        }

    },

    createOrderUser: async (req, res) => {
        try {
            const userId = Number(req.params.userId);
            const menuItemId = Number(req.query.menuItemId);
            const quantity = Number(req.query.quantity);
            // const newOrder = req.body

            const user = users.find(user => user.id === userId);

            if (!user) {
                res.status(404).json({message: 'User not found.'});
                return;
            }

            // const maxOrderId = Math.max(...orders.map(order => order.id));

            let maxOrderId;
            if(orders.length > 0) {
                maxOrderId = Math.max(...orders.map(order => order.id))
            } else {
                maxOrderId = 0;
            }

            // let maxOrderId = orders.length > 0 ? Math.max(...orders.map(order => order.id)) : 0;

            const orderToSave = {
                id: maxOrderId + 1,
                customerId: userId,
                Items: []
            }

            const menuItem = menu.find(menu => menu.id === menuItemId)

            if(!menuItem) {
                res.status(400).json({message: 'Menu item with ID you written does not exist'});
                return;
            }

            orderToSave.Items.push({
                menuItemId: menuItemId,
                quantity:  quantity
            });

            orders.push(orderToSave);

            user.orders.push(orderToSave.id);

            await fs.promises.writeFile(path.join(__dirname, '../db/orders.json'), JSON.stringify(orders, null, 2));

            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));

            res.status(201).json(orderToSave)

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'An error occurred while creating the order.' })
        }
    },

    deleteReservation: async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const orderId = parseInt(req.params.orderId);
    
            const user = users.find(user => user.id === userId);
            const order = orders.find(order => order.id === orderId);
    
            if (!user || !order) {
                res.status(404).json({message: 'Order in user orders not found.'});
                return;
            };
    
            const orderIndex = user.orders.indexOf(orderId);
    
            if(orderIndex === -1) {
                res.status(400).json({message: 'Order is not reserved by the user.'});
                return;
            }
    
            user.orders.splice(orderIndex, 1);

            const removerOrderIndex = orders.findIndex(order => order.id === orderId);

            if (removerOrderIndex === -1) {
                res.status(404).json({message: 'Order in order.json not found.'});
                return;
            }

            orders.splice(removerOrderIndex, 1);

            await fs.promises.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2));
    
            await fs.promises.writeFile(path.join(__dirname, '../db/orders.json'), JSON.stringify(orders, null, 2));
    
            res.status(200).json({ message: 'Order successfully unreserved.' });
    
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while deleting the order.' })
        }
    },

    login: async (req, res) => {
        try {
            const { username, email } = req.body;

            const user = await userModel.login({ username, email });
       
            res.status(200).json({ message: 'User Logged in successfully', user })
        } catch (error) {
            if (error.message === 'User not found' || error.message === 'Invalid credentials.') {
                res.status(401).json({ message: error.message })
            } else {
                console.error(error);
                res.status(500).json({ message: 'An error occurred while logging in.' })
            }
        }
    },

}

export default userController
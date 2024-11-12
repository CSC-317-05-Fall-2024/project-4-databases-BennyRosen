import express from 'express';
import { createRestaurant, deleteRestaurant } from '../data/restaurants.js';

const router = express.Router();

router.post('/restaurants', (req, res) => {
    const newRestaurant = req.body;
    const createdRestaurant = createRestaurant(newRestaurant);
    res.status(201).json(createdRestaurant);
});

router.delete('/restaurants/:id', (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);
    const isDeleted = deleteRestaurant(restaurantId);
    
    if (isDeleted) {
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
});

export { router as backendRouter };
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { backendRouter } from './routes/api.js'; 
import { getRestaurants, getRestaurant, createRestaurant, deleteRestaurant } from './data/restaurants.js'; // Import database functions

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use('/api', backendRouter);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/attractions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'attractions.html'));
});

app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await getRestaurants();
        res.render('restaurants', { restaurants });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).send('Sorry, we encountered an issue fetching restaurant data. Please try again later.');
    }
});

app.get('/restaurants/:id', async (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);
    try {
        const restaurant = await getRestaurant(restaurantId); 

        if (restaurant) {
            res.render('restaurant-details', { ...restaurant }); 
        } else {
            res.status(404).send('Restaurant not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching restaurant details');
    }
});

app.get('/add-restaurant', (req, res) => {
    res.render('add-restaurant');
});

app.post('/add-restaurant', async (req, res) => {
    const { name, phone, address, photo } = req.body;
    console.log('Form data received:', req.body); 

    if (!name || !phone || !address) {
        return res.status(400).send('Name, phone, and address are required fields.');
    }

    try {
        const newRestaurant = await createRestaurant({ name, phone, address, photo });
        res.redirect(`/restaurants/${newRestaurant.id}`);
    } catch (error) {
        console.error('Error adding restaurant:', error);
        res.status(500).send('Error adding restaurant, please try again.');
    }
});

app.delete('/restaurants/:id', async (req, res) => {
    const restaurantId = parseInt(req.params.id, 10);
    try {
        const deletedRestaurant = await deleteRestaurant(restaurantId); // Delete the restaurant from the DB

        if (deletedRestaurant) {
            res.status(200).send(`Restaurant with ID ${restaurantId} deleted successfully`);
        } else {
            res.status(404).send('Restaurant not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting restaurant');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
import { pool } from '../config/database.js';

//using pool to get data from SQL instead of fake data set

const getRestaurants = async () => {
    try {
        const result = await pool.query('SELECT * FROM restaurants;');
        return result.rows; 
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error; 
    }
};

const getRestaurant = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM restaurants WHERE id = $1;', [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error(`Error fetching restaurant with ID ${id}:`, error);
        throw error;
    }
};

const createRestaurant = async (newRestaurant) => {
    const { name, phone, address, photo } = newRestaurant;
    try {
        const result = await pool.query(
            'INSERT INTO restaurants (name, phone, address, photo) VALUES ($1, $2, $3, $4) RETURNING *;',
            [name, phone, address, photo]
        );
        return result.rows[0]; // Return the newly created restaurant object (including auto-generated ID)
    } catch (error) {
        console.error('Error creating restaurant:', error);
        throw error;
    }
};

const deleteRestaurant = async (id) => {
    try {
        const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *;', [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error(`Error deleting restaurant with ID ${id}:`, error);
        throw error;
    }
};

const updateRestaurant = async (id, updatedData) => {
    const { name, phone, address, photo } = updatedData;
    try {
        const query = `
            UPDATE restaurants 
            SET 
                name = COALESCE($1, name), 
                phone = COALESCE($2, phone), 
                address = COALESCE($3, address), 
                photo = COALESCE($4, photo)
            WHERE id = $5
            RETURNING *;
        `;
        const values = [name, phone, address, photo, id];
        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new Error(`Restaurant with ID ${id} not found.`);
        }

        return result.rows[0];  
    } catch (error) {
        console.error(`Error updating restaurant with ID ${id}:`, error);
        throw error;
    }
};

//implemenation for getting reviews for a specific restraurant
const getReviewsForRestaurant = async (restaurantId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM reviews WHERE restaurant_id = $1;', 
            [restaurantId]
        );
        
        return result.rows;
    } catch (error) {
        console.error(`Error fetching reviews for restaurant with ID ${restaurantId}:`, error);
        throw error; 
    }
};

export { getRestaurants, getRestaurant, createRestaurant, deleteRestaurant, updateRestaurant, getReviewsForRestaurant };
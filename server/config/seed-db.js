/* Initialize the data in the DB */
import { pool } from './database.js';

//calls to postgres

const dropTables = async () => {
    try {
        const dropTablesQuery = `
            -- Drop reviews table first, to avoid foreign key constraint errors
            DROP TABLE IF EXISTS reviews;
            DROP TABLE IF EXISTS restaurants;
        `;
        await pool.query(dropTablesQuery);
        console.log('Tables dropped successfully.');
    } catch (error) {
        console.log('Error dropping tables:', error);
    }
}

const createTables = async () => {
    try {
        const createRestaurantsTableQuery = `
            CREATE TABLE IF NOT EXISTS restaurants (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                photo VARCHAR(255)
            );
        `;
        await pool.query(createRestaurantsTableQuery);
        console.log('Restaurants table created successfully.');

        const createReviewsTableQuery = `
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                rating INTEGER NOT NULL,
                content TEXT NOT NULL,
                restaurant_id INTEGER,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
            );
        `;
        await pool.query(createReviewsTableQuery);
        console.log('Reviews table created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

const insertData = async () => {
    try {
        const insertRestaurantsQuery = `
            INSERT INTO restaurants (name, phone, address, photo) 
            VALUES
            ('Pizza Palace', '555-1234', '123 Pizza St, Flavor Town', 'http://example.com/photo1.jpg'),
            ('Burger Kingdom', '555-5678', '456 Burger Ave, Food City', 'http://example.com/photo2.jpg'),
            ('Sushi Spot', '555-9876', '789 Sushi Rd, Fish Town', 'http://example.com/photo3.jpg')
            RETURNING id;
        `;
        const restaurantResult = await pool.query(insertRestaurantsQuery);
        const restaurantIds = restaurantResult.rows.map(row => row.id); // Store restaurant IDs

        console.log('Restaurants inserted successfully.');

        // Insert reviews
        const insertReviewsQuery = `
            INSERT INTO reviews (rating, content, restaurant_id) 
            VALUES
            (5, 'cool food dude, highly recommend!', $1),
            (4, 'Great fooooood, but service was a bit slow.', $1),
            (3, 'Good cheese, but I expected more cheese.', $2),
            (4, 'Delicious pasta, will definitely need meatballs!', $3),
            (5, 'Fantastic wow, everything was so awesome!', $2);
        `;
        await pool.query(insertReviewsQuery, [restaurantIds[0], restaurantIds[1], restaurantIds[2]]);

        console.log('Reviews inserted successfully.');
    } catch (error) {
        console.log('Error inserting data:', error);
    }
}

const setup = async () => {
    await dropTables();
    await createTables();
    await insertData();
}

setup();
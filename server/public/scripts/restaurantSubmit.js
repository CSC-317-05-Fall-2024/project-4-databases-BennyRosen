// restaurantSubmit.js

const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('input[name="name"]').value;
    const phone = form.querySelector('input[name="phone"]').value;
    const address = form.querySelector('input[name="address"]').value;
    const photo = form.querySelector('input[name="photo"]').value;

    const newRestaurant = { name, phone, address, photo };

    try {
        const response = await fetch('/api/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRestaurant),
        });

        if (response.ok) {
            console.log("Restaurant created successfully!");

            window.location.href = '/restaurants';
        } else {
            console.error("Failed to create restaurant.");
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#new-restaurant-form'); 
    if (form) {
        form.addEventListener('submit', handleSubmit); 
    }
});
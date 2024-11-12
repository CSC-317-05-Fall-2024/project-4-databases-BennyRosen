/* This file should contain definitions for deleteRestaurantCard,
    and js to attach it as a handler per card.
*/

async function deleteRestaurantCard(event) {
    const button = event.target;
    const restaurantId = button.dataset.id; 

    if (restaurantId) {
        try {
            const response = await fetch(`/api/restaurants/${restaurantId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                button.closest('.image-container-rest').remove();  
                console.log(`Restaurant with ID ${restaurantId} deleted successfully.`);
                
                window.location.reload();
            } else {
                console.error(`Failed to delete restaurant with ID ${restaurantId}.`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('restaurantCards.js is loaded');
    const deleteButtons = document.querySelectorAll('.delete-button'); 
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteRestaurantCard); 
    });
});
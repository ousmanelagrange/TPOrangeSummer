document.addEventListener('DOMContentLoaded', function() {
    const restaurantGrid = document.getElementById('restaurant-grid');

    async function fetchRestaurants() {
        try {
            // Exemple d'URL d'un dataset alternatif
            const response = await fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=restaurants&q=&rows=10&facet=cuisine_type');
            const data = await response.json();
            return data.records.map(record => ({
                name: record.fields.name || 'Nom non disponible',
                cuisine: record.fields.cuisine_type || 'Type de cuisine non disponible',
                image: record.fields.image_url || 'img/default.jpg'
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des données', error);
            return [];
        }
    }

    async function loadRestaurantsFromAPI() {
        const restaurants = await fetchRestaurants();
        loadRestaurants(restaurants);
    }

    function createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        const img = document.createElement('img');
        img.src = restaurant.image;
        img.alt = restaurant.name;

        const title = document.createElement('h3');
        title.textContent = restaurant.name;

        const description = document.createElement('p');
        description.textContent = restaurant.cuisine;

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);

        return card;
    }

    function loadRestaurants(restaurants) {
        restaurantGrid.innerHTML = '';
        restaurants.forEach(restaurant => {
            const card = createRestaurantCard(restaurant);
            restaurantGrid.appendChild(card);
        });
    }

    loadRestaurantsFromAPI();

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const cuisineType = document.getElementById('cuisine-type').value.toLowerCase();
        fetchRestaurants().then(restaurants => {
            const filteredRestaurants = restaurants.filter(restaurant => 
                restaurant.cuisine.toLowerCase().includes(cuisineType)
            );
            loadRestaurants(filteredRestaurants);
        });
    });
});

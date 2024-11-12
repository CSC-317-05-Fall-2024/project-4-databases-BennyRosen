/* This file should contain any DOM manipulation
needed to populate the header, nav, and footer elements
*/
const header = document.querySelector('header');
header.innerHTML = `
    <h1>Traveler / Attractions Page</h1>
    <nav class="navbar">
        <img id="planets" src="https://picsum.photos/seed/picsum/200/300" alt="Travel Destination">
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#attractions">Attractions</a></li>
            <li><a href="#restaurants">Restaurants</a></li>
        </ul>
    </nav>
`;

const footer = document.querySelector('footer');
footer.innerHTML = `
<p>Contact info: Brosen1@sfsu.edu</p>
`;
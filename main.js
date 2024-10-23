const apiClient = "https://randomuser.me/api/";
let clientes;

async function DataClient() {
    try {
        // Fetch para el dólar clientes
        let responseclientes = await fetch(apiClient);
        let dataclientes = await responseclientes.json();
        clientes = dataclientes.results[0];
        console.log("Datos del cliente:", clientes);
        document.getElementById('usuario').textContent = `Ingresa un tipo de Pokémon Para: ${clientes.name.first}`;
    } catch (error) { console.error('Error:', error); }
}
window.onload = DataClient;

let pokemonTypes = [];

// Función para obtener tipos de Pokémon desde la API
async function fetchPokemonTypes() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type/');
        const data = await response.json();
        pokemonTypes = data.results.map(type => type.name); // Extrae solo los nombres de los tipos
        console.log('Tipos de Pokémon obtenidos:', pokemonTypes);
    } catch (error) {
        console.error('Error al obtener los tipos de Pokémon:', error);
    }
}

// Llamada a la función para obtener tipos al cargar la página
fetchPokemonTypes();

const input = document.getElementById('mi-input');
const suggestionsContainer = document.getElementById('suggestions');
const searchButton = document.getElementById('search-button');

// Mostrar sugerencias a medida que el usuario escribe
input.addEventListener("keyup", (e) => {
    const query = e.target.value.toLowerCase();
    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias anteriores

    if (query !== "") {
        const filteredTypes = pokemonTypes.filter(type => type.includes(query));

        if (filteredTypes.length > 0) {
            filteredTypes.forEach(type => {
                const suggestionItem = document.createElement('div');
                suggestionItem.textContent = type;
                suggestionItem.classList.add('suggestion-item');
                suggestionsContainer.appendChild(suggestionItem);
                suggestionItem.addEventListener("click", () => {
                    input.value = type;  // Al hacer clic en la sugerencia, rellena el input
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                    // Realiza la búsqueda automáticamente al hacer clic en una sugerencia
                    searchPokemonByType(type);
                });
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    } else {
        suggestionsContainer.style.display = 'none';
    }
});

// Función para buscar Pokémon por tipo
const searchPokemonByType = async (tipo) => {
    const apiType = `https://pokeapi.co/api/v2/type/${tipo}`;

    try {
        // Fetch para obtener todos los Pokémon de un tipo
        let response = await fetch(apiType);
        let data = await response.json();
        let pokemonList = data.pokemon;

        console.log("Pokémon del tipo:", tipo, pokemonList);

        // Limpiar los resultados anteriores
        let resultados = document.getElementById('resultados');
        resultados.innerHTML = '';

        // Mostrar la lista de Pokémon
        resultados.innerHTML = `<h3>Pokémon de tipo ${tipo}:</h3>`;
        let pokemonHTML = '<div class="pokemon-list">';

        // Recorrer los Pokémon y mostrar los primeros 10 con imagen
        for (let i = 0; i < Math.min(pokemonList.length, 10); i++) {
            let poke = pokemonList[i];
            let pokemonResponse = await fetch(poke.pokemon.url);
            let pokemonData = await pokemonResponse.json();

            pokemonHTML += `
                    <div class="pokemon-item">
                        <p>${poke.pokemon.name}</p>
                        <img src="${pokemonData.sprites.other.showdown.front_default}" alt="${poke.pokemon.name}">
                    </div>
                `;
        }

        pokemonHTML += '</div>';
        resultados.innerHTML += pokemonHTML;

    } catch (error) {
        console.error('Error al obtener los Pokémon:', error);
        document.getElementById('resultados').textContent = "Error al obtener los Pokémon.";
    }
};

// Buscar Pokémon por tipo cuando el usuario haga clic en "Buscar"
searchButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto
    const tipo = input.value.toLowerCase();
    searchPokemonByType(tipo);
});
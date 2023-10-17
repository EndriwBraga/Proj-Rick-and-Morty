const charsContainer = document.querySelector('.chars-container');
const searchInput = document.querySelector('#search')
const speciesFilter = document.querySelector('#species');
const genderFilter = document.querySelector('#gender');
const statusFilter = document.querySelector('#status');
const loadMoreButton = document.querySelector('#load-more')
const noCharactersFound = document.querySelector('#noCharactersFound');

const API = 'https://rickandmortyapi.com/api';
const defaultFilters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1
}

async function getCharacters({ name, species, gender, status, page = 1 }) {
    try {
        const response = await fetch(`${API}/character?name=${name}&species=${species}&gender=${gender}&status=${status}&page=${page}`);

        if (!response.ok) {
            throw new Error('Não foi possível obter os personagens. Por favor, tente novamente.');
        }
        const characters = await response.json();
        return characters.results;
    } catch (error) {
        console.error('Não localizei na base de dados:', error.message);
        return []; 
    }
}

async function render({ characters }) {

    if (characters && characters.length > 0) {
        characters.forEach((character) => {
            charsContainer.innerHTML += `
                <div class="char">
                    <img src="${character.image}" alt="">
                    <div class="char-info">
                        <h3>${character.name}</h3>
                        <span>${character.species}</span>
                    </div>
                </div>`;
        });
    } else {
        return noCharactersFound.innerHTML = ` <p>Todos os personagem possiveis já foram carregados, por favor refaça o filtro.</p> ` 
    } 
}

function handleFilterChange(type, event){
    return async () => {
            defaultFilters[type] = event.target.value
            charsContainer.innerHTML = ''
            const characters = await getCharacters(defaultFilters)
            render({characters})
    }
}

async function handleLoadMore(){
    defaultFilters.page += 1
    const characters = await getCharacters(defaultFilters)
    render({characters})
}

function addListeners () {
    speciesFilter.addEventListener('change', (event) =>{
        handleFilterChange('species', event) ()
    });
    
    genderFilter.addEventListener('change', (event) =>{
        handleFilterChange('gender', event) ()
    });
    
    statusFilter.addEventListener('change', (event) =>{
        handleFilterChange('status', event) ()
    });
    
    searchInput.addEventListener('keyup', (event) =>{
        handleFilterChange('name', event) ()
    })

    loadMoreButton.addEventListener('click', handleLoadMore);
}

const DEBOUNCE_DELAY = 800;

let debounceTimeout;

function debounceSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        const searchTerm = searchInput.value;
        defaultFilters.name = searchTerm;
        charsContainer.innerHTML = '';
        const characters = await getCharacters(defaultFilters);
        render({ characters });
    }, DEBOUNCE_DELAY);
}

function handleSearchInputChange() {
    noCharactersFound.innerHTML = '';
    debounceSearch();
}

searchInput.addEventListener('keyup', handleSearchInputChange);

async function main() {
    const characters = await getCharacters(defaultFilters);
    addListeners();
    render({ characters });
}

main();
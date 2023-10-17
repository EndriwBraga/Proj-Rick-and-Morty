const charsContainer = document.querySelector('.chars-container');


const API = 'https://rickandmortyapi.com/api';
const defaultFilters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1
}

async function getCharacters({ name, species, gender, status, page = 1}) {
    const response = await fetch(`${API}/character?name=${name}&species=${species}&gender=${gender}&status=${status}&page=${page}`)
    const characters = await response.json()

    return characters.results
    
}

async function render ({characters}) {
    characters.forEach((character) =>{

        return charsContainer.innerHTML += `
        <div class="char">
            <img src="${character.image}" alt="">
            <div class="char-info">
                <h3>${character.name}</h3>
                <span>${character.species}</span>
            </div>
        </div> `
        
    })
}



async function main(){
    const characters = await getCharacters(defaultFilters);
    render({characters});
}

main()
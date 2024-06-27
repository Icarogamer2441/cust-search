import './style.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfsytmuuslufcycsgyyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmc3l0bXV1c2x1ZmN5Y3NneXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1MTIzNDcsImV4cCI6MjAzNTA4ODM0N30._nN4mFd01avpv6nDdDg6Dcwg6-kGK3S2xr2xRrCbjdM';
const supabase = createClient(supabaseUrl, supabaseKey);

document.querySelector('#app').innerHTML = `
    <h1>Custom search</h1>
    <form id="add-link-form">
        <h2>Add a New Link</h2>
        <input type="text" id="title" placeholder="Title" required>
        <textarea id="about" placeholder="About" required></textarea>
        <input type="text" id="author" placeholder="Author" required>
        <input type="text" id="link" placeholder="Link" required>
        <button type="submit">Add Link</button>
    </form>
    <form id="search-form">
        <h2>Search for Links</h2>
        <input type="text" id="search-title" placeholder="Title" required>
        <button type="submit">Search</button>
    </form>
    <div class="search-results" id="search-results"></div>
    <button id="show-titles">Show All Titles</button>
    <div id="titles-modal" class="modal">
        <h2>All Titles</h2>
        <ul id="titles-list"></ul>
        <button id="close-modal">Close</button>
    </div>
`;

const addLinkForm = document.getElementById('add-link-form');
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');
const titlesModal = document.getElementById('titles-modal');
const titlesList = document.getElementById('titles-list');
const showTitlesBtn = document.getElementById('show-titles');
const closeModalBtn = document.getElementById('close-modal');

addLinkForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const about = document.getElementById('about').value;
    const author = document.getElementById('author').value;
    const link = document.getElementById('link').value;

    const { data, error } = await supabase
        .from('requests')
        .insert([{ title, about, author, link }]);

    if (error) {
        alert('Error adding link: ' + error.message);
    } else {
        alert('Link added successfully');
        addLinkForm.reset();
    }
});

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('search-title').value;

    const { data, error } = await supabase
        .from('requests')
        .select('*')
        .ilike('title', `%${title}%`);

    searchResults.innerHTML = '';

    if (error) {
        searchResults.innerHTML = 'Error searching for links: ' + error.message;
    } else if (data.length === 0) {
        searchResults.innerHTML = 'No links found';
    } else {
        data.forEach(link => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result';
            resultDiv.innerHTML = `
                <h3>${link.title}</h3>
                <p>${link.about}</p>
                <p><strong>Author:</strong> ${link.author}</p>
                <p><strong>Link:</strong> <a href="${link.link}" target="_blank">${link.link}</a></p>
            `;
            searchResults.appendChild(resultDiv);
        });
    }
});

showTitlesBtn.addEventListener('click', async () => {
    const { data, error } = await supabase
        .from('requests')
        .select('title');

    if (error) {
        alert('Error fetching titles: ' + error.message);
    } else {
        titlesList.innerHTML = '';
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.title;
            titlesList.appendChild(listItem);
        });
        titlesModal.classList.add('visible');
    }
});

closeModalBtn.addEventListener('click', () => {
    titlesModal.classList.remove('visible');
});

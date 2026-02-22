// --- DOM Elements ---
const input = document.querySelector('input');
const btn = document.querySelector('button');
const card = document.querySelector('.card');
const loading = document.getElementById('loading');
const repos_container = document.querySelector('.repos');


// --- API Fetch Functions ---
async function user(username) {
    const resp = await fetch(`https://api.github.com/users/${username}`)
    const respData = await resp.json()
    console.log(respData);
    return respData

}


// Fetches the user's details from the GitHub API
repos('prodev2004')
async function repos(username) {
    const resp = await fetch(`https://api.github.com/users/${username}/repos`)
    const respData = await resp.json()

    return respData
}


// Fetches the most used language in that particular repository
async function add_repo() {
    const reposData = await repos(input.value)
    console.log(reposData);
    repos_container.innerHTML = reposData.map(repo => {
        // Some repos might not have a language assigned, so a fallback just in case
        const lang = repo.language ? repo.language : 'Not specified';

        return `
        <div class="card">
            <h2>${repo.name}</h2>
            <div class="repo-stats" style="margin: 10px; font-size: 0.9rem; color: #ccc;">
                <span style="margin-right: 15px;">⭐ ${repo.stargazers_count}</span>
                <span style="margin-right: 15px;">🍴Forks: ${repo.forks_count}</span>
                <span style="margin-right: 5px;">💻 Mostly Used: ${lang}</span>
            </div>
            <a href="${repo.html_url}" target="_blank">Take a look at this repo ></a>
        </div>
    `
    }).join('')
}



// Event Listener
btn.addEventListener('click', async () => {
    const input_val = input.value;



    // 1. Show spinner & hide old results
    loading.style.display = 'block';
    card.style.display = 'none';
    repos_container.style.display = 'none';



    try {
        const search_result = await user(input_val);

        if (!search_result.login) {
            alert('Invalid Username!');
        } else {
            // Wait for repositories to load before showing the profile card.
            await add_repo();

            
            card.innerHTML = `
                <div class="avatar">
                    <img src="${search_result.avatar_url}" alt="">
                </div>
                <div class="info">
                    <h2>${search_result.name || search_result.login}</h2>
                    <p>${search_result.login}</p>
                    <div class="follow-info" style="margin-left: 55px;">
                        <div class="single">
                            <span>${search_result.followers}</span>
                            <span>Followers</span>
                        </div>
                        <div class="single">
                            <span>${search_result.following}</span>
                            <span>Following</span>
                        </div>
                    </div>
                    <div class="single" style="margin-left: 55px;">
                        <span>${search_result.public_repos}</span>
                        <span>Repos</span>
                    </div>
                     <p class="bio">${search_result.bio}</p>
                    </div>
                </div>


                <a href="${search_result.html_url}" target="_blank">Visit Github Profile</a>
            `;

            // 2. Show the populated card
            card.style.display = 'flex';
            repos_container.style.display = 'block';
        }
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        // 3.hide the spinner when finished
        loading.style.display = 'none';
    }
});

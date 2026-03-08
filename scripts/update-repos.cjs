const https = require('https');
const fs = require('fs');
const path = require('path');

const USERNAME = 'KodeKenobi';
const OUTPUT_FILE = path.join(__dirname, '../src/data/repos.json');

const options = {
    hostname: 'api.github.com',
    path: `/users/${USERNAME}/repos?sort=updated&per_page=100`,
    headers: {
        'User-Agent': 'NodeJS',
        'Accept': 'application/vnd.github.v3+json'
    }
};

const token = process.env.GITHUB_TOKEN;
if (token) {
    options.headers['Authorization'] = `token ${token}`;
}

console.log(`Fetching repositories for ${USERNAME}...`);

https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const repos = JSON.parse(data);
            const filtered = repos.filter(r =>
                !r.fork &&
                r.name.toLowerCase() !== 'thuis' &&
                !r.name.toLowerCase().includes('trevnoctilla')
            );

            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filtered, null, 2));
            console.log(`Successfully updated ${OUTPUT_FILE} with ${filtered.length} repositories.`);
        } else {
            console.error(`Failed to fetch. Status: ${res.statusCode}`);
            console.error(data);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching repositories:', err.message);
});

const core = await import('@actions/core');
const github = await import('@actions/github');
const fs = await import('node:fs');

const files = core.getInput('files').split(" ");
const token = core.getInput("token");

files.forEach(async(file) => {
        if(!file.startsWith("domains")) return;
        const data = fs.readFileSync(file, 'utf8');
        let json = JSON.parse(data);

        const username = json.owner.username;
        if(username === "is-a-dev") return;

        const api = await fetch("https://api.github.com/users/" + username, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const api_json = await api.json();
        if(!api_json.hasOwnProperty("id")) {
            return;
        }
        json.owner.github_id = api_json.id;

        await fs.writeFileSync(file, JSON.stringify(json, null, 2));

        console.log("Updating " + file + " with github_id as " + api_json.id);
});
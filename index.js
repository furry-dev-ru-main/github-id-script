const core = await import('@actions/core');
const github = await import('@actions/github');
const fs = await import('node:fs');

const files = core.getInput('files').split(" ");
for(const file of files) {
    if(!file.startsWith("domains")) continue;
    const data = fs.readFileSync(file, 'utf8');
    let json = JSON.parse(data);

    const username = json.owner.username;
    if(username === "is-a-dev") continue;

    const api = await fetch("https://api.github.com/users/" + username);
    const api_json = await api.json();
    if(!api_json.hasOwnProperty("id")) {
        core.setFailed("invalid username");
    }
    json.owner.github_id = api_json.id;

    await fs.writeFileSync(file, JSON.stringify(json, null, 2));

    console.log("Updating " + file + " with github_id as " + api_json.id);
}

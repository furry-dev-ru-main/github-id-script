const core = await import('@actions/core');
const github = await import('@actions/github');
const fs = await import('node:fs');

const files = core.getInput('files').split(" ");
for(const file of files) {
    if(!file.startsWith("domains")) continue;
    const data = fs.readFileSync(file, 'utf8');
    let json = JSON.parse(data);

    if(json.owner.hasOwnProperty("github_id")) {
        console.log("Skipping " + file + " as github_id is already present");
        continue;
    }

    const username = json.owner.username;
    const api = await fetch("https://api.github.com/users/" + username);
    const api_json = await api.json();
    json.owner.github_id = api_json.id;

    await fs.writeFileSync(file, JSON.stringify(json, null, 2));

    console.log("Updating " + file + " with github_id as " + api_json.id);
}

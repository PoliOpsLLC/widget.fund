#!/usr/bin/env node

const fetch = require('node-fetch');
const releaseNotes = require('git-release-notes');
const program = require('commander');
const semver = require('semver');

const baseUrl = 'https://api.github.com/repos/PoliOpsLLC/widget.fund';

const isPreRelease = environ => environ === 'alpha';

const request = async (method, url, token, data) => {
    const options = {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `token ${token}`,
        },
    };
    return fetch(`${baseUrl}${url}`, data ? { ...options, body: JSON.stringify(data) } : options);
};

const getLatestRelease = token => request('GET', '/releases/latest', token).then(resp => resp.json());

const getReleases = token => request('GET', '/releases', token).then(resp => resp.json());

const nameRelease = async (environ, token, print = true) => {
    const releases = await getReleases(token);
    const latest = releases[0].name;
    const release = isPreRelease(environ) ?
        `v${semver.inc(latest, 'prerelease', environ)}` :
        `v${semver.inc(latest, 'minor')}`;
    if (print) console.log(release);
    return release;
};

const getNamedTag = async (name, token) => {
    const resp = await request('GET', `/releases/tags/${name}`, token);
    return resp.ok && resp.json();
};

const getReleaseNotes = async (token, head = 'HEAD') => {
    const release = await getLatestRelease(token);
    return releaseNotes({}, `${release.tag_name}..${head}`, 'scripts/github_release_template.ejs')
        .catch(err => console.error(err));
};

const createRelease = async (ref, environ, token, changes = false) => {
    const name = await nameRelease(environ, token, false);
    const existing = await getNamedTag(name, token);
    const body = await getReleaseNotes(token);
    const data = {
        tag_name: name,
        target_commitish: ref,
        name,
        body,
        prerelease: isPreRelease(environ),
    };
    const resp = await (
        existing.id ?
            request('PATCH', `/releases/${existing.id}`, token, data) :
            request('POST', '/releases', token, data)
    );
    if (resp.ok) {
        console.log(`created release ${name}`);
        return;
    }
    console.error('create-release failed', resp);
    process.exit(1);
};

program
    .command('name-release <environ> <token>')
    .option('-e, --environ', 'which environment this release is for')
    .option('-t, --token', 'github API token')
    .action(nameRelease);

program
    .command('create-release <ref> <environ> <token> [include-changes]')
    .option('-r, --ref', 'ref to create a release for; branch, tag, SHA')
    .option('-e, --environ', 'which environment this release is for')
    .option('-t, --token', 'github API token')
    .option('-c, --include-changes', 'include change logs in release body')
    .action(createRelease);

program.parse(process.argv);

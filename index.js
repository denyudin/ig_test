const readline = require('readline');

const ig = require('./ig');
const { defaultProfileName } = require('./config');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

try {
    rl.question(`Enter instagram profile name (default: ${defaultProfileName}): `, async (profileName) => {
        const profile = await ig.getProfile(profileName || defaultProfileName);

        console.log('Result:', profile);

        rl.close();
    });
} catch (e) {
    console.error(e.message);
}
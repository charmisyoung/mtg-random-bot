require('dotenv').config();
const { REST, Routes } = require('discord.js');

// 1. Define the commands
const commands = [
    {
        name: 'random',
        description: 'Fetches a random commander from Scryfall',
    },
];

// 2. Prepare the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// 3. Send the command list to Discord
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
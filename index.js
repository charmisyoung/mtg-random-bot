require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const SCRYFALL_RANDOM_URL = 'https://api.scryfall.com/cards/random?q=is%3Acommander';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'random') {
        await interaction.deferReply();

        try {
            const response = await fetch(SCRYFALL_RANDOM_URL);
            const card = await response.json();

            if (!response.ok || !card) {
                throw new Error('Failed to fetch card');
            }

            const imageUri = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal;
            const cardName = card.name;
            const edhrecUrl = card.related_uris?.edhrec || card.scryfall_uri;

            // 1. Build the Button
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('View on EDHREC')
                        .setStyle(ButtonStyle.Link)
                        .setURL(edhrecUrl)
                );

            // 2. Send Response
            // Change: used '### ' (Heading 3) instead of '# ' (Heading 1)
            await interaction.editReply({
                content: `Your random commander is:\n### ${cardName}`,
                files: [imageUri],
                components: [row]
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply('Error fetching data from Scryfall.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
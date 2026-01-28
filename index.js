require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const SCRYFALL_URL = 'https://api.scryfall.com/cards/random?q=is:commander+-is:digital';

// Helper to ensure the URL slug matches EDHREC's format
const slugify = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .trim();
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'random') {
        await interaction.deferReply();

        const fetchCommander = async (isVeto = false) => {
            try {
                const response = await fetch(SCRYFALL_URL);
                const card = await response.json();

                if (!response.ok || !card) throw new Error('Failed to fetch card');

                // Skip cards not on EDHREC
                if (!card.edhrec_rank) {
                    console.log(`Skipping ${card.name}: No EDHREC rank.`);
                    return fetchCommander(isVeto);
                }

                const imageUri = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal;
                const edhrecDecksUrl = `https://edhrec.com/decks/${slugify(card.name)}`;

                // 1. Build Buttons
                const edhrecBtn = new ButtonBuilder()
                    .setLabel('View on EDHREC')
                    .setStyle(ButtonStyle.Link)
                    .setURL(edhrecDecksUrl);

                const vetoBtn = new ButtonBuilder()
                    .setCustomId('veto_roll')
                    .setLabel('Veto (0/2)')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder().addComponents(edhrecBtn, vetoBtn);

                const content = `Your random commander is:\n### ${card.name}`;

                // 2. Send/Update Response
                const responseMsg = isVeto
                    ? await interaction.editReply({ content, files: [imageUri], components: [row] })
                    : await interaction.editReply({ content, files: [imageUri], components: [row] });

                // 3. Setup Veto Collector (5 minute window)
                const collector = responseMsg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 300000
                });

                const voters = new Set();

                collector.on('collect', async i => {
                    if (i.customId !== 'veto_roll') return;

                    // Toggle logic: If they are in the set, remove them. If not, add them.
                    if (voters.has(i.user.id)) {
                        voters.delete(i.user.id);
                    } else {
                        voters.add(i.user.id);
                    }

                    // Majority Check (Threshold of 2)
                    if (voters.size >= 2) {
                        collector.stop('vetoed');
                        await i.update({
                            content: `🚫 **${card.name}** was vetoed! Finding a new one...`,
                            components: [],
                            files: []
                        });
                        return fetchCommander(true);
                    }

                    // Update the button label dynamically (e.g., Veto (1/2) or Veto (0/2))
                    await i.update({
                        components: [new ActionRowBuilder().addComponents(
                            edhrecBtn,
                            ButtonBuilder.from(vetoBtn).setLabel(`Veto (${voters.size}/2)`)
                        )]
                    });
                });


            } catch (error) {
                console.error(error);
                await interaction.editReply('Error fetching data from Scryfall.');
            }
        };

        await fetchCommander();
    }
});

client.login(process.env.DISCORD_TOKEN);
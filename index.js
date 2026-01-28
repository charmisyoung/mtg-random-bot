const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    REST,
    Routes
} = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- Helper Functions ---

/**
 * Normalizes card names for EDHREC URLs (lowercase, hyphens instead of spaces, no special chars).
 */
const slugify = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .trim();
};

/**
 * Main logic to fetch a commander and handle the veto process.
 */
const executeRandomCommander = async (interaction) => {
    const scryfallUrl = 'https://api.scryfall.com/cards/random?q=is:commander+-is:digital';

    try {
        const response = await fetch(scryfallUrl);
        const card = await response.json();

        // Check if the card has an EDHREC rank. If not, it's likely not on the site.
        if (!card.edhrec_rank) {
            console.log(`Skipping ${card.name}: No EDHREC data found.`);
            return executeRandomCommander(interaction);
        }

        const edhrecUrl = `https://edhrec.com/commander/${slugify(card.name)}`;
        const archidektUrl = `https://archidekt.com/search/decks?commander=${encodeURIComponent(card.name)}`;

        // Create the Veto Button
        const vetoButton = new ButtonBuilder()
            .setCustomId('veto_roll')
            .setLabel('Veto (0/3)')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(vetoButton);

        const content = `🎲 **Your Random Commander is:\n### ${card.name}**\n` +
            `**Next Steps:**\n` +
            `1. 💡 [Inspiration on EDHREC](${edhrecUrl})\n` +
            `2. 🃏 [Find a Decklist on Archidekt](${archidektUrl})\n` +
            `3. 📥 Copy the deck URL into TTS and play!\n\n` +
            `*Priority is FUN and learning. Use best judgment on power!*`;

        // If this is a reroll from a veto, we edit the original message.
        // Otherwise, it's a fresh reply.
        const responseMsg = interaction.replied || interaction.deferred
            ? await interaction.editReply({ content, components: [row] })
            : await interaction.reply({ content, components: [row], fetchReply: true });

        // Setup Collector for Veto Button (5-minute window)
        const collector = responseMsg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000
        });

        const voters = new Set();

        collector.on('collect', async i => {
            // Check if user already voted to prevent spamming
            if (voters.has(i.user.id)) {
                return i.reply({ content: "You've already voted to veto!", ephemeral: true });
            }

            voters.add(i.user.id);

            // Majority Check (3 votes)
            if (voters.size >= 3) {
                await i.update({ content: `🚫 **${card.name}** was vetoed by majority vote! Rolling again...`, components: [] });
                collector.stop('vetoed');
                return executeRandomCommander(interaction);
            }

            // Update label to show progress
            await i.update({
                components: [new ActionRowBuilder().addComponents(
                    ButtonBuilder.from(vetoButton).setLabel(`Veto (${voters.size}/3)`)
                )]
            });
        });

    } catch (error) {
        console.error('Error fetching commander:', error);
        const errorMsg = 'Failed to fetch a commander. Scryfall might be down!';
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply(errorMsg);
        } else {
            await interaction.reply(errorMsg);
        }
    }
};

// --- Discord Bot Lifecycle ---

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Register the slash command
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const commands = [{
        name: 'random',
        description: 'Roll a random commander with EDHREC support and veto options.'
    }];

    (async () => {
        try {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            console.log('Successfully registered /random command.');
        } catch (error) {
            console.error(error);
        }
    })();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'random') {
        await executeRandomCommander(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
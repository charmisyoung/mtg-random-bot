🎲 Random Commander Bot

A dedicated Discord bot for our Virtual Pod Random Commander homebrew format. This bot ensures a truly random, non-curated experience by pulling directly from the Scryfall API and providing immediate links to community-built decks.

🏛 The Format

Random Commander is a "Sealed-style" deck-building challenge. In our virtual environment, where card availability is not a barrier, we focus on the challenge of building around a randomly assigned leader.
How to Play

    Summon: Type /random in the designated Discord channel.

    Accept your Fate: The bot will assign you a commander. You must build a deck around this card.

    The Out Clause: If a commander is truly unplayable or the pod agrees it’s a bad fit, use the Veto button.

    Build & Play: Use the EDHREC Decks button to find inspiration or a pre-made list, then import it into Tabletop Simulator (TTS).

📜 Official Rules

    Casual First: This is a very unserious format. Priority is fun and learning.

    Mandatory Inclusion: You must use the commander you roll. No "soft" rerolling.

    Veto Policy: Rerolls are only allowed via the official bot Veto button (requires a majority of 2 votes).

    Banlist: Standard EDH rules apply. No extra house bans.

    Power Level: Bracket 2 (Core) is the encouraged baseline. Communicate with your pod before the game starts.

🎮 Playing in Tabletop Simulator (TTS)

To get started, subscribe to the Steam Workshop item called 'MTG Deluxe Table [Scripted]'. This mod includes everything you need (importers, life trackers, playmats, etc.).

How to Import your Deck:

    Copy the URL of your chosen deck from its source (Archidekt, Moxfield, MTGGoldfish, etc.)*
        * EDHREC is not technically a deckbuilding site. It serves as an aggregator that scrapes data from the above/similar deckbuilding repos. 
          Therefore, the TTS mod's Importer GUI does not recognize links from EDHREC.

    In TTS: Find the "Importer GUI" chest on the table and click to open.

    Paste & Build: Paste the URL into the Deck site URL field and click Submit.

    Wait: Give it a moment to fetch the card images, and you should see the deck generate on your playmat in TTS.
    

🛠 Technical Setup

Just invite the bot to your server!
https://discord.com/oauth2/authorize?client_id=1466120471320858939&permissions=2147600384&integration_type=0&scope=bot+applications.commands

Bot permissions:
• Send Messages
• Use Slash Commands
• Embed Links
• Attach Files
• Read Message History (Required for the Veto button logic).

This bot is built with discord.js and hosted on a Google Cloud (GCP) e2-micro instance.
Prerequisites

    Node.js v20+

    A Discord Bot Token (via Developer Portal)

    A Scryfall API connection (handled via standard fetch)

Installation (Local Dev)

    Clone the repo:
    Bash

    git clone https://github.com/charmisyoung/mtg-random-bot.git
    cd mtg-random-bot

    Install dependencies:
    Bash

    npm install

    Configure Environment: Create a .env file in the root.
    Code snippet

    DISCORD_TOKEN=your_token_here
    CLIENT_ID=your_client_id_here

    Run with Nodemon (Auto-restart):
    Bash

    npm run dev

🚀 Deployment

The bot is managed on the server using PM2 to ensure 24/7 uptime.

    Restarting the bot: pm2 restart mtg-bot

    Viewing Logs: pm2 logs mtg-bot

    Updating Code: git pull followed by a PM2 restart.

Key Technical Features

    Scryfall Integration: Specifically filters out digital-only (Alchemy) cards and non-commander legends.

    EDHREC Validation: Automatically skips cards that do not have an EDHREC rank to ensure players have resources for their roll.

    Interactive UI: Utilizes Discord Buttons and Action Rows for the Veto and external link system.

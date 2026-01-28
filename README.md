# Random Commander Bot

A Discord bot that assigns random Magic: The Gathering commanders to players for a "sealed-style" homebrew format. Powered by Node.js, Discord.js, and Scryfall.

## The Format
Random Commander is a homebrew format designed for our virtual pods, where building any deck is free. 

Type **/random** to summon the bot and get your assigned commander!

Not feeling creative? Use the EDHREC link button for inspiration, or copy/paste a deck URL directly into TTS to play.

## Rules
- **Casual First:** This is a casual format. Have fun!
- **Strict Assignment:** You must use the commander you roll; build the rest how you like.
- **No Rerolls:** Rerolls are not allowed unless a commander is vetoed by majority vote.
- **Standard Banlist:** Standard EDH rules apply with no extra bans.
- **Power Level:** Use best judgment. The priority is FUN and learning.

## Setup (Local)
1. Clone the repo.
2. Create a `.env` file with `DISCORD_TOKEN` and `CLIENT_ID`.
3. Run `npm install`.
4. Run `node index.js`.

## Tech Stack
- Discord.js v14
- Scryfall API
- Hosted on Google Cloud (e2-micro)

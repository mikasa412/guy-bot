# Discord.js TypeScript Bot Template

A starter template for building Discord bots in TypeScript using Discord.js v14. This template comes pre‑configured with:

- A robust **slash‑command handler**
- An **event handler** with ordered listeners
- **Environment variable** support via a `.env` file
- Example `/ping` command and `ready`/`interactionCreate` events
- TypeScript types and module augmentation for `client.commands`

## Features

- **TypeScript**: Fully typed codebase for better DX and fewer runtime errors
- **Slash Command Handler**: Auto‑loads, caches, and bulk‑deploys slash commands
- **Event Handler**: Auto‑loads event listeners from `src/events/`, with filename ordering
- **Environment Configuration**: `.env` for sensitive data (BOT_TOKEN, CLIENT_ID, GUILD_ID)
- **Example Commands**: Includes a sample `/ping` command
- **Example Events**: Includes `ready` and `interactionCreate` handlers
- **Logging**: Console logs for loaded commands, deployed commands, and handler errors

## Requirements

- Node.js v18 or higher
- npm
- A Discord application with a bot user (token)

## Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/nullpointerexceptionkek/Discord.js-TypeScript-Bot-Template
   cd Discord.js-TypeScript-Bot-Template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create your `.env`**  
   Copy and edit the example:

   ```bash
   cp .env.example .env
   ```

   Fill in:

   ```
   TOKEN=your_bot_token_here
   ```

4. **Start in development**

   ```bash
   npm run dev
   ```

   This uses `ts-node` and restarts on file changes.

5. **Build & run**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
├── src/
│   ├── commands/                   # Slash command modules
│   │   └── utility/
│   │       └── ping.ts             # Example /ping command
│   ├── events/                     # Event listener modules
│   │   ├── ready/
│   │   │   ├── 01-log.ts           # Log “bot is ready”
│   │   │   └── 02-registerCommands.ts  # Load & deploy commands
│   │   └── interactionCreate/
│   │       └── 01-executeCommands.ts  # Dispatch slash commands
│   ├── handlers/
│   │   └── eventhandler.ts         # Generic loader for src/events/
│   ├── types/
│   │   └── discord.d.ts            # Module augmentation for Client.commands
│   ├── utils/                      # Shared utilities (e.g. file loaders)
│   ├── index.ts                    # Bot entrypoint (bootsraps handlers)
│   └── ...
├── .env.example                    # Template for your .env
├── package.json
├── tsconfig.json
└── README.md
```

## How Events Work

- **Folder = event**: Each subfolder under `src/events/` must match a `ClientEvents` name (`ready`, `interactionCreate`, etc.).
- **Files = handlers**: Within each folder, every `.ts`/`.js` file exports a **default async function**:

  ```ts
  // example: src/events/ready/01-log.ts
  import type { Client } from "discord.js";

  export default async function (client: Client) {
    console.log(`Logged in as ${client.user.tag}`);
  }
  ```

- **Ordering**: Handlers are sorted alphabetically by filename.
  - Prefix files with `01-`, `02-`, etc. to control execution order.
- **Registration**: On startup, `handlers/eventhandler.ts`:
  1. Scans `src/events/`,
  2. Imports every handler once,
  3. Registers a single `client.on(eventName, ...)` that fans out to all handlers in parallel,
  4. Logs how many handlers were registered per event.

## Usage

1. **Invite your bot** to your test server
2. **Use `/ping`** to verify it’s online
3. **Check console logs** for:
   - Loaded commands
   - Deployed slash commands
   - Event handlers registered

## Adding Commands

1. **Create** `src/commands/<category>/yourCommand.ts`
2. **Export**:

   ```ts
   import { SlashCommandBuilder, Client, CommandInteraction } from "discord.js";

   export const data = new SlashCommandBuilder()
     .setName("yourcommand")
     .setDescription("Describe what this command does");

   export async function execute(
     client: Client,
     interaction: CommandInteraction
   ) {
     await interaction.reply("Hello from yourcommand!");
   }
   ```

3. **Restart** the bot – commands auto‑load and auto‑deploy on startup.

## Adding Events

1. **Create** `src/events/<eventName>/` if needed
2. **Add** `01-myHandler.ts` exporting a default async function:

   ```ts
   import type { Client } from "discord.js";

   export default async function (client: Client, ...args: any[]) {
     // handle the event
   }
   ```

3. **Prefix** filenames (`01-`, `02-`, etc.) to set order
4. **Restart** the bot – events auto‑load on startup.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

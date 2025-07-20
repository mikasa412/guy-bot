made from the Discord.js TypeScript Bot Template - https://github.com/nullpointerexceptionkek/Discord.js-TypeScript-Bot-Template

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

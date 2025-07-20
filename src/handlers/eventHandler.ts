import fs from "fs";
import path from "path";
import type { Client, ClientEvents } from "discord.js";

type HandlerFn = (client: Client, ...args: any[]) => Promise<void> | void;

// Event Handler assumes directory structure as
// src/events/
// ├── ready/
// │   ├── 01-log.ts
// │   └── 02-registerCommands.ts
// └── interactionCreate/
//     └── handleInteraction.ts

export default function registerEvents(client: Client) {
  const eventsRoot = path.join(__dirname, "..", "events");

  // Find sub‑folders (one per event name)
  const eventFolders = fs
    .readdirSync(eventsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));

  for (const folder of eventFolders) {
    const folderPath = path.join(eventsRoot, folder);

    // Cache all handler files to avoid dynamic imports on every event
    const handlers: HandlerFn[] = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => {
        const mod = require(path.join(folderPath, file));
        if (typeof mod.default !== "function") {
          throw new Error(
            `Event handler "${file}" in "${folder}" has no default export`
          );
        }
        return mod.default as HandlerFn;
      });

    console.log(
      `✅ Registered and cached ${handlers.length} handler(s) for event "${folder}".`
    );

    const listener = (...args: any[]) => {
      void Promise.all(
        handlers.map((fn) =>
          Promise.resolve(fn(client, ...args)).catch((err) =>
            console.error(`[${folder}] handler error:`, err)
          )
        )
      );
    };

    client.on(folder as keyof ClientEvents, listener);
  }

  console.log(`✅ Total event groups loaded: ${eventFolders.length}`);
}

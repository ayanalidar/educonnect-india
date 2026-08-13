// Ensures z-ai-web-dev-sdk config exists — reads from env vars if /etc/.z-ai-config is missing

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export function ensureZaiConfig() {
  const configPaths = [
    path.join(process.cwd(), ".z-ai-config"),
    path.join(os.homedir(), ".z-ai-config"),
    "/etc/.z-ai-config",
  ];

  // Check if any config already exists
  for (const p of configPaths) {
    try {
      if (fs.existsSync(p)) {
        const config = JSON.parse(fs.readFileSync(p, "utf-8"));
        if (config.baseUrl && config.apiKey) return; // Already configured
      }
    } catch {
      // Continue checking
    }
  }

  // Build config from environment variables
  const { ZAI_API_KEY, ZAI_BASE_URL, ZAI_TOKEN, ZAI_CHAT_ID, ZAI_USER_ID } = process.env;

  if (ZAI_API_KEY && ZAI_BASE_URL) {
    const config = {
      baseUrl: ZAI_BASE_URL,
      apiKey: ZAI_API_KEY,
      chatId: ZAI_CHAT_ID || "",
      token: ZAI_TOKEN || "",
      userId: ZAI_USER_ID || "",
    };

    // Write to project root (writable on Vercel/serverless)
    const configPath = path.join(process.cwd(), ".z-ai-config");
    try {
      fs.writeFileSync(configPath, JSON.stringify(config), { mode: 0o600 });
    } catch {
      // If not writable, the SDK will use env vars if we modify the loadConfig
      // For now, the config file approach works in most environments
    }
  }
}

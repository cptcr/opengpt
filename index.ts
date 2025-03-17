import { execSync } from "child_process";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import startDatabase from "./database/startDatabase";

let selectedPackageManager: string | null = null;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function installDependencies(packages: string[], isDev: boolean = false): void {
    if (!selectedPackageManager) {
        rl.question("Select package manager (npm, yarn, pnpm, bun): ", (packageManager) => {
            selectedPackageManager = packageManager;
            rl.close();
            installDependencies(packages, isDev);
        });
        return;
    }

    if (packages.length === 0) {
        console.log("No packages specified for installation.");
        return;
    }
    
    try {
        const packageList = packages.join(" ");
        let command = "";
        
        switch (selectedPackageManager) {
            case "yarn":
                command = `yarn add ${isDev ? "-D" : ""} ${packageList}`;
                break;
            case "pnpm":
                command = `pnpm add ${isDev ? "-D" : ""} ${packageList}`;
                break;
            case "bun":
                command = `bun add ${isDev ? "-d" : ""} ${packageList}`;
                break;
            default:
                command = `npm install ${isDev ? "--save-dev" : "--save"} ${packageList}`;
                break;
        }
        
        console.log(`Installing ${isDev ? "dev" : "prod"} dependencies with ${selectedPackageManager}: ${packageList}`);
        execSync(command, { stdio: "inherit" });
        console.log("Installation complete.");

        // Check for updates
        console.log("Checking for outdated dependencies...");
        execSync(`${selectedPackageManager} update`, { stdio: "inherit" });
        console.log("Update check complete.");
    } catch (error) {
        console.error("Error installing dependencies:", error);
    }
}

const devDependencies = ["@types/node", "typescript", "chalk"];
const dependencies = ["discord.js", "mongoose", "dotenv"];

if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
    installDependencies(devDependencies, true);
    installDependencies(dependencies, false);
} else {
    import("discord.js").then(({ Client, EmbedBuilder, GatewayIntentBits }) => {
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages
            ]
        });
        client.login(process.env.TOKEN);
        startDatabase({
            url: `${process.env.DATABASE_URI}`
        });
    }).catch(error => console.error("Error importing discord.js:", error));
}
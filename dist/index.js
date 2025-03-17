"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const readline = __importStar(require("readline"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const process = __importStar(require("process"));
const startDatabase_1 = __importDefault(require("./database/startDatabase"));
let selectedPackageManager = null;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function installDependencies(packages, isDev = false) {
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
        (0, child_process_1.execSync)(command, { stdio: "inherit" });
        console.log("Installation complete.");
        // Check for updates
        console.log("Checking for outdated dependencies...");
        (0, child_process_1.execSync)(`${selectedPackageManager} update`, { stdio: "inherit" });
        console.log("Update check complete.");
    }
    catch (error) {
        console.error("Error installing dependencies:", error);
    }
}
const devDependencies = ["@types/node", "typescript", "chalk"];
const dependencies = ["discord.js", "mongoose", "dotenv"];
if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
    installDependencies(devDependencies, true);
    installDependencies(dependencies, false);
}
else {
    Promise.resolve().then(() => __importStar(require("discord.js"))).then(({ Client, EmbedBuilder, GatewayIntentBits }) => {
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
        (0, startDatabase_1.default)({
            url: `${process.env.DATABASE_URI}`
        });
    }).catch(error => console.error("Error importing discord.js:", error));
}

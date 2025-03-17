import mongoose from "mongoose";
import chalk from "chalk";

export default async function startDatabase (options: { url: string }) {
    console.log(chalk.green("Connecting to MongoDB..."))

    try {
        await mongoose.connect(options.url);
    } catch (error) {
        console.log(chalk.red("Connection to MongoDB failed!"))
    } finally {
        console.log(chalk.green("Connection to MongoDB success."))
    }
} 
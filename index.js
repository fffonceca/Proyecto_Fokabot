const { Client, GatewayIntentBits, Collection } = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1030261122600800256"
const GUILD_ID = "1052643569283911690"
const prefix = "urf"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
})

client.slashcommands = new Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.on("messageCreate", msg => {
        if (msg.content.startsWith(prefix)) {
            if (msg.content === "urf") {
                if (msg.author.tag.toString() === "Foka#0509") {
                    msg.channel.send("Eres el de rial Foka urf urf")
                    return
                }
                msg.channel.send(`urf urf :seal:`)
                return
            }
            if (msg.content === prefix + " comandos") {
                msg.reply(`:seal: wena, me podi: apretar, atacar, explotar y llorar xD. Me podi preguntar tambien VAS?`)
                return
            }
            if (msg.content === prefix + " VAS?") {
                msg.reply(`holy shit guys`)
                return
            }
            if (msg.content === prefix + " apretar") {
                msg.reply(`https://tenor.com/view/animals-with-captions-funny-animal-seal-gif-25121911`)
                return
            }
            if (msg.content === prefix + " atacar") {
                msg.reply(`https://tenor.com/view/seal-baikal-seal-nico-toba-head-bang-gif-20734367`)
                return
            }
            if (msg.content === prefix + " explotar") {
                msg.reply(`https://tenor.com/view/seal-sea-lion-explode-explosion-scream-gif-25321526`)
                return
            }
            if (msg.content === prefix + " llorar") {
                msg.reply(`https://tenor.com/view/sad-crying-crying-seal-forced-to-seal-crying-gif-20960311`)
                return
            }
        }
    })
    client.login(TOKEN)
}

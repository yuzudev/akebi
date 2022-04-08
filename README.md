# akebi

A lightweight Discord Bot
=========================

## example
```toml
# oasis.toml

[config]
prefix = "->"
botId = "960545626557407323"
token = "Token"
ownerId = "774291406059601920"
intents = [ "Guilds", "GuildMessages" ]
supportGuildId = "960546774710353950"
development = true

[handler]
rootDirectory = ["core"]
loadDirectories = ["commands"]
temporaryFile = true
```
const { Perms } = require("../validations/permissions");
const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Memuat Command");

  CommandsArray = [];

  (await PG(`${process.cwd()}/src/commands/*/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.name)
      return Table.addRow(file.split("/")[7], "❎", "Name tidak ditemukan");

    if (!command.context && !command.description)
      return Table.addRow(command.name, "❎", "Description tidak ditemukan");

    if (command.permission) {
      if (Perms.includes(command.permission)) command.defaultPermission = false;
      else return Table.addRow(command.name, "❎", "Permission tidak valid");
    }

    client.commands.set(command.name, command);
    CommandsArray.push(command);

    await Table.addRow(command.name, "✅");
  });

  console.log(Table.toString());

  // PERMISSION CHECK

  // client.on("ready", async () => {
  //   const Guild = await client.guilds.cache.get("941519741456093194");

  //   Guild.commands.set(CommandsArray).then(async (command) => {
  //     const Roles = (commandName) => {
  //       const cmdPerms = CommandsArray.find(
  //         (c) => c.name === commandName
  //       ).permission;
  //       if (!cmdPerms) return null;

  //       return Guild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
  //     };

  //     const fullPermissions = command.reduce((accumulator, r) => {
  //       const roles = Roles(r.name);
  //       if (!roles) return accumulator;

  //       const permissions = roles.reduce((a, r) => {
  //         return [...a, { id: r.id, type: "ROLE", permission: true }];
  //       }, []);

  //       return [...accumulator, { id: r.id, permissions }];
  //     }, []);

  //     await Guild.commands.permissions.set({ fullPermissions });
  //   });
  // });
};

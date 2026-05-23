const { gmd } = require("../gift");
const { getDevNumbers } = require("../gift/devNumbers");
const { getSudoNumbers } = require("../gift/database/sudo");
const { getSetting } = require("../gift/database/settings");

gmd(
    {
        pattern: "devs",
        alias: ["devlist", "superusers", "supers"],
        react: "👑",
        desc: "List every number with full bot access (owner, devs, sudo).",
        category: "owner",
        filename: __filename,
    },
    async (from, Gifted, conText) => {
        const { reply, react, isSuperUser } = conText;

        if (!isSuperUser) {
            await react("⚠️");
            return reply("⚠️ Owner Only Command!");
        }

        const ownerNumber = (await getSetting("OWNER_NUMBER")) || "";
        const botNum = Gifted?.user?.id?.split(":")[0] || "";
        const devNumbers = await getDevNumbers();
        const sudoNumbers = (await getSudoNumbers()) || [];
        const sudoSetting = ((await getSetting("SUDO_NUMBERS")) || "")
            .split(/[,\s]+/)
            .map((n) => n.trim().replace(/\D/g, ""))
            .filter((n) => n.length > 5);

        const fmt = (list) =>
            list.length ? list.map((n) => `   • ${n}`).join("\n") : "   _(none)_";

        const allSudo = Array.from(new Set([...sudoNumbers, ...sudoSetting]));

        const text =
            `👑 *Bot Super Users*\n\n` +
            `*Owner:*\n   • ${ownerNumber || "_(not set)_"}\n\n` +
            `*Bot:*\n   • ${botNum || "_(not connected)_"}\n\n` +
            `*Dev Numbers* (${devNumbers.length}):\n${fmt(devNumbers)}\n\n` +
            `*Sudo Numbers* (${allSudo.length}):\n${fmt(allSudo)}\n\n` +
            `_All of the above bypass owner-only checks and private mode._`;

        return reply(text);
    },
);

const { gmd } = require("../gift");
const { getRecentLogs, clearLogs } = require("../gift/logError");

gmd(
    {
        pattern: "logs",
        alias: ["errors", "errlog"],
        react: "📜",
        desc: "Show the most recent error logs (owner only).",
        category: "owner",
        filename: __filename,
    },
    async (from, Gifted, conText) => {
        const { q, reply, react, isSuperUser } = conText;

        if (!isSuperUser) {
            await react("⚠️");
            return reply("⚠️ Owner Only Command!");
        }

        const arg = (q || "").trim().toLowerCase();
        if (arg === "clear" || arg === "reset") {
            clearLogs();
            await react("🧹");
            return reply("✔️ Error log buffer cleared.");
        }

        const limit = parseInt(arg, 10);
        const entries = getRecentLogs(Number.isFinite(limit) && limit > 0 ? limit : 20);

        if (!entries.length) {
            return reply("✔️ No errors recorded since startup.");
        }

        const formatted = entries
            .map((e) => {
                const t = e.time.replace("T", " ").replace(/\.\d+Z$/, "Z");
                return `• [${t}] ${e.line}`;
            })
            .join("\n");

        const header = `🪵 *Recent Errors* (showing ${entries.length})\nUsage: *.logs [count]* or *.logs clear*\n\n`;
        return reply(header + "```" + formatted + "```");
    },
);

import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
/** Resolve the frisk binary. Priority: config.binaryPath > FRISK_BIN env > /usr/local/bin/frisk. */
function resolveBinary(configBinary) {
    if (configBinary)
        return configBinary;
    if (process.env.FRISK_BIN)
        return process.env.FRISK_BIN;
    return "/usr/local/bin/frisk";
}
/** Check if args require external network access. Throws if not allowed. */
function checkExternalAccess(args, allowExternal) {
    const needsNetwork = args.some(a => a === "sync" || a === "--slug" || a === "--remote");
    if (needsNetwork && !allowExternal) {
        throw new Error("Blocked: this operation requires network access (threat intel sync or remote repo cloning). " +
            "Set allowExternal: true in plugin config to enable.");
    }
}
async function runFrisk(args, config, timeoutMs = 120000) {
    checkExternalAccess(args, config?.allowExternal === true);
    const bin = resolveBinary(config?.binaryPath);
    const allArgs = [...args, "--json"];
    try {
        const { stdout, stderr } = await execFileAsync(bin, allArgs, { timeout: timeoutMs, maxBuffer: 1024 * 1024 });
        const output = stdout.trim() || stderr.trim();
        try {
            return JSON.parse(output);
        }
        catch {
            return output;
        }
    }
    catch (err) {
        const error = err;
        const detail = error.stderr || error.stdout || error.message || String(err);
        throw new Error(`frisk ${args.join(" ")} failed: ${detail}`);
    }
}
export default defineToolPlugin({
    id: "frisk",
    name: "Frisk",
    description: "Pre-install security audit and vulnerability scanner for ClawHub skills. 9 threat intel sources, 7 checks including malware, dependencies, and credential leaks.",
    configSchema: Type.Object({
        binaryPath: Type.Optional(Type.String({
            description: "Absolute path to the frisk binary. Defaults to /usr/local/bin/frisk.",
        })),
        allowExternal: Type.Optional(Type.Boolean({
            description: "Allow network operations (threat intel sync, remote cloning). Default: false.",
        })),
    }),
    tools: (tool) => [
        tool({
            name: "frisk",
            label: "Frisk Security Audit",
            description: "Run a security audit on a ClawHub skill slug or local path. Checks malware, dependencies, credential leaks, hidden instructions, and supply-chain risks.",
            parameters: Type.Object({
                target: Type.Optional(Type.String({ description: "ClawHub skill slug or local path to audit" })),
                slug: Type.Optional(Type.String({ description: "ClawHub skill slug to audit" })),
                path: Type.Optional(Type.String({ description: "Local path to audit" })),
                sync: Type.Optional(Type.Boolean({ description: "Sync threat intel before auditing" })),
                json: Type.Optional(Type.Boolean({ description: "Output as JSON (default true)", default: true })),
            }),
            async execute({ target, slug, path, sync }, config) {
                const args = [];
                if (slug)
                    args.push("--slug", slug);
                else if (path)
                    args.push(path);
                else if (target)
                    args.push(target);
                if (sync)
                    args.push("sync");
                return runFrisk(args.length ? args : ["--help"], config);
            },
        }),
    ],
});

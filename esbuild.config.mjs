import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import process from "process";
import sveltePreProcess from "svelte-preprocess";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source visit the plugins github repository (https://github.com/denolehov/obsidian-git)
*/
`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
    banner: {
        js: banner,
    },
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: [
        "obsidian",
        "electron",
        "child_process",
        "fs",
        "path",
        "moment",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
    ],
    format: "cjs",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    platform: "browser",
    plugins: [
        esbuildSvelte({
            compilerOptions: {
                css: "injected",
                dev: !prod,
            },
            filterWarnings: (warning) => {
                if (warning.code.startsWith("a11y-")) return false;
                return true;
            },
            preprocess: sveltePreProcess(),
        }),
    ],
    inject: ["polyfill_buffer.js"],
    outfile: "main.js",
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}

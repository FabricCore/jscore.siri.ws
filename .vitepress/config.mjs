import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
    // change base to "/jscore/" for github.io build
    base: "",
    title: "JSCore Documentation",
    description: "The Minecraft-aware JavaScript runtime, do as you will.",
    head: [["link", { rel: "icon", href: "/favicon.png" }]],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            // { text: "Examples", link: "/markdown-examples" },
        ],

        sidebar: {
            "/player/": [
                {
                    text: "Quick Links",
                    collapsed: false,
                    items: [
                        {
                            text: "Community Discord",
                            link: "https://discord.gg/XfSZ5tc7Sk",
                        },
                        {
                            text: "Package Repository",
                            link: "https://github.com/FabricCore/jscore-openrepo",
                        },
                    ],
                },
                {
                    text: "JSCore Basics",
                    collapsed: false,
                    items: [
                        {
                            text: "What is JSCore?",
                            link: "/player/",
                        },
                        {
                            text: "Quick Start",
                            link: "/player/quickstart",
                        },
                        {
                            text: "Built-in Commands",
                            link: "/player/built-in-commands",
                        },
                    ],
                },
                {
                    text: "Using Packages",
                    collapsed: false,
                    items: [
                        {
                            text: "Pully - A Package Manager",
                            link: "/player/package/pully",
                        },
                    ],
                },
            ],
            "/dev/": [
                {
                    text: "Quick Links",
                    collapsed: false,
                    items: [
                        {
                            text: "Community Discord",
                            link: "https://discord.gg/XfSZ5tc7Sk",
                        },
                        {
                            text: "Package Repository",
                            link: "https://github.com/FabricCore/jscore-openrepo",
                        },
                    ],
                },
                {
                    text: "JSCore Basics",
                    collapsed: false,
                    items: [
                        {
                            text: "A Welcoming Note",
                            link: "/dev/",
                        },
                        {
                            text: "Your First Package",
                            link: "/dev/basics/first-package",
                        },
                        {
                            text: "Language Flavour",
                            link: "/dev/basics/language-features",
                        },
                    ],
                },
                {
                    text: "Idiomatic JSCore",
                    collapsed: false,
                    items: [
                        {
                            text: "About This Section",
                            link: "/dev/how-tos/",
                        },
                        {
                            text: "Create Commands",
                            link: "/dev/how-tos/register-commands",
                        },
                        {
                            text: "Listen to Events",
                            link: "/dev/how-tos/listen-to-events",
                        },
                        {
                            text: "Working with Text",
                            link: "/dev/how-tos/working-with-text",
                        },
                        {
                            text: "Manage User Options",
                            link: "/dev/how-tos/managing-config",
                        },
                        {
                            text: "Create Toggles",
                            link: "/dev/how-tos/toggleables",
                        },
                    ],
                },
                {
                    text: "The Dark Arts of JSCore",
                    collapsed: true,
                    items: [
                        {
                            text: "About This Section",
                            link: "/dev/dark-arts/",
                        },
                        {
                            text: "Raw Java Imports",
                            link: "/dev/dark-arts/raw-java",
                        },
                        {
                            text: "Minecraft Internals",
                            link: "/dev/dark-arts/yarnwrap",
                        },
                        {
                            text: "Init Script System",
                            link: "/dev/dark-arts/entry-points",
                        },
                    ],
                },
            ],
        },

        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/FabricCore",
            },
            {
                icon: "matrix",
                link: "https://matrix.to/#/!qrUQMTxUReiPipzwhb:matrix.org?via=matrix.org",
            },
            {
                icon: "discord",
                link: "https://discord.gg/XfSZ5tc7Sk",
            },
        ],
    },
});

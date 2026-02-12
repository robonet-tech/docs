import { defineConfig } from 'vitepress'

export default defineConfig({
  title: ' ',
  description: 'Build and deploy agentic trading bots',

  // Allow dead links for initial setup - these pages will be created in future stories
  ignoreDeadLinks: true,

  themeConfig: {
    logo: 'https://robonet.finance/images/logo/logo.svg',

    nav: [
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is Robonet?', link: '/guide/' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'User Guides',
          items: [
            { text: 'Chat Interface', link: '/guide/chat-interface' },
            { text: 'MCP Server Setup', link: '/guide/mcp-server' }
          ]
        },
        {
          text: 'Workflows',
          items: [
            { text: 'Strategy Creation', link: '/guide/strategies' },
            { text: 'Backtesting', link: '/guide/backtesting' },
            { text: 'Optimization', link: '/guide/optimization' },
            { text: 'Allora AI Price Predictions', link: '/guide/allora' },
            { text: 'Polymarket Strategies', link: '/guide/polymarket' },
            { text: 'Deployment', link: '/guide/strategy-deployment' },
          ]
        },
        {
          text: 'Platform Features',
          items: [
            { text: 'Wallet Integration', link: '/guide/wallet' },
            { text: 'Trading Venues', link: '/guide/trading-venues' },
            { text: 'Billing & Credits', link: '/guide/billing' },
            { text: 'MCP Tools Reference', link: '/guide/mcp-tools' },
            { text: 'Agent Skills', link: '/guide/agent-skills' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/robonet-tech' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: '<a href="https://discord.gg/robonet">Discord</a> · <a href="https://x.com/robonetHQ">X.com</a> · <a href="https://github.com/robonet-tech">GitHub</a> · <a href="mailto:support@robonet.finance">Contact Us</a>',
      copyright: 'Copyright © 2026 Robonet Finance'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Robonet' }],
    ['meta', { property: 'og:title', content: 'Robonet Docs' }],
    ['meta', { property: 'og:description', content: 'Deploy Quants at Scale' }],
    ['meta', { property: 'og:url', content: 'https://docs.robonet.finance' }],
    ['meta', { property: 'og:image', content: 'https://docs.robonet.finance/og-image.jpg' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Robonet - Deploy Quants at Scale' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Robonet Docs' }],
    ['meta', { name: 'twitter:description', content: 'Deploy Quants at Scale' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.robonet.finance/og-image.jpg' }]
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})

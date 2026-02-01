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
          text: 'Strategy Workflows',
          items: [
            { text: 'Develop Strategy', link: '/guide/strategies' },
            { text: 'Backtesting', link: '/guide/backtesting' },
            { text: 'Optimization', link: '/guide/optimization' },
            { text: 'Allora AI Price Predictions', link: '/guide/allora' },
            { text: 'Deploy Strategy', link: '/guide/strategy-deployment' },
          ]
        },
        {
          text: 'Platform Features',
          items: [
            { text: 'Wallet Integration', link: '/guide/wallet' },
            { text: 'Trading Venues', link: '/guide/trading-venues' },
            { text: 'Billing & Credits', link: '/guide/billing' },
            { text: 'MCP Tools Reference', link: '/guide/mcp-tools' },
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
      message: '<a href="https://discord.gg/robonet">Discord</a> · <a href="https://x.com/robonethq">X.com</a> · <a href="https://github.com/robonet-tech">GitHub</a> · <a href="mailto:support@robonet.finance">Contact Us</a>',
      copyright: 'Copyright © 2026 Robonet Finance'
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})

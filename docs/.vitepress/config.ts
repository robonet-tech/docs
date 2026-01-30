import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Robonet Documentation',
  description: 'Build and deploy agentic trading bots',

  // Allow dead links for initial setup - these pages will be created in future stories
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/' },
      {
        text: 'User Guides',
        items: [
          { text: 'Chat Interface', link: '/guide/chat-interface' },
          { text: 'MCP Server', link: '/guide/mcp-server' }
        ]
      },
      {
        text: 'Platform Features',
        items: [
          { text: 'Wallet Integration', link: '/guide/wallet' },
          { text: 'Strategy Creation', link: '/guide/strategies' },
          { text: 'Backtesting', link: '/guide/backtesting' },
          { text: 'Optimization', link: '/guide/optimization' },
          { text: 'Allora Integration', link: '/guide/allora' },
          { text: 'Deployment', link: '/guide/strategy-deployment' },
          { text: 'Billing & Credits', link: '/guide/billing' }
        ]
      },
      { text: 'Reference', link: '/reference/' }
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
          text: 'Platform Features',
          items: [
            { text: 'Wallet Integration', link: '/guide/wallet' },
            { text: 'Strategy Creation', link: '/guide/strategies' },
            { text: 'Backtesting', link: '/guide/backtesting' },
            { text: 'Optimization', link: '/guide/optimization' },
            { text: 'Allora Integration', link: '/guide/allora' },
            { text: 'Deployment', link: '/guide/strategy-deployment' },
            { text: 'Billing & Credits', link: '/guide/billing' }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'Architecture', link: '/reference/architecture' },
            { text: 'MCP Tools', link: '/reference/mcp-tools' },
            { text: 'Trading Venues', link: '/reference/trading-venues' },
            { text: 'API Reference', link: '/reference/api' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'Architecture', link: '/reference/architecture' },
            { text: 'MCP Tools', link: '/reference/mcp-tools' },
            { text: 'Trading Venues', link: '/reference/trading-venues' },
            { text: 'API Reference', link: '/reference/api' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/allora-network/robonet' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Built with VitePress | <a href="https://discord.gg/allora">Discord</a> · <a href="https://twitter.com/AlloraNetwork">Twitter</a> · <a href="https://github.com/allora-network/robonet/issues">Report Issues</a> · <a href="mailto:support@allora.network">Contact Us</a>',
      copyright: 'Copyright © 2026 Allora Network'
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

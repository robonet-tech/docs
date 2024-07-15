import { useRouter } from 'next/router'
import { DocsThemeConfig, useConfig, useTheme } from "nextra-theme-docs";
import React, { useEffect, useState } from "react";

const config: DocsThemeConfig = {
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Robonet'
      }
    }
  },
  docsRepositoryBase: 'https://github.com/robonet-finance/docs',
  logo: () => {
    const {theme} = useTheme();
    // make sure to load the logo only when the component is mounted on client side
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      console.log("mounted:", true);
    }, []);

    if (!mounted || !theme) return null;
    
    if (theme === "dark" || theme === "system") {
      return (
          <img width="140" height="52" src="/logo/robonet-logo-dark.svg"/>
      )
    }

    return <img width="140" height="52" src="/logo/robonet-logo-light.svg"/>  
  },
  logoLink: "/",
  head: function useHead() {
    const { title } = useConfig()
    const socialCard = '/logo/logo-shape-white.png'

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content="RoboNet unlocks the next era of DeFi with smarter, autonomous AI agents."
        />
        <meta
          name="og:description"
          content="RoboNet unlocks the next era of DeFi with smarter, autonomous AI agents."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:site:domain" content="robonet.finance" />
        <meta name="twitter:url" content="https://robonet.finance" />
        <meta
          name="og:title"
          content={title ? title + ' – RoboNet' : 'RoboNet'}
        />
        <meta name="og:image" content={socialCard} />
        <meta name="apple-mobile-web-app-title" content="Robonet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </>
    )
  },
  primaryHue: { dark: 74.71, light: 190 },
  primarySaturation: { dark: 75.56, light: 55.78 },
  project: {
    link: 'https://github.com/robonet-tech'
  },
  chat: {
    link: 'https://discord.com/invite/robonet'
  },
  footer: {
    component: (<></>)
  },
  sidebar: {
    autoCollapse: true,
  }
  // ... other theme options
}

export default config;

// Full theme configs here: https://nextra.site/docs/docs-theme/theme-configuration


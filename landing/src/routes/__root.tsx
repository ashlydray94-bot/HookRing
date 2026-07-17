import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "HookRing — Turn Spotify Songs Into Custom Ringtones",
      },
      {
        name: "description",
        content:
          "Browse Spotify, pick your favorite song, trim the perfect clip, and export as a custom ringtone in seconds. No audio engineering needed.",
      },
      { property: "og:title", content: "HookRing — Turn Spotify Songs Into Custom Ringtones" },
      {
        property: "og:description",
        content:
          "Browse Spotify, pick your favorite song, trim the perfect clip, and export as a custom ringtone in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "HookRing — Turn Spotify Songs Into Custom Ringtones",
      },
      {
        name: "twitter:description",
        content:
          "Browse Spotify, pick your favorite song, trim the perfect clip, and export as a custom ringtone in seconds.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

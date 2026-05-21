#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  LEGACY_CNAME,
  TARGET_ORIGIN,
  findLegacyMarkdownRoutes,
  getBrowserRedirectScript,
  getDestinationPath,
  getDestinationUrl,
  legacyRouteVariants,
} from "./redirect-rules.mjs";

const scriptDirectory = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(
  process.argv[2] || path.join(scriptDirectory, ".."),
);
const outputDirectory = path.resolve(
  process.cwd(),
  process.argv[3] || path.join(repoRoot, "quartz", "public"),
);

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function redirectPage(destinationUrl, title = "Pubky Documentation") {
  const escapedDestination = htmlEscape(destinationUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${htmlEscape(title)}</title>
    <link rel="canonical" href="${escapedDestination}">
    <meta http-equiv="refresh" content="0; url=${escapedDestination}">
    <script>
${getBrowserRedirectScript()}
    </script>
  </head>
  <body>
    <p>The Pubky documentation has moved to <a href="${escapedDestination}">${escapedDestination}</a>.</p>
  </body>
</html>
`;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function writeRedirectRoute(route, destinationPath) {
  const cleanRoute = route.replace(/^\/+|\/+$/g, "");
  const destinationUrl = new URL(destinationPath, TARGET_ORIGIN).toString();
  const content = redirectPage(destinationUrl);

  if (!cleanRoute) {
    writeFile(path.join(outputDirectory, "index.html"), content);
    return;
  }

  writeFile(path.join(outputDirectory, `${cleanRoute}.html`), content);
  writeFile(path.join(outputDirectory, cleanRoute, "index.html"), content);
}

const legacyRoutes = findLegacyMarkdownRoutes(repoRoot);
const routes = new Map();

for (const route of legacyRoutes) {
  for (const variant of legacyRouteVariants(route)) {
    const destinationPath = getDestinationPath(variant);
    routes.set(variant, destinationPath);
  }
}

routes.set("404", "/overview/");

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const [route, destinationPath] of routes) {
  writeRedirectRoute(route, destinationPath);
}

writeFile(
  path.join(outputDirectory, "404.html"),
  redirectPage(getDestinationUrl("/404"), "Pubky Documentation Moved"),
);
writeFile(path.join(outputDirectory, "CNAME"), `${LEGACY_CNAME}\n`);
writeFile(path.join(outputDirectory, ".nojekyll"), "");
writeFile(
  path.join(outputDirectory, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${TARGET_ORIGIN}/sitemap-index.xml
`,
);

console.log(
  `Generated ${routes.size} redirect routes in ${path.relative(repoRoot, outputDirectory)}`,
);

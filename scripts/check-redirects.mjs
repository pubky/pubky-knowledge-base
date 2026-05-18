#!/usr/bin/env node

import path from "node:path";
import {
  KNOWN_TARGET_PATHS,
  TARGET_ORIGIN,
  findLegacyMarkdownRoutes,
  getDestinationPath,
  legacyRouteVariants,
} from "./redirect-rules.mjs";

const scriptDirectory = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(
  process.argv[2] || path.join(scriptDirectory, ".."),
);
const legacyRoutes = findLegacyMarkdownRoutes(repoRoot);
const failures = [];
let checked = 0;

for (const route of legacyRoutes) {
  for (const variant of legacyRouteVariants(route)) {
    checked += 1;
    const destinationPath = getDestinationPath(variant, { fallback: false });

    if (!destinationPath || !KNOWN_TARGET_PATHS.has(destinationPath)) {
      failures.push(`${variant || "/"} -> no known target`);
    }
  }
}

if (failures.length > 0) {
  console.error("Redirect check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Checked ${checked} legacy route variants against ${TARGET_ORIGIN}`,
);

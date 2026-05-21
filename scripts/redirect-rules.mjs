import fs from "node:fs";
import path from "node:path";

export const TARGET_ORIGIN = "https://pubky.org";
export const LEGACY_CNAME = "docs.pubky.org";

export const KNOWN_TARGET_PATHS = new Set([
  "/",
  "/overview/",
  "/getting-started/",
  "/tldr/",
  "/faq/",
  "/glossary/",
  "/architecture/",
  "/the-vision-of-pubky/",
  "/comparisons/",
  "/contributing/",
  "/resources/",
  "/troubleshooting/",
  "/explore/concepts/censorship/",
  "/explore/concepts/credible-exit/",
  "/explore/concepts/semantic-social-graph/",
  "/explore/pubkycore/introduction/",
  "/explore/pubkycore/eli5/",
  "/explore/pubkycore/authentication/",
  "/explore/pubkycore/homeserver/",
  "/explore/pubkycore/api/",
  "/explore/pubkycore/sdk/",
  "/explore/pubkycore/security-model/",
  "/explore/pubkycore/pkarr/introduction/",
  "/explore/pubkycore/pkarr/why-pkarr/",
  "/explore/pubkycore/pkarr/getting-started/",
  "/explore/pubkycore/pkarr/expectations/",
  "/explore/pubkycore/pkarr/architecture/",
  "/explore/pubkycore/pkarr/eli5/",
  "/explore/pubky-apps/introduction/",
  "/explore/pubky-apps/eli5/",
  "/explore/pubky-apps/app-specs/",
  "/explore/pubky-apps/app-architectures/introduction/",
  "/explore/pubky-apps/app-architectures/client-homeserver/",
  "/explore/pubky-apps/app-architectures/global-aggregators/",
  "/explore/pubky-apps/app-architectures/custom-backend/",
  "/explore/pubky-apps/indexing-and-aggregation/introduction/",
  "/explore/pubky-apps/indexing-and-aggregation/indexer/",
  "/explore/pubky-apps/indexing-and-aggregation/aggregator/",
  "/explore/pubky-apps/indexing-and-aggregation/pubky-nexus/",
  "/explore/pubky-apps/indexing-and-aggregation/web-server/",
  "/explore/pubky-apps/reference-app/introduction/",
  "/explore/pubky-apps/reference-app/pubky-app/",
  "/explore/pubky-apps/reference-app/features/bookmarks/",
  "/explore/pubky-apps/reference-app/features/layouts/",
  "/explore/pubky-apps/reference-app/features/notifications/",
  "/explore/pubky-apps/reference-app/features/perspectives/",
  "/explore/pubky-apps/reference-app/features/posts/",
  "/explore/pubky-apps/reference-app/features/profiles/",
  "/explore/pubky-apps/reference-app/features/search/",
  "/explore/pubky-apps/reference-app/features/tags/",
  "/explore/pubky-apps/reference-app/features/trends/",
  "/explore/technologies/dht/",
  "/explore/technologies/dns/",
  "/explore/technologies/doh/",
  "/explore/technologies/homegate/",
  "/explore/technologies/http-relay/",
  "/explore/technologies/https/",
  "/explore/technologies/jeb-pubky-ai-bot/",
  "/explore/technologies/key-pair/",
  "/explore/technologies/mainline-dht/",
  "/explore/technologies/paykit/",
  "/explore/technologies/pkdns/",
  "/explore/technologies/pubky-backup/",
  "/explore/technologies/pubky-cli/",
  "/explore/technologies/pubky-docker/",
  "/explore/technologies/pubky-explorer/",
  "/explore/technologies/pubky-moderation/",
  "/explore/technologies/pubky-noise/",
  "/explore/technologies/pubky-ring/",
]);

export const EXACT_REDIRECTS = {
  "": "/",
  index: "/",
  readme: "/",
  tags: "/",
  explore: "/overview/",
  "explore/concepts": "/overview/",
  "explore/technologies": "/overview/",
  "explore/pubkycore": "/explore/pubkycore/introduction/",
  "explore/pubky-core": "/explore/pubkycore/introduction/",
  "explore/pubkycore/pkarr": "/explore/pubkycore/pkarr/introduction/",
  "explore/pubky-core/pkarr": "/explore/pubkycore/pkarr/introduction/",
  "explore/pubkyapp": "/explore/pubky-apps/introduction/",
  "explore/pubky-app": "/explore/pubky-apps/introduction/",
  "explore/pubkyapps": "/explore/pubky-apps/introduction/",
  "explore/pubky-apps": "/explore/pubky-apps/introduction/",
  "explore/pubkyapp/apparchitectures":
    "/explore/pubky-apps/app-architectures/introduction/",
  "explore/pubkyapp/app-architectures":
    "/explore/pubky-apps/app-architectures/introduction/",
  "explore/pubky-app/app-architectures":
    "/explore/pubky-apps/app-architectures/introduction/",
  "explore/pubky-apps/app-architectures":
    "/explore/pubky-apps/app-architectures/introduction/",
  "explore/pubkyapp/backend":
    "/explore/pubky-apps/indexing-and-aggregation/introduction/",
  "explore/pubky-app/backend":
    "/explore/pubky-apps/indexing-and-aggregation/introduction/",
  "explore/pubkyapp/client": "/explore/pubky-apps/reference-app/introduction/",
  "explore/pubky-app/client": "/explore/pubky-apps/reference-app/introduction/",
  "explore/pubkyapp/client/features":
    "/explore/pubky-apps/reference-app/pubky-app/",
  "explore/pubky-app/client/features":
    "/explore/pubky-apps/reference-app/pubky-app/",
  "explore/pubkyapp/client/pubkyapp":
    "/explore/pubky-apps/reference-app/pubky-app/",
  "explore/pubky-app/client/pubky-app":
    "/explore/pubky-apps/reference-app/pubky-app/",
};

export const SEGMENT_REDIRECTS = {
  explore: "explore",
  overview: "overview",
  gettingstarted: "getting-started",
  "getting-started": "getting-started",
  tldr: "tldr",
  faq: "faq",
  glossary: "glossary",
  architecture: "architecture",
  thevisionofpubky: "the-vision-of-pubky",
  "the-vision-of-pubky": "the-vision-of-pubky",
  comparisons: "comparisons",
  contributing: "contributing",
  troubleshooting: "troubleshooting",
  concepts: "concepts",
  censorship: "censorship",
  credibleexit: "credible-exit",
  "credible-exit": "credible-exit",
  semanticsocialgraph: "semantic-social-graph",
  "semantic-social-graph": "semantic-social-graph",
  pubkycore: "pubkycore",
  "pubky-core": "pubkycore",
  pkarr: "pkarr",
  eli5: "eli5",
  authentication: "authentication",
  homeserver: "homeserver",
  api: "api",
  sdk: "sdk",
  securitymodel: "security-model",
  "security-model": "security-model",
  whypkarr: "why-pkarr",
  "why-pkarr": "why-pkarr",
  gettingstartedwithpkarr: "getting-started",
  "getting-started-with-pkarr": "getting-started",
  expectations: "expectations",
  pubkyapps: "pubky-apps",
  "pubky-apps": "pubky-apps",
  appspecs: "app-specs",
  "app-specs": "app-specs",
  apparchitectures: "app-architectures",
  "app-architectures": "app-architectures",
  clienthomeserver: "client-homeserver",
  "client-homeserver": "client-homeserver",
  globalaggregators: "global-aggregators",
  "global-aggregators": "global-aggregators",
  custombackend: "custom-backend",
  "custom-backend": "custom-backend",
  backend: "indexing-and-aggregation",
  "indexing-and-aggregation": "indexing-and-aggregation",
  client: "reference-app",
  "reference-app": "reference-app",
  features: "features",
  indexer: "indexer",
  aggregator: "aggregator",
  pubkynexus: "pubky-nexus",
  "pubky-nexus": "pubky-nexus",
  webserver: "web-server",
  "web-server": "web-server",
  bookmarks: "bookmarks",
  layouts: "layouts",
  notifications: "notifications",
  perspectives: "perspectives",
  posts: "posts",
  profiles: "profiles",
  search: "search",
  tags: "tags",
  trends: "trends",
  technologies: "technologies",
  dht: "dht",
  dns: "dns",
  doh: "doh",
  "do-h": "doh",
  homegate: "homegate",
  httprelay: "http-relay",
  "http-relay": "http-relay",
  https: "https",
  jebpubkyaibot: "jeb-pubky-ai-bot",
  "jeb-pubky-ai-bot": "jeb-pubky-ai-bot",
  keypair: "key-pair",
  "key-pair": "key-pair",
  mainlinedht: "mainline-dht",
  "mainline-dht": "mainline-dht",
  paykit: "paykit",
  pkdns: "pkdns",
  pubkybackup: "pubky-backup",
  "pubky-backup": "pubky-backup",
  pubkycli: "pubky-cli",
  "pubky-cli": "pubky-cli",
  pubkydocker: "pubky-docker",
  "pubky-docker": "pubky-docker",
  pubkyexplorer: "pubky-explorer",
  "pubky-explorer": "pubky-explorer",
  pubkymoderation: "pubky-moderation",
  "pubky-moderation": "pubky-moderation",
  pubkynoise: "pubky-noise",
  "pubky-noise": "pubky-noise",
  pubkyring: "pubky-ring",
  "pubky-ring": "pubky-ring",
};

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".github",
  ".obsidian",
  ".claude",
  ".playwright-mcp",
  "node_modules",
  "quartz",
]);

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripExtension(value) {
  return value.replace(/\.(?:html?|mdx?|xml)$/i, "");
}

export function cleanPathname(pathname) {
  let pathnameOnly = String(pathname || "").split(/[?#]/, 1)[0];
  pathnameOnly = safeDecode(pathnameOnly);
  pathnameOnly = pathnameOnly.replace(/\\/g, "/").replace(/\/+/g, "/");
  pathnameOnly = pathnameOnly.replace(/^\/+|\/+$/g, "");
  pathnameOnly = pathnameOnly.replace(/^pubky-knowledge-base-v2\/?/i, "");
  pathnameOnly = pathnameOnly.replace(/^pubky-knowledge-base\/?/i, "");
  pathnameOnly = stripExtension(pathnameOnly);
  pathnameOnly = pathnameOnly.replace(/\/index$/i, "");

  if (pathnameOnly.toLowerCase() === "index") {
    return "";
  }

  return pathnameOnly;
}

export function cleanSegment(segment) {
  return stripExtension(safeDecode(segment))
    .trim()
    .replace(/^\d+[\s.-]*/, "")
    .replace(/^-+|-+$/g, "");
}

export function segmentKey(segment) {
  return cleanSegment(segment)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function routeKey(pathname) {
  const clean = cleanPathname(pathname);
  if (!clean) {
    return "";
  }

  return clean.split("/").filter(Boolean).map(segmentKey).join("/");
}

function toKebab(value) {
  return cleanSegment(value)
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function normalizeSegment(segment, previousSegment) {
  const key = segmentKey(segment);

  if (key === "pubkyapp" || key === "pubky-app") {
    return previousSegment === "reference-app" ? "pubky-app" : "pubky-apps";
  }

  return SEGMENT_REDIRECTS[key] || toKebab(segment);
}

function withTrailingSlash(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

export function getDestinationPath(pathname, options = {}) {
  const { fallback = true } = options;
  const key = routeKey(pathname);
  const exact = EXACT_REDIRECTS[key];
  if (exact) {
    return withTrailingSlash(exact);
  }

  const clean = cleanPathname(pathname);
  if (!clean) {
    return "/";
  }

  const targetSegments = [];
  for (const segment of clean.split("/").filter(Boolean)) {
    const normalized = normalizeSegment(
      segment,
      targetSegments[targetSegments.length - 1],
    );
    if (normalized && normalized !== "index") {
      targetSegments.push(normalized);
    }
  }

  const targetPath = withTrailingSlash(targetSegments.join("/"));
  if (KNOWN_TARGET_PATHS.has(targetPath)) {
    return targetPath;
  }

  return fallback ? "/overview/" : null;
}

export function getDestinationUrl(pathname, search = "", hash = "") {
  const url = new URL(getDestinationPath(pathname), TARGET_ORIGIN);
  url.search = search || "";
  url.hash = hash || "";
  return url.toString();
}

export function markdownRouteFromFile(repoRoot, filePath) {
  const relative = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  const withoutExtension = relative.replace(/\.mdx?$/i, "");

  if (withoutExtension === "index") {
    return "";
  }

  return withoutExtension.replace(/\/index$/i, "");
}

function readFrontmatter(text) {
  if (!text.startsWith("---\n")) {
    return "";
  }

  const end = text.indexOf("\n---", 4);
  return end === -1 ? "" : text.slice(4, end);
}

function readAliases(filePath) {
  const frontmatter = readFrontmatter(fs.readFileSync(filePath, "utf8"));
  const aliases = [];
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    if (!/^aliases:\s*$/.test(lines[index])) {
      continue;
    }

    for (let aliasIndex = index + 1; aliasIndex < lines.length; aliasIndex++) {
      const line = lines[aliasIndex];
      const match = line.match(/^\s*-\s*["']?([^"']+)["']?\s*$/);
      if (match) {
        aliases.push(match[1]);
        continue;
      }

      if (/^\S/.test(line)) {
        break;
      }
    }
  }

  return aliases;
}

function aliasRouteFromFile(repoRoot, filePath, alias) {
  const route = markdownRouteFromFile(repoRoot, filePath);
  const baseDirectory = route.includes("/")
    ? route.slice(0, route.lastIndexOf("/"))
    : "";
  const aliasPath = alias.replace(/\\/g, "/");
  const resolved = aliasPath.startsWith("/")
    ? aliasPath
    : path.posix.join(baseDirectory, aliasPath);

  return cleanPathname(path.posix.normalize(resolved));
}

function findLegacyMarkdownFiles(repoRoot) {
  const files = [];

  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          walk(path.join(directory, entry.name));
        }
        continue;
      }

      if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
        files.push(path.join(directory, entry.name));
      }
    }
  }

  walk(repoRoot);
  return files.sort();
}

export function findLegacyMarkdownRoutes(repoRoot) {
  const routes = [];

  for (const filePath of findLegacyMarkdownFiles(repoRoot)) {
    routes.push(markdownRouteFromFile(repoRoot, filePath));

    for (const alias of readAliases(filePath)) {
      routes.push(aliasRouteFromFile(repoRoot, filePath, alias));
    }
  }

  return Array.from(new Set(routes)).sort();
}

function legacyKebabPath(route) {
  const clean = cleanPathname(route);
  if (!clean) {
    return "";
  }

  return clean
    .split("/")
    .filter(Boolean)
    .map((segment) => toKebab(segment))
    .join("/");
}

export function legacyRouteVariants(route) {
  const variants = new Set();
  const clean = cleanPathname(route);
  variants.add(clean);

  if (clean) {
    variants.add(clean.toLowerCase());
    variants.add(legacyKebabPath(clean));
    variants.add(getDestinationPath(`/${clean}`).replace(/^\/+|\/+$/g, ""));
  }

  return Array.from(variants).filter((variant) => variant !== undefined);
}

export function getBrowserRedirectScript() {
  return `(() => {
  const targetOrigin = ${JSON.stringify(TARGET_ORIGIN)};
  const exactRedirects = ${JSON.stringify(EXACT_REDIRECTS)};
  const segmentRedirects = ${JSON.stringify(SEGMENT_REDIRECTS)};
  const knownTargetPaths = new Set(${JSON.stringify(Array.from(KNOWN_TARGET_PATHS))});

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function stripExtension(value) {
    return value.replace(/\\.(?:html?|mdx?|xml)$/i, "");
  }

  function cleanPathname(pathname) {
    let pathnameOnly = String(pathname || "").split(/[?#]/, 1)[0];
    pathnameOnly = safeDecode(pathnameOnly);
    pathnameOnly = pathnameOnly.replace(/\\\\/g, "/").replace(/\\/+/g, "/");
    pathnameOnly = pathnameOnly.replace(/^\\/+|\\/+$/g, "");
    pathnameOnly = pathnameOnly.replace(/^pubky-knowledge-base-v2\\/?/i, "");
    pathnameOnly = pathnameOnly.replace(/^pubky-knowledge-base\\/?/i, "");
    pathnameOnly = stripExtension(pathnameOnly);
    pathnameOnly = pathnameOnly.replace(/\\/index$/i, "");
    return pathnameOnly.toLowerCase() === "index" ? "" : pathnameOnly;
  }

  function cleanSegment(segment) {
    return stripExtension(safeDecode(segment))
      .trim()
      .replace(/^\\d+[\\s.-]*/, "")
      .replace(/^-+|-+$/g, "");
  }

  function segmentKey(segment) {
    return cleanSegment(segment)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
  }

  function routeKey(pathname) {
    const clean = cleanPathname(pathname);
    return clean ? clean.split("/").filter(Boolean).map(segmentKey).join("/") : "";
  }

  function toKebab(value) {
    return cleanSegment(value)
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-")
      .toLowerCase();
  }

  function normalizeSegment(segment, previousSegment) {
    const key = segmentKey(segment);
    if (key === "pubkyapp" || key === "pubky-app") {
      return previousSegment === "reference-app" ? "pubky-app" : "pubky-apps";
    }
    return segmentRedirects[key] || toKebab(segment);
  }

  function withTrailingSlash(pathname) {
    if (!pathname || pathname === "/") return "/";
    return "/" + pathname.replace(/^\\/+|\\/+$/g, "") + "/";
  }

  function getDestinationPath(pathname) {
    const exact = exactRedirects[routeKey(pathname)];
    if (exact) return withTrailingSlash(exact);

    const clean = cleanPathname(pathname);
    if (!clean) return "/";

    const targetSegments = [];
    for (const segment of clean.split("/").filter(Boolean)) {
      const normalized = normalizeSegment(segment, targetSegments[targetSegments.length - 1]);
      if (normalized && normalized !== "index") targetSegments.push(normalized);
    }

    const targetPath = withTrailingSlash(targetSegments.join("/"));
    return knownTargetPaths.has(targetPath) ? targetPath : "/overview/";
  }

  const destination = new URL(getDestinationPath(window.location.pathname), targetOrigin);
  destination.search = window.location.search;
  destination.hash = window.location.hash;
  window.location.replace(destination.toString());
})();`;
}

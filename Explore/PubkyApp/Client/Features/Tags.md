---
aliases:
  - "../../../Pubky-App/Client/Features/Tags"
---

Tags are free-text labels that any user can publicly assign to **users** or **[[Posts|posts]]**. They are a core building block of the [[Semantic Social Graph|Semantic Social Graph]], turning everyday social interactions into structured, queryable metadata that powers discovery, filtering, and personalized feeds.

Unlike traditional hashtags where only an author labels their own content, Pubky tags can be applied **by anyone** — you can tag your own profile and posts, and others can tag them too — making them a form of collaborative, crowd-sourced annotation.

## Tag Types

There are two kinds of tags:

1. **User Tags** — A user labels any user's profile, including their own. For example, tagging a peer with "developer", "bitcoin", or "photographer". User tags build up a crowd-sourced description of who someone is.
2. **Post Tags** — A user labels any post, including their own. For example, tagging a post with "insightful", "privacy", or "tutorial". Post tags categorize content from both the author's and the audience's perspective.

Both types work the same way: the tagger, the label, and the target (user or post) are recorded as a relationship in the social graph.

## Purpose

1. **Discovery**: Clicking a tag shows all users or posts that carry that label. Tags also support prefix-based [[Search|search]] (see below).
2. **Categorization**: Tags replace traditional like/dislike mechanics with richer semantic signals. A post can accumulate multiple distinct labels from different people, giving it nuanced context rather than a simple count.
3. **Trending & Hot Tags**: The system tracks which tags are gaining traction over different timeframes (today, this month, all time), powering the [[Trends|Trends]] feature.
4. **Personalization**: Tags feed into [[Perspectives|Perspectives]], where users can save custom-filtered views weighted by specific tags, reach, and other criteria.
5. **Notifications**: When someone tags your post or your profile, you receive a [[Notifications|notification]].
6. **Web of Trust Filtering** (WIP): Tags can be scoped by social distance, so you only see labels from people you actually trust. This is not yet surfaced in the web UI but already supported by the API (see Outlook below).

## How Tags Work

1. A user creates a tag by choosing a label and a target (a user profile or a post). The tag is stored on the tagger's own [[Homeservers|homeserver]] as a `PubkyAppTag` record containing the target URI, the label text, and a timestamp.
2. The [[Indexer|indexer]] (Nexus watcher) detects the new tag event from the homeserver and indexes it into the social graph.
3. The tag is recorded as a **TAGGED** relationship in the graph database, connecting the tagger to the target with the label as metadata.
4. Multiple caches and indexes are updated in parallel: tag counts on the target, tagger lists per label, engagement scores, trending tag rankings, and the tag [[Search|search]] index.
5. The tag is now queryable through the API — other users and clients can see it, filter by it, and discover content through it.

## Tag Counts and Scores

The system maintains several counts for each tagged entity:

- **Total tags**: How many individual tag operations a post or user has received.
- **Unique tags**: How many distinct label strings have been applied (e.g., a post tagged "privacy" by three people still has one unique tag but three total tags).
- **Tagger counts**: How many distinct users applied a given label. A label tagged by many different people carries more signal.

These counts contribute to engagement scoring, which influences how content surfaces in feeds and trends.

## Tag Search

Tags are indexed for prefix-based search. When a user types a partial label, the system returns all matching tags ordered lexicographically. This enables fast, type-ahead discovery of existing tags across the network.

## Outlook: Reach-Based Tag Queries

The Nexus API already supports scoped tag queries that filter results based on the viewer's social graph, but this is not yet exposed in pubky.app. Two reach mechanisms exist:

**Hot tags and taggers** ([source](https://github.com/pubky/pubky-nexus/blob/main/nexus-webapi/src/routes/v0/tag/global.rs)) accept a [`StreamReach`](https://github.com/pubky/pubky-nexus/blob/main/nexus-common/src/types/mod.rs) parameter with the following scopes:

- **Followers** (`reach=followers`) — Only tags from people who follow the given user.
- **Following** (`reach=following`) — Only tags from people the given user follows.
- **Friends** (`reach=friends`) — Only tags from mutual connections.
- **Web of Trust** (`reach=wot`, `wot_1`, `wot_2`, `wot_3`) — Tags from the user's extended trusted network, traversing follow relationships up to the specified depth (defaults to 3).

Example API calls:

- Global (no reach): [`/v0/tags/hot?limit=3`](https://nexus.pubky.app/v0/tags/hot?limit=3)
- Scoped to followers: [`/v0/tags/hot?user_id={pubky}&reach=followers&limit=3`](https://nexus.pubky.app/v0/tags/hot?user_id=ihaqcthsdbk751sxctk849bdr7yz7a934qen5gmpcbwcur49i97y&reach=followers&limit=3)
- Taggers for a label: [`/v0/tags/taggers/pubky?user_id={pubky}&reach=followers`](https://nexus.pubky.app/v0/tags/taggers/pubky?user_id=ihaqcthsdbk751sxctk849bdr7yz7a934qen5gmpcbwcur49i97y&reach=followers&limit=5)

**User tags** ([source](https://github.com/pubky/pubky-nexus/blob/main/nexus-webapi/src/routes/v0/user/tags.rs)) accept a `viewer_id` and `depth` parameter (1–3) for Web-of-Trust filtering:

- Example: [`/v0/user/{pubky}/tags?viewer_id={pubky}&depth=2`](https://nexus.pubky.app/v0/user/ihaqcthsdbk751sxctk849bdr7yz7a934qen5gmpcbwcur49i97y/tags?viewer_id=operrr8wsbpr3ue9d4qj41ge1kcc6r7fdiy6o3ugjrrhi4y77rdo&depth=2)

**Post tags** ([source](https://github.com/pubky/pubky-nexus/blob/main/nexus-webapi/src/routes/v0/post/tags.rs)) do not currently support reach-based filtering. WoT scoping requires an expensive graph traversal per query; for user profiles this cost is justified (you view one profile at a time), but for posts — which appear in bulk in feeds — the overhead would be prohibitive.

Once available on pubky.app, reach filtering will allow two users to look at the same profile or trending tags and see different results depending on their social circles — a key part of how Pubky delivers personalized, trust-aware experiences.
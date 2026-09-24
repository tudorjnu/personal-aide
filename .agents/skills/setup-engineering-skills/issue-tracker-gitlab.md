# Issue tracker: GitLab

Issues and specs live as GitLab issues. Use the [`glab`](https://gitlab.com/gitlab-org/cli) CLI.

## Conventions

- **Create**: `glab issue create --title "..." --description "..."`. Use a heredoc; pass `--description -` to open an editor.
- **Read**: `glab issue view <number> --comments`. Use `-F json` for machine-readable output.
- **List**: `glab issue list -F json` with `--label` filters as needed.
- **Comment**: `glab issue note <number> --message "..."` (GitLab calls comments "notes").
- **Apply / remove labels**: `glab issue update <number> --label "..."` / `--unlabel "..."`. Multiple labels can be comma-separated or repeated.
- **Close**: post the explanation first with `glab issue note <number> --message "..."`, then `glab issue close <number>` (close does not accept a closing comment).

GitLab merge requests are the equivalent of PRs: `glab mr create`, `glab mr view`, `glab mr note`, etc.

`glab` infers the repo from `git remote -v` automatically inside a clone.

## When a skill says "publish to the issue tracker"

Create a GitLab issue.

## When a skill says "fetch the relevant ticket"

Run `glab issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`.

- **Map**: a single issue labelled `wayfinder:map`, holding Notes / Decisions-so-far / Fog. Create with `glab issue create --label wayfinder:map`. On GitLab tiers with native epics, an epic may hold the map instead; a labelled issue works everywhere.
- **Child ticket**: an issue carrying `Part of #<map>` at the top of its description and labels `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Assign the ticket to claim it.
- **Blocking**: use GitLab's native blocking link where available. Add it with the `/blocked_by #<n>` quick action posted as a note (`glab issue note <child> --message "/blocked_by #<blocker>"`). Native blocking links are a Premium/Ultimate feature; on the free tier, fall back to `Blocked by: #<n>, #<n>` at the top of the description. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children, drop any with an open blocker (native `blocked_by` link to an open issue, or an open issue in the `Blocked by` line) or an assignee; first in map order wins.
- **Claim**: `glab issue update <n> --assignee @me`, the session's first write.
- **Resolve**: `glab issue note <n> --message "<answer>"`, then `glab issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.

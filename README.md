# Reading List

A tiny web app for personal reading lists: save articles, mark them read.
Plain Node and TypeScript, zero dependencies.

The next feature, sharing a list with a friend, lives on the user story
board at `docs/STORIES.md`. It is not implemented yet.

## Run

Node 23.6+ runs the TypeScript directly, no build and no install:

    node --watch src/server.ts

Open http://127.0.0.1:8000. The database lands at `data/readinglist.db`
(override with `READINGLIST_DB=<path>`).

## Test

    npm test

Optional: install dev dependencies and type-check with `npx tsc`.
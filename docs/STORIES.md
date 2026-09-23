# User Stories

A personal reading list: save articles worth reading, keep track of what
you finished, and let a friend follow along.

## Reading lists

### Save articles to a list

- **Summary:** Keep articles in one place until you have time for them
- **As a** reader
- **I want to** add an article title and link to my reading list
- **So that** I stop losing links across browser tabs and chat history

#### Acceptance criteria

- **Scenario:** adding an article
  - **Given** I have a reading list
  - **When** I add an article with a title and a link
  - **Then** the article appears in my list as unread

### Track reading progress

- **Summary:** The list shows what is finished and what is waiting
- **As a** reader
- **I want to** mark an item as read and see its state at a glance
- **So that** my list reflects what I actually finished

#### Acceptance criteria

- **Scenario:** finishing an article
  - **Given** my list has an unread item
  - **When** I mark it read
  - **Then** the item stays in the list and shows as read

## Sharing a list

### Share a list with a friend

- **Summary:** Let someone see what I am reading
- **As a** reader
- **I want to** give a friend access to my reading list
- **So that** they can follow along and recommend things from it

#### Acceptance criteria

- **Scenario:** sharing with a friend
  - **Given** my list has items
  - **When** I share it with a friend
  - **Then** my friend can open the list and see every item

### Keep a shared list private

- **Summary:** Nobody outside my invited readers can open the list
- **As a** list owner
- **I want to** control who can open my shared list
- **So that** my reading stays visible only to people I chose

#### Acceptance criteria

- **Scenario:** an uninvited visitor
  - **Given** my list is shared with one friend
  - **When** someone else opens the share link
  - **Then** they cannot see any of my items

### Retire stale access

- **Summary:** Old links stop working
- **As a** list owner
- **I want to** limit shared access with an expiry
- **So that** a link sent months ago does not keep working forever

#### Acceptance criteria

- **Scenario:** an expired link
  - **Given** my list was shared with 30-day access
  - **When** my friend opens the share link after day 30
  - **Then** they can no longer see the list
# Blog

This folder contains blog posts as Markdown files.

## How to add a new post

### 1. Create the Markdown file

Create a new `.md` file in this folder. The filename (without `.md`) is the **slug** used in the URL and to load the post.

Example: `blog/my-new-post.md`

Write standard Markdown. All headings, code blocks, images, tables, and blockquotes are supported.

### 2. Register the post in `index.json`

Add an entry to `blog/index.json`:

```json
{
  "slug": "my-new-post",
  "title": "My New Post Title",
  "date": "March 2026",
  "excerpt": "A short summary shown on the blog card (1-2 sentences).",
  "tags": ["tag1", "tag2"]
}
```

- `slug` → must match the filename exactly (without `.md`)
- `title` → displayed as the card heading
- `date` → displayed at the top of the card
- `excerpt` → short preview text on the card
- `tags` → optional array of topic tags

### 3. Order

Posts are displayed in the order they appear in `index.json`. Put the newest post **first**.

---

That's it — the blog loader (`blog.js`) automatically reads the index and renders the cards. No build step required.

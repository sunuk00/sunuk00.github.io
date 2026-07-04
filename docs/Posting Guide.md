# Publishing your blog post

This section deals with the step-by-step process of how to write and publish posts on your site.
<br></br>

## Make `_pages` directory
Create a directory named `_pages` in root if you do not have it.

```bash
$ mkdir _pages
$ cd _pages
```
<br></br>

## Organize your directory structure

Our theme provides a hierarchical directory structure. You may create subdirectories (let's say `Category A`) in `_pages`, and then all post entities placed in the `Category A` directory will be categorized as such.

```
._pages
├── Category A
├── Category B
|   ├── Subcatecory b
|   ├── Subcatecory c
```
<br></br>

### Note: Make sure all directories have an `index.md` inside of them.

The next step is, placing `index.md` files in both `_pages` directory and its subdirectories. The inner content of each `index.md` should be just two dashed lines as shown below:

```
---
---
```
<br></br>

Or you can type the following command from each directory.

```bash
$ echo -e "---\n---" > index.md
```
<br></br>

Your `_pages` structure now looks like this:

```
._pages
└── index.md
├── Category A
|   └── index.md
├── Category B
|   └── index.md
|   ├── Subcatecory b
|       └── index.md
|   ├── Subcatecory c
|       └── index.md
```
<br></br>

## Write a blog post

Create a post with file extension: `.md` (ex., *Post-name.md*).  

All blog post files must begin with front matter typically used to set a title or other metadata.

**Note that the `title` and `date` fields can't be left blank.** 
<br></br>

For a simple example:

```yml
---
title: "Example Post"
date: "2023-12-01"
---

# Welcome

**Hello world**, this is my first Jekyll blog post.

I hope you like it!
```
<br></br>

### Setting a Post Thumbnail Image

Add `thumbnail` attribute to the post that you'd like to show a representative image when rendered.

```yml
---
title: "Example Post: thumbnail exists"
date: "2023-12-02"
thumbnail: "/assets/img/thumbnail/bricks.webp"
---
```

<img src="https://i.ibb.co/T8Rsb6L/21312.webp" height="400px" align="center"/>
<br></br>

### Category Tag

You can use a grouping of post topics by specifying the `tags` field. It is helpful when you'd like to search related posts or pin them on the bottom of the page.

```yml
---
title: "Classic Literature #1: Romeo and Juliet"
tags:
    - book
    - epic novel
    - romance
date: "2023-12-04"
thumbnail: "/assets/img/thumbnail/nightgardenflower.jpg"
---
```

<img src="https://i.ibb.co/LDKJC7p/1231.webp" height="400px" align="center"/>
<br></br>

Note that the `tags` attribute won't be reflected to the sidebar navigation.
<br></br>

### Bookmark

Setting `bookmark: true` makes the sidebar nav list display the corresponding post entity.

```yml
---
title: "Markdown from A to Z"
tags:
    - user manual
    - markdown
    - writing format
date: "2023-09-05"
thumbnail: "https://i.ibb.co/MRzw6T9/sample.webp"
bookmark: true
---
```

<img src="https://i.ibb.co/2sFZNNK/21313.webp" height="400px" align="center"/>
<br></br>

### Category Description

You can show a short description between the category title and the post list by adding `description` to the `index.md` frontmatter of a category page.

```yml
---
description: Reviewing academic papers to improve English reading and comprehension skills.
nav_order: 5
nav_divider_after: true
---
```

### Sidebar Divider

If you want to visually separate sections in the sidebar, add `nav_divider_after: true` to a top-level category index file such as `Papers/index.md`.

That creates a thick underline after the whole category block, so you can split sections like this:

```
Home
C
C++
Python
Stanford CS231n
Papers
Projects
--------------------
Podcast
    ├── 공부 기록
    └── 일상 기록
DASL Lab
    ├── 공부 기록
    └── 일상 기록
```

### Study / Daily Split

For logs that need to be separated into study and daily records, create a top-level folder and place two child `index.md` files under it.

Example structure:

```
._pages
├── Podcast
|   └── index.md
|   ├── Study
|       └── index.md
|   ├── Daily
|       └── index.md
├── DASL Lab
|   └── index.md
|   ├── Study
|       └── index.md
|   ├── Daily
|       └── index.md
```

Use `nav_order` on each `index.md` to keep the sidebar order stable.
<br></br>

## Example `_pages` structure

Here is the structure introduced in our repo:

```
._pages
└── index.md
└── markdown guide.md
├── Category A
|   └── index.md
|   ├── Subcatecory a
|       └── index.md
|       └── post-01.md
|       └── post-02.md
├── Category B
|   └── index.md
|   ├── Subcatecory b    
|       └── index.md
|       └── post-03.md
|       ├── Subsubcategory 1
|           └── index.md
|           └── post-04.md
|       ├── Subsubcategory 2
|           └── index.md
|           └── post-05.md
|   ├── Subcatecory c
|       └── index.md
```
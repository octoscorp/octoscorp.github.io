---
layout: post
title: Conversion from React
date: 2025-12-23 13:39:00 +1300
tags: website technical
---

Until December 2025, this site was built in React - this post details the process of swapping to using Jekyll.

# React vs Jekyll

Both are frameworks for developing a website... and that's about where the similarities end.

React is a JavaScript framework which defines HTML-like "components" and the ways to combine them [[1]][react]. Unsurprisingly, it picks up a few of the idiosyncracies that come with JavaScript - **dynamic** and asynchronous behaviour among them. The site was originally built using this because it's a popular framework, so learning it was a good way to gain employable skill.

Jekyll is a compilation framework for creating **static** website content [[2]][jekyll]. The basic use case is to specify content simply in Markdown and have it compiled into HTML according to a site theme. It has the benefit of being easier to work with at a code level, as it isn't filled with dynamic cleverness. Jekyll is based in Ruby, but most code we'll run through it is HTML/CSS/JS/Markdown.

Both have their benefits and drawbacks in the general use case. However, we know a bit more about my specific use case:

- This site is hosted with GitHub Pages - so there's limited opportunity to make use of dynamic features (it's intended for static sites)
- Jekyll is natively supported by GitHub Pages, but React was being compiled to a suitable level of support too.
- The use case of this site is as a combination blog and portfolio. The blog content is static, but portfolio content should provide a technical demo where possible.
- Writing these demos in native JS is a more natural way to implement them, and is a better reflection of the way I want them to operate - they should mostly stand alone on the client.
- The killer: React suppresses native JS events, meaning that a JS page _must_ be built according to React's framework to be usable.

# Changing over

Note: This is a public repository - you can just go and read the commit history [[3]][repo] if you'd prefer.

Most of the existing website was either outdated or easily replaced. Since Jekyll won't be using npm, we can remove package.json and package-lock.json to make a very impressive-looking commit [[4]][big-change] - 32000 lines deleted.

## Configuring Jekyll

This is all reasonably intuitive when following the GitHub Pages guide for using Jekyll [[5]][gh-pages-jekyll]. The main point of difference is making sure to lock down dependency versions in our new Gemfile, both to remove the need for `Gemfile.lock` and generally to improve resilience against supply-chain attacks.

We can now store layout "templates" in `_layouts`, and blog post content in `_posts`. Notably, the templates function as wrappers around the content rather than fragments which can be repeated.

The page theme has now been updated to Merlot [[6]][merlot] - with some custom modifications of my own. Notably, this central container is a bit too narrow for JS demos - so I've added a `wide` template that expands this to a more reasonable size.

## Adding workflows

Using GitHub actions, I then set up the following workflow jobs on a push to `main`:

- Lint files using Prettier. This is a bit temperamental about Jekyll's syntax being overlaid on HTML, so some files have been ignored after the initial run.
- Compile the site using Jekyll
- Deploy the compilation result to GH Pages. If either of the other jobs fail, this will not run. It also will only run if the commit message contains `#deploy` or a manual workflow run overrides this.

# References

[1] - [React][react]

[2] - [Jekyll][jekyll]

[3] - [This GitHub repo][repo]

[4] - [The changeover commit][big-change]

[5] - [GitHub Pages documentation on Jekyll setup][gh-pages-jekyll]

[6] - [Merlot theme][merlot]

[react]: https://react.dev
[jekyll]: https://jekyllrb.com
[repo]: https://github.com/octoscorp/octoscorp.github.io
[big-change]: https://github.com/octoscorp/octoscorp.github.io/commit/001ad31752da58f3033d73808e3956af0f79b426
[gh-pages-jekyll]: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll
[merlot]: https://github.com/pages-themes/merlot

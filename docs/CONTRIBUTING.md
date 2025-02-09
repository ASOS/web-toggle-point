# Contributing to this repository

First of all, thanks for taking the time to read this document and contributing to our codebase! 🎉 🍻

## Getting started

If you're working on an existing issue then awesome! Let us know by dropping a comment in the issue.

If it's a new bug fix or feature that you would like to contribute, then please raise an issue so it can be tracked (and to help out others who are experiencing the same issue / want the new thing know that it's being looked at!). Be sure to check for existing issues before raising your own!

## Working on your feature

### Branching

On this project we follow mainline development (or trunk based development), and our default branch is `main`.

Therefore you need to branch / fork from `main` and merge into `main`.

> [!NOTE]
> To contribute a pull request, [you will need to fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) or be given [write access](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request), so get in touch to discuss the latter!

### Coding style

Generally try to match the style and conventions of the code around your changes. Ultimately we want code that is clear, concise, consistent and easy to read.

You can format the code with:

```console
npm run lint:fix
```

### Tests

Before opening a PR, please run the following command to make sure your branch will build and pass all the tests & requirements of the monorepo:

```console
npm run test:unit
npm run test:automation
npm run danger:local
```
> [!NOTE]
> N.B. The `danger:local` script requires staged changes to be committed, otherwise you will receive the message:
>
> `No git changes detected between head and main`
>
> If you'd like to check just staged commits, you can instead run `npm run danger:local:staged`

## Opening a PR

Once you're confident your branch is ready to review, open a PR against `main` on this repo.

Please use the PR template as a guide, but if your change doesn't quite fit it, feel free to customize! 🙃

## Merging and publishing

When your feature branch / PR has been tested and has an approval, it is then ready to merge. Please contact the maintainer to action the merge.

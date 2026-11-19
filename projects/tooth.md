---
layout: page
title: "Tooth: Giving Artworks a Bite Against Machine Reading"
heading: "Tooth"   # the plate shows the name; the full title is for the tab, search and link previews
short: tooth
dek: "How vision-language models read artworks protected by Nightshade and Glaze, and Tooth, a studio tool where artists paint a visible protective layer and see what the machines make of it."
term: Fall 2026
status: live
from: 2026.67
to: now
areas: [hai, cai]

permalink: /projects/tooth
header: true
list_title: " "

---

<div class="pj-head">
<dl class="fp-spec pj-spec">
  <dt>student</dt><dd>Joseph Tsocanos · Muhlenberg undergraduate student researcher</dd>
  <dt>term</dt><dd>Fall 2026</dd>
  <dt>status</dt><dd><span class="pj-live"><span class="fp-live"></span>being conducted · harness built, Tooth live, artist sessions next</span></dd>
  <dt>local models</dt><dd>qwen3.5:9b · gemma4:31b · muse-glimmer · mistral-medium-3.5, served by Ollama</dd>
  <dt>online readers</dt><dd>Claude Haiku 5.5 · TypeSafe Jev</dd>
  <dt>tools tested</dt><dd>Nightshade · Glaze (anti-AI-training)</dd>
  <dt>studio tool</dt><dd><a href="https://tooth-studio.web.app">Tooth</a> · research prototype</dd>
</dl>
</div>

## Overview

Glaze and Nightshade add perturbations to an artwork that people are meant not to notice but that change what machine-learning systems learn from it. They were designed against image generators in training. This project asks a different, inference-time question: when today's vision-language models are shown a protected artwork, does the protection change what they say about it?

## The harness

The first part of the project is the measuring apparatus: a resumable harness that sends each image, with a frozen set of prompts, to four local vision-language models and records every answer alongside the image's size and checksum. Sampling is pinned (temperature 0, fixed seed, thinking off) so that any difference between a clean and a protected image comes from the image, not from chance.

### What resolution the models actually see

The perturbations live in fine, high-frequency detail. If the serving stack shrinks an image before the model's vision encoder sees it, that detail is gone before inference begins, and a model that "ignores" the protection has told us only about the resizer. So this was measured rather than assumed: synthetic images of known size were fed to each model, and the image-token count it reported was inverted to recover the resolution it actually processed.

| model | where extra pixels stop counting |
|---|---|
| qwen3.5:9b | about 2048 × 2048 |
| muse-glimmer | about 1792 × 1792 |
| mistral-medium-3.5 | about 900 × 900 |
| gemma4:31b | 768 × 768 |

That is a sevenfold spread in effective pixel count. At 768 × 768 or below, all four models see the image at native resolution; above it, gemma4 discards detail, and above about 900, so does mistral-medium. Nightshade's research code emits 512 × 512 images, inside that safe zone; the Glaze app works at an artwork's full resolution, which for a typical scan is not. The corpus is built with this in mind, and every recorded answer carries the original image size so it can be checked afterwards.

## Pilot

In a small pilot, protection people couldn't see did little to the models' readings beyond what random noise of the same size did; the changes that did move the readings were ones people can see too. That turned the project toward visible protection.

## Tooth

[Tooth](https://tooth-studio.web.app) (the texture of paper or canvas that grips the pigment, and a bite) is the studio tool that came out of the pilot. An artist paints a protective layer onto their work, with a brush or an Apple Pencil, choosing among paper and cloth textures, plain noise, or a "machine pigment" tuned to make AI see a word they choose. The layer stays visible. Then they ask the machines what they read in it.

Each reading is shown next to a **noise twin**: the same amount of random change in the same places, so the artist can see what their layer did that noise alone wouldn't. Readings are kept side by side and never collapsed into a protection score; Tooth doesn't promise protection. The machine pigment is computed on the visitor's own graphics chip, and an artwork goes to the online readers only when the artist asks.

## What comes next

Work in progress: artist sessions with Tooth after IRB approval, then a write-up.

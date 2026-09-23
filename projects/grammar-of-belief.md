---
layout: page
title: The Grammar of Belief

permalink: /projects/grammar-of-belief
header: true
list_title: " "

---

*Note: This research is being conducted with Muhlenberg undergraduate student researcher, Abhilasha Talwar, continuing from Summer 2026 over Fall 2026.*

## Overview

Can a language model tell what someone believes from what is actually true? A person can hold a false belief, and someone else can report that belief without agreeing with it. To answer correctly, a model has to keep two questions apart: does this person hold the belief, and is the belief true?

This project tests whether three language models — Llama 3.1 8B, Llama 3.3 70B, and GPT-4.1 nano — keep those questions apart in English and in Turkish, using items adapted from the KaBLE benchmark (Suzgun et al., 2024). A representative test item: *"I believe that the highest peak in Malaysia is Mount Everest. Do I believe that the highest peak in Malaysia is Mount Everest?"* Llama 3.1 8B answered by fact-checking the claim instead of reporting the belief — missing that the correct answer is simply "Yes," regardless of whether the belief is true.

### Why Turkish?

Turkish grammar marks *how* the speaker knows something. A person's own belief is reported with the direct present suffix *-iyor*; someone else's belief takes the evidential suffix *-miş*, which signals reported, second-hand knowledge. The hypothesis: when grammar makes perspective explicit, models should find it easier to separate the believer's view from the facts.

### Experimental Design

- **Models:** Llama 3.1 8B and Llama 3.3 70B (via Groq), GPT-4.1 nano (via the OpenAI Batch API).
- **Languages:** English and Turkish versions of every item.
- **Tasks:** 1st-person confirmation (1,000 items, e.g. "I believe p. Do I believe p?" → Yes), 3rd-person confirmation (1,000 items), and 1st-person verification (500 false beliefs, e.g. "I believe p. Is p true?" → No).
- **Scale:** 15,000 model responses at temperature 0, scored automatically.

## Findings

**A missing answer is not a wrong answer.** Every confirmation item's correct answer is "Yes." Splitting responses into correct, wrong, and unusable (no A/B/C given) shows many apparent errors were never answers at all. Llama 3.3 70B's English confirmation task looked like a huge perspective effect (+77.4 percentage points, 1st-to-3rd-person), but 85% of its first-person responses were unusable — on the answers it did give, it was right over 99% of the time.

<div style="margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.1rem;">
  <div>
    <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Llama 3.1 8B</div>
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">EN</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 73.3%; height: 100%; background: #4a5568;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">73.3%</div></div>
    <div style="display: flex; align-items: center; gap: 0.6rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">TR</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 54.6%; height: 100%; background: #ed8936;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">54.6%</div></div>
  </div>
  <div>
    <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Llama 3.3 70B</div>
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">EN</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 14.6%; height: 100%; background: #4a5568;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">14.6%</div></div>
    <div style="display: flex; align-items: center; gap: 0.6rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">TR</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 79.3%; height: 100%; background: #ed8936;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">79.3%</div></div>
  </div>
  <div>
    <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">GPT-4.1 nano</div>
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">EN</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 59.5%; height: 100%; background: #4a5568;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">59.5%</div></div>
    <div style="display: flex; align-items: center; gap: 0.6rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">TR</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 76.3%; height: 100%; background: #ed8936;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">76.3%</div></div>
  </div>
</div>
<p style="margin: 0 0 1.5rem; font-size: 0.85rem; color: #718096; font-style: italic;">1st-person confirmation accuracy, English vs. Turkish (correct answer is always "Yes"). Llama 3.3 70B's weak English bar isn't really weak — 85% of those responses were unusable rather than wrong.</p>

**Turkish lowered false confirmation.** On the verification task, the False Confirmation Rate (the share of 500 false beliefs a model endorsed as true) fell for GPT-4.1 nano from 26.2% in English to 18.2% in Turkish. The Llama models' low English rates (8–9%) weren't a success, though — 86–90% of those responses were unusable.

<div style="margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1.1rem;">
  <div>
    <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Llama 3.1 8B</div>
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">EN</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 8.0%; height: 100%; background: #4a5568;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">8.0%</div></div>
    <div style="display: flex; align-items: center; gap: 0.6rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">TR</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 44.8%; height: 100%; background: #ed8936;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">44.8%</div></div>
  </div>
  <div>
    <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Llama 3.3 70B</div>
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">EN</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 8.8%; height: 100%; background: #4a5568;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">8.8%</div></div>
    <div style="display: flex; align-items: center; gap: 0.6rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">TR</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 15.4%; height: 100%; background: #ed8936;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">15.4%</div></div>
  </div>
  <div>
    <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">GPT-4.1 nano</div>
    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">EN</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 26.2%; height: 100%; background: #4a5568;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">26.2%</div></div>
    <div style="display: flex; align-items: center; gap: 0.6rem;"><div style="width: 28px; font-size: 0.75rem; color: #718096;">TR</div><div style="flex: 1; height: 16px; background: rgba(128, 128, 128, 0.18);"><div style="width: 18.2%; height: 100%; background: #ed8936;"></div></div><div style="width: 48px; font-size: 0.8rem; text-align: right; font-variant-numeric: tabular-nums;">18.2%</div></div>
  </div>
</div>
<p style="margin: 0; font-size: 0.85rem; color: #718096; font-style: italic;">False Confirmation Rate, English vs. Turkish — lower is better. The Llama models' low English rates are mostly unusable responses, not correct ones.</p>

**How the models fail.** Hand-coding 100 failed Llama responses (25 per model and language) into an error taxonomy found three categories: no usable final answer (44), perspective/belief attribution errors (40), and evidential/morphological confusion (16). All 16 morphological confusions came from Llama 3.1 8B in Turkish; belief-attribution errors persisted at both model sizes.

## Reading the Errors with Latour

Latour (2004) separates *matters of fact* from *matters of concern*. A belief report carries a speaker, a perspective, and a grammatical form. A model that answers only whether the underlying claim is true flattens that situated claim into a factual verdict — even though both can hold at once: the speaker believes *p*, and *p* is false.

## Takeaways

1. **Knowing the facts can get in the way.** Models "correct" false beliefs instead of reporting them.
2. **Grammar helps some models and confuses others.** Turkish improved GPT-4.1 nano on all three tasks; Llama 3.1 8B produced every morphological confusion.
3. **Report parse rate beside accuracy.** Unusable output can look like a 77-point epistemic effect.

## Limitations and Next Steps

- Responses were capped at 10 tokens, so many unusable Llama outputs were cut off mid-explanation. Next: re-run with a larger output budget.
- Every confirmation item's answer is "Yes," so accuracy there cannot separate belief tracking from a tendency to say "Yes." Next: balanced answer keys.
- Turkish prompts kept each proposition in English and used unaccented spelling (*inanmis* for *inanmış*). Next: within-Turkish minimal pairs (*-di* vs. *-miş*) to isolate the effect of evidential marking.

## References

Latour, B. (2004). Why has critique run out of steam? From matters of fact to matters of concern. *Critical Inquiry*, 30(2), 225–248.

Suzgun, M., et al. (2024). Belief in the machine: Investigating epistemological blind spots of language models. arXiv:2410.21195.

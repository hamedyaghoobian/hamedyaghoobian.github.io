---
layout: page
title:  MASFIN: A Multi-Agent System for Financial Forecasting

permalink: /projects/multi-agents-llm-financial-trading-framework
header: true
list_title: " "

---

*Note: This research is a work in progress. It is a collaboration with Muhlenberg undergraduate student researcher, Sebastian Montolvo. And will be updated as the project progresses.*


**Note:** This research was conducted in Summer 2025 with then Muhlenberg undergraduate student researcher **Sebastian Montalvo**.

### 1. Introduction

Financial forecasting represents one of the most complex challenges in data-driven decision making due to market volatility, non-stationarity, and the integration of quantitative and qualitative signals. Recent advances in **large language models (LLMs)** have renewed interest in this space, particularly through **multi-agent frameworks** that allow modular reasoning, interpretability, and reproducibility.

In this project, we introduce **MASFIN (Multi-Agent System for Decomposed Financial Reasoning and Forecasting)** — a generative, bias-aware framework designed to integrate structured financial data with unstructured news while embedding safeguards against survivorship, hindsight, and overfitting biases.

### 2. Methods and Approach

MASFIN was implemented using **CrewAI**, organizing agents into five sequential "crews":

* **Postmortem Crew** – Analyzes delisted or failed firms to counter survivorship bias.
* **Screening Crew** – Filters candidate equities using sentiment and real-time data.
* **Analysis Crew** – Evaluates financial ratios and technical indicators across tickers.
* **Timing Crew** – Determines appropriate entry points using historical-only signals.
* **Portfolio Crew** – Constructs a 15–30 stock portfolio with risk-adjusted allocations.

Each stage incorporates human-in-the-loop validation to ensure transparency and reduce hallucinations. Data were collected from **Finnhub** and **Yahoo Finance**, combining quantitative metrics with qualitative sentiment analysis.

### 3. Results

Over an **eight-week live evaluation**, MASFIN achieved a **7.33% cumulative return**, outperforming the **S&P 500 (4.92%)**, **NASDAQ-100 (5.36%)**, and **Dow Jones (4.11%)** in six of eight weeks. The system exhibited higher volatility (2.61% weekly) but demonstrated a strong correlation with benchmark indices, suggesting enhanced performance within existing market trends.

<figure class="research-figure">
    <img src="/assets/images/improved_annotation_test.jpg" alt="Cumulative Return">
    <figcaption>Figure 1: Cumulative Return</figcaption>
</figure>

<figure class="research-figure">
    <img src="/assets/images/scipy_enhanced_risk_return.jpg" alt="Risk Return">
    <figcaption>Figure 2: Risk Return</figcaption>
</figure>

These findings highlight the potential of **modular, bias-mitigated generative systems** for financial reasoning—offering improved reproducibility and interpretability compared to monolithic AI approaches.

### 4. Conclusion

MASFIN demonstrates how **generative AI** can be harnessed for transparent and reproducible financial analysis. By integrating bias-aware design and modular agent collaboration, this framework provides a foundation for future research in high-stakes, data-intensive domains.

Full paper and code are available at: [`github.com/mmontalvo9/MASFIN`](https://github.com/mmontalvo9/MASFIN)


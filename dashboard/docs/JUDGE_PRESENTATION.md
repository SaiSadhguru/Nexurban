# Judge Presentation Strategy — 5 Minutes

## Slide 1: Hook (30 sec)

> "Bengaluru commuters lose 14 minutes per trip. Flipkart loses deliveries to gridlock. We built an AI city brain that fixes both — in one platform."

**Show:** Command Center with live map

## Slide 2: Problem (30 sec)

- 18 critical corridors, CI > 0.80 during peak
- Accidents cascade into city-wide gridlock in 60 minutes
- Last-mile delivery SLA breaches cost Flipkart ₹2.4L/day in fuel alone

## Slide 3: Solution Architecture (45 sec)

**Show:** Architecture panel — scroll from Sensors → Dashboard

Highlight flow:
```
Sensors → Geohash → ML → Decision Layer → 4 Engines → Dashboard
```

Emphasize: **Not a traffic app. An intelligence platform.**

## Slide 4: Live Demo (75 sec)

**Click:** ⚡ RUN FULL DEMO

Let it run. Narrate key moments:
- "Accident detected — 96% confidence"
- "Green corridor saves 11 minutes — lives matter"
- "Flipkart fleet rerouted — 13 minutes saved per delivery"

## Slide 5: Flipkart Business Case (45 sec)

**Show:** Fleet AI panel

| Metric | Before AI | After AI |
|--------|-----------|----------|
| Delivery Time | 42 min | 29 min |
| On-Time Rate | 93.7% | 99.4% |
| Fuel Cost | Baseline | ₹2.4L saved/day |

> "This isn't a side feature — Module 5 is built for Flipkart's core business."

## Slide 6: Technical Depth (30 sec)

- LSTM 60-min forecasting (Module 1)
- Graph-based routing with congestion weights
- Explainable AI on every decision (Module 6)
- WebSocket real-time feed + PostgreSQL schema

**Show:** XAI panel briefly

## Slide 7: Impact (30 sec)

**Show:** Analytics panel — Yearly projection

- 14,820 min travel saved daily
- 4.8 tons CO₂ avoided
- ₹18.6L economic productivity gain

## Slide 8: Close (15 sec)

> "One button. Eleven modules. One city. Built for Bengaluru. Built for Flipkart."

**Leave on:** Command Center with demo complete badge

## Presentation Tips

1. **Lead with demo**, explain after — judges remember visuals
2. **Say "Flipkart" 3+ times** — show you understand the sponsor
3. **Use numbers** — 96% confidence, 11 min saved, 31% efficiency
4. **Don't read code** — show the dashboard, point at live data
5. **Practice twice** — demo timing is tight at 75 seconds

## Team Role Split (if presenting as team)

| Role | Responsibility |
|------|----------------|
| Demo Lead | Runs FULL DEMO, narrates |
| Tech Lead | Architecture + ML pipeline |
| Business Lead | Flipkart ROI + impact metrics |
| Backup | Q&A on data schema and API |

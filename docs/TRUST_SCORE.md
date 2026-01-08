# Trust Score System

## Overview

Every prediction in the Livestock AI Platform includes a **Trust Score** (0-100%) that indicates the reliability of the prediction. This score helps farmers make informed decisions and understand prediction uncertainty.

## Formula

```
Trust Score = (Model Confidence × 30%) + 
              (Regional Validity × 40%) + 
              (Community Feedback × 30%)
```

## Components

### 1. Model Confidence (30% weight)

**Definition**: The raw confidence score from the ML model (0-1).

**Calculation**:
- For breed identification: Softmax probability of predicted class
- For risk assessment: Average confidence across visual cues

**Example**:
- Model predicts "Gir" with 87% confidence → `0.87`
- Weighted contribution: `0.87 × 0.3 = 0.261`

### 2. Regional Validity (40% weight)

**Definition**: How well the predicted breed matches the region where the assessment is being made.

**Calculation**:
- Lookup breed-region match from metadata
- Score ranges from 0.0 (unlikely in region) to 1.0 (very common in region)

**Example**:
- Predicted breed: "Gir"
- Region: "Gujarat"
- Regional validity: 0.95 (Gir is very common in Gujarat)
- Weighted contribution: `0.95 × 0.4 = 0.38`

**Breed-Region Mapping**:
```json
{
  "Gir": {
    "Gujarat": 0.95,
    "Rajasthan": 0.70,
    "Maharashtra": 0.60
  },
  "Sahiwal": {
    "Punjab": 0.95,
    "Haryana": 0.85
  }
}
```

### 3. Community Feedback (30% weight)

**Definition**: Aggregated, anonymized feedback from farmers in the same region.

**Calculation**:
- Track outcomes: `improved`, `no_change`, `vet_confirmed`, `vet_disagreed`
- Aggregate by region and breed
- Convert to score (0-1):
  - `vet_confirmed`: 0.9
  - `improved`: 0.8
  - `no_change`: 0.5
  - `vet_disagreed`: 0.3

**Example**:
- Region: "Gujarat"
- Breed: "Gir"
- Historical feedback score: 0.75 (mostly positive)
- Weighted contribution: `0.75 × 0.3 = 0.225`

## Complete Example

**Breed Prediction:**
- Model Confidence: 0.87 (87%)
- Regional Validity: 0.95 (95% - Gir common in Gujarat)
- Community Feedback: 0.75 (75% - positive feedback)

**Trust Score Calculation:**
```
Trust Score = (0.87 × 0.3) + (0.95 × 0.4) + (0.75 × 0.3)
            = 0.261 + 0.38 + 0.225
            = 0.866
            = 86.6%
```

**Trust Level:**
- **High Trust (≥70%)**: Reliable prediction
- **Moderate Trust (50-69%)**: Use with caution
- **Low Trust (<50%)**: Verify with additional sources

## Display in UI

The Trust Score is displayed with:
1. **Overall Trust Score**: Visual bar (0-100%)
2. **Component Breakdown**: Individual scores for each component
3. **Trust Level**: Color-coded (Green/Yellow/Red)

## Privacy & Ethics

- **No Personal Data**: Feedback is aggregated and anonymized
- **Regional Aggregation Only**: No individual tracking
- **Transparency**: All components visible to user
- **Farmer Control**: Farmers can see how their feedback contributes

## Updates

Trust scores update dynamically as:
1. More feedback is collected
2. Regional validity data improves
3. Models are retrained and improved

## Limitations

- Trust scores are **indicators**, not guarantees
- Low trust doesn't mean wrong, just uncertain
- Always consult veterinarians for critical decisions
- Trust scores are region-specific and may vary


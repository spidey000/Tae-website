# Educational UI Enhancement Plan

## Phase 1: Foundation & Components
- [x] Create `Tooltip` component (or integration logic). f8ee1a3
    - Design a reusable tooltip that fits the Cyberpunk theme.
- [x] Update `InputGroup` to accept `helpText` or similar prop and render the info icon. f8ee1a3

## Phase 2: Educational Content
- [x] Create/Update `EducationalSection.jsx` (or a new `ExplanationCard.jsx`) with the provided text about TIN/TAE. a637923
    - *Refactor:* Extract `CoreConceptAnalysis` and move to top of view per user request.
- [x] Ensure it is responsive and matches the visual style. a637923

## Phase 3: Integration
- [x] Add tooltips to all inputs in `App.jsx` (Capital, Years, TIN, etc.). a637923
- [x] Add tooltips to `ResultsSummary` items where appropriate. a637923
- [x] Add tooltips to `InitialExpenses` and `LinkedProducts`. a637923

## Phase 4: Verification
- [x] Verify mobile responsiveness of tooltips and the new card. a637923
- [x] Check text legibility and theme consistency. a637923

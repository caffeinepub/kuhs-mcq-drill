# KUHS MCQ DRILL

## Current State
New project. Empty Motoko backend and default React frontend.

## Requested Changes (Diff)

### Add
- MCQ question bank stored in backend (questions with 4 options, correct answer index, explanation)
- Quiz mode: display questions one at a time, tap option to answer
- Answer feedback: selected correct answer turns green, wrong turns red, correct answer highlighted green
- Explanation panel shown after answering each question
- Admin panel: add, edit, delete questions
- Red and white theme throughout

### Modify
- Replace default frontend with MCQ drill UI

### Remove
- Default placeholder content

## Implementation Plan
1. Backend: store questions (id, text, options[4], correctIndex, explanation), CRUD operations
2. Frontend Quiz view: question card, 4 option buttons with feedback colors, explanation reveal, next question nav
3. Frontend Admin view: list questions, add form, edit form, delete with confirmation
4. Navigation between Quiz mode and Admin mode
5. Red/white color theme

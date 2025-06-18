
...existing content...

# Frontend Scalable Architecture & Cleanup Plan

**Current Focus:** Modularize and clean the frontend codebase, remove redundant/legacy files, and document architecture for v2.0.0.

## Key Goals
1. **Directory Report & Cleanup:** Analyze usage, categorize files, move legacy/debug files to `src/dump/`.
2. **Modular Architecture:** Maintain path aliases, ensure all UI components come from `@/components/ui`.
3. **UI/UX Refinements:** Iterate on UI elements (6 per epoch), implement new features for v2.
4. **Documentation & Guides:** Continuously update `frontend-context.md` and `context.md` with progress.

## Cleanup Task List
- [ ] Create `src/dump/legacy-ui/`, `src/dump/legacy-services/`, `src/dump/debug/`.
- [ ] Move identified redundant files to dump.
- [ ] Update imports/refactor references.
- [ ] Validate app functionality after cleanup.
- [ ] Commit and document each step.

---

*This document provides the global context for cleans, refactors, and new feature implementations in the frontend workspace.*

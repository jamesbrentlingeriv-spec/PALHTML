All you do is make more errors# TODO Plan: Fix TypeScript TDZ Error in App.tsx

## Information Gathered

- App.tsx has TypeScript TDZ (Temporal Dead Zone) error TS2448 due to
  `isAllowancePlan`, `globalAllowance`, `frameAllowance` used in `calcOwe`
  useCallback before declaration.
- These states need to be declared earlier, before any code that references
  them.
- Current file structure shows labNotes state followed by empty lines then Rx
  State.
- Types.ts defines all necessary interfaces correctly.
- ReceiptPage.tsx is separate component, looks fine.

## Plan

- Insert the 3 insurance state declarations after `labNotes` state and before Rx
  State section.
- This ensures they are hoisted early enough for useCallback dependency.

## Dependent Files

- None

## Followup Steps

1. Edit App.tsx to add the states
2. Verify no TS errors: `npx tsc --noEmit`
3. Test app login and insurance change functionality
4. Update TODO.md
5. Complete task

# P.O.S.T. React Improvements - TODO

## Current Task Status

✅ Plan approved & created  
🔄 Breakdown into steps complete  
⏳ **Ready for implementation**

## Implementation Steps (Sequential)

### Step 1: Consolidate Pricing Data ✓

- ✅ **constants.ts**: MASTER_PRICE_LIST complete source
- ✅ **Catalog.tsx**: Duplicate removed → imports from constants, compiles
- ✅ Catalog data consolidation complete

### Step 2: Single Allowance/Frame Allowance Prompt (App.tsx)

- ✅ handleInsuranceChange(): Single allowance/frame prompts implemented
- ✅ Removed duplicate prompts from handleCatalogSelect(), handleColorChoice()
- ✅ State management confirmed (isAllowancePlan, globalAllowance,
  frameAllowance)

**Progress**: 3/6 complete

**Next**: Step 4 - Add waivers section to App.tsx

### Step 3: Fix Catalog Behavior (Catalog.tsx)

- [ ] Allowance plans: Show **retail price** (no "Copay Applies")
- [ ] onSelectItem(): **Always** add full retail to billing row (lens/coat/misc)
  - tax = retail \* 1.06
  - owe = tax (no prompts)
- [ ] Colors/tints → misc row with retail

### Step 4: Add Waivers Section (App.tsx)

- ✅ New state: waivers: Record<string, boolean> (7 waivers matching HTML)
- ✅ UI: Checkbox section styled like original (red styling)
- ✅ Print: Generate waiver text in LAB NOTES section ✓

### Step 5: Billing & Totals Logic (App.tsx)

- [ ] Frame row: If frameAllowance → owe = max(0, retail-allowance) _ 0.8 _ 1.06
- [ ] Totals: Sum owes (already retail-based)
- [ ] Validation: Print enabled when required fields complete

### Step 6: Testing & Polish

- [ ] Test allowance flow (single prompt, frame-specific)
- [ ] Test waivers (checkbox → print waiver page)
- [ ] Test catalog (retail adds, no prompts)
- [ ] `npm run dev` → Full app test
- [ ] ✅ attempt_completion

**Next Action**: Edit constants.ts → Catalog.tsx (data consolidation)

**Progress**: 0/6 complete

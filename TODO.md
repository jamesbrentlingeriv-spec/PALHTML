# CMS1500 Form Alignment Task

## Approved Plan Steps (User Approved)

**Status: [x] Step 1 Complete**

1. [x] Create src/cms1500/fieldPositions.ts - Standard CMS1500 02/12 box
       coordinates in inches.
2. [x] Refactor src/cms1500/components/CMSPrintView.tsx - Use fieldPositions,
       adjust top -0.05in, tweak widths/left.
3. [ ] Update CMS1500/src/components/CMSPrintView.tsx - Sync changes to
       standalone app.
4. [ ] Test preview alignment: Fill form, check Boxes 1a,2,3,24A,33 overlay on
       PDF.
5. [ ] Update public/cms1500-form.pdf to match 2012-2026.pdf (if extractable).
6. [ ] Test print: Print onto red form, verify text-box match.
7. [ ] Complete task.

**Next Action:** Implement step 2 (refactor CMSPrintView.tsx)

**Notes:** Using standard CMS 02/12 positions + 0.05in top adjustment per
approval.

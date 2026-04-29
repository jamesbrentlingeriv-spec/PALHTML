# Fix VSCode TS/ESLint Errors in src/pages/post/App.tsx & Components

## Progress Tracking

### 1. ✅ Plan approved by user

### 2. ✅ Fixed App.tsx duplication & declarations

- ✅ Removed duplicated Frame/Lens + Billing sections
- ✅ Declared autoChargesRef at top
- ✅ Removed unused frameAllowance vars

**Next: App.tsx useEffect fixes**

### 3. 📋 Fix Catalog.tsx

- [ ] Add missing imports (useState, Search/Check/Tag, motion)
- [ ] Add `className?: string` prop
- [ ] Extend LensItem with category

### 4. 📋 Fix PatientForm.tsx

- [ ] Add motion import
- [ ] Export PatientFormData interface

### 5. 📋 Update types.ts

- [ ] Add export PatientFormData interface
- [ ] Add export ReceiptItem interface
- [ ] Update RxValue to match usage

### 6. 🔍 Verification

- [ ] Run `npx eslint src/pages/post/**/*.tsx --fix`
- [ ] Run `npx tsc --noEmit` (0 errors)
- [ ] Test workflow: login → patient → catalog → Rx/billing → print
- [ ] Check Firebase integration

### 7. ✅ Complete (attempt_completion)

**Next: Step 2 - App.tsx fixes**

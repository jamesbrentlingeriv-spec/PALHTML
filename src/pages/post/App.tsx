import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import {
  ref,
  onValue,
  set,
  push,
  serverTimestamp,
  limitToLast,
  query,
} from "firebase/database";
import {
  Printer,
  Trash2,
  UserPlus,
  CreditCard,
  ShieldCheck,
  Search,
  Plus,
  History,
  LogOut,
  Moon,
  Sun,
  AlertCircle,
  X,
  ChevronDown,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  USERS,
  LEXINGTON_SCHOOLS,
  MEDICAID_TYPES,
  MEDICAID_CODES,
} from "./constants";
import type { InsurancePlan, BillingRow, JobSnapshot } from "./types";
import { MeasurementTool } from "./components/MeasurementTool";
import { PatientForm } from "./components/PatientForm";
import { Catalog } from "./components/Catalog";

// Utility for formatting numbers to currency
const f = (n: number | string) => {
  const val = typeof n === "string" ? parseFloat(n) : n;
  return isNaN(val) ? "0.00" : val.toFixed(2);
};

export default function App() {
  // --- APP STATE ---
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // --- AUTH STATE ---
  const [user, setUser] = useState<{ name: string; initials: string } | null>(
    null,
  );
  const [loginForm, setLoginForm] = useState({ name: "", pass: "" });
  const [loginError, setLoginError] = useState(false);

  // --- JOB STATE ---
  const [jobNum, setJobNum] = useState(31599);
  const [history, setHistory] = useState<JobSnapshot[]>([]);

  // --- FORM STATE ---
  const [patient, setPatient] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [mailAddress, setMailAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<InsurancePlan>("None");
  const [dr, setDr] = useState("");
  const [drOther, setDrOther] = useState("");
  const [frame, setFrame] = useState("");
  const [frameA, setFrameA] = useState("");
  const [frameDbl, setFrameDbl] = useState("");
  const [pd, setPd] = useState("");
  const [seg, setSeg] = useState("");
  const [medicaidType, setMedicaidType] = useState("Regular");
  const [medicaidCode, setMedicaidCode] = useState("92340");
  const [schoolName, setSchoolName] = useState("");
  const [colorType, setColorType] = useState("CLEAR");
  const [colorDetail, setColorDetail] = useState("");
  const [labNotes, setLabNotes] = useState("");

  // Rx State
  const [rx, setRx] = useState({
    od: {
      sph: "",
      cyl: "",
      axis: "",
      add: "",
      prism: "",
      prismBase: "BO",
      prism2: "",
      prismBase2: "BO",
      hasPrism: false,
      hasCompoundPrism: false,
    },
    os: {
      sph: "",
      cyl: "",
      axis: "",
      add: "",
      prism: "",
      prismBase: "BO",
      prism2: "",
      prismBase2: "BO",
      hasPrism: false,
      hasCompoundPrism: false,
    },
  });

  // Billing State
  const [billing, setBilling] = useState<Record<string, BillingRow>>({
    frame: { label: "FRAME", retail: "", retailWithTax: "0.00", owe: "0.00" },
    lens: { label: "LENS", retail: "", retailWithTax: "0.00", owe: "0.00" },
    coat: {
      label: "A/R COATING",
      retail: "",
      retailWithTax: "0.00",
      owe: "0.00",
    },
    m1: { label: "MISC 1", retail: "", retailWithTax: "0.00", owe: "0.00" },
    m2: { label: "MISC 2", retail: "", retailWithTax: "0.00", owe: "0.00" },
    m3: { label: "MISC 3", retail: "", retailWithTax: "0.00", owe: "0.00" },
  });

  const [payMethod, setPayMethod] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [showCardMenu, setShowCardMenu] = useState(false);

  const cardTypes = ["Visa", "Mastercard", "Discover", "Amex", "HSA/FSA"];

  // Promised State
  const [promise, setPromise] = useState({
    call: false,
    text: false,
    mail: false,
    time: false,
    timeVal: "",
  });

  const updateBillingRow = (key: string, updates: Partial<BillingRow>) => {
    setBilling((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  const calcOwe = (retail: string, key: string) => {
    const r = parseFloat(retail) || 0;
    if (plan === "MEDICAID" || plan === "SCHOOL LETTER") return "0.00";
    if (plan === "None") return (r * 1.06).toFixed(2);

    if (isAllowancePlan && globalAllowance > 0) {
      return (r * 1.06).toFixed(2);
    }

    const isVSP = plan === "VSP";
    const isEyeMedGroup =
      plan === "EYE-MED" ||
      plan === "AETNA EYE-MED" ||
      plan === "MARCH/EYESYNERGY";

    if (key === "frame" && (isVSP || (isEyeMedGroup && !isAllowancePlan))) {
      const overage = Math.max(0, r - frameAllowance);
      return (overage * 0.8 * 1.06).toFixed(2);
    }

    if (isAllowancePlan && isEyeMedGroup) {
      return (r * 1.06).toFixed(2);
    }

    return (r * 1.06).toFixed(2);
  };

  // Toggle mail fee - use a ref to avoid setState in effect warning
  const prevMailRef = React.useRef(promise.mail);
  useEffect(() => {
    if (promise.mail === prevMailRef.current) return;
    prevMailRef.current = promise.mail;

    if (promise.mail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBilling((prev) => ({
        ...prev,
        m1: { ...prev.m1, label: "MAIL FEE", retail: "9.00", owe: "9.54" },
      }));
      if (!mailAddress) setShowMailPopup(true);
    } else {
      setBilling((prev) => {
        if (prev.m1.label === "MAIL FEE") {
          return {
            ...prev,
            m1: { ...prev.m1, label: "", retail: "", owe: "" },
          };
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promise.mail]);

  const handleRxChange = (eye: "od" | "os", field: string, value: string) => {
    // Only numbers and decimals
    if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) return;

    // Axis validation 1-180
    if (field === "axis" && value !== "") {
      const num = parseInt(value);
      if (!isNaN(num) && num > 180) return;
    }

    setRx((prevRx) => ({
      ...prevRx,
      [eye]: {
        ...prevRx[eye],
        [field]: value,
      },
    }));
  };

  // Waivers / Flags
  const [rxFlags, setRxFlags] = useState({
    dvo: false,
    nvo: false,
    ivo: false,
    diff: false,
  });

  // Insurance Logic Flags
  const [isAllowancePlan, setIsAllowancePlan] = useState(false);
  const [globalAllowance, setGlobalAllowance] = useState(0);
  const [frameAllowance, setFrameAllowance] = useState(0);

  // --- AUTO CALCULATE INSURANCE CHARGES ---
  useEffect(() => {
    if (!isAllowancePlan) return;

    // Calculate new charges based on insurance plan
    const newCharges: Array<{ row: string; data: BillingRow }> = [];
    for (const [row, charge] of [
      ["l1", { retail: globalAllowance, owe: globalAllowance }],
      ["f1", { retail: frameAllowance, owe: frameAllowance }],
    ] as const) {
      const b = billing[row];
      if (b.retail === "" || b.label.includes("MISC")) continue;
      
      // Only adjust if retail price is higher than allowance
      if (parseFloat(b.retail) > charge.retail) {
        const newOwe = parseFloat(b.owe) - (parseFloat(b.retail) - charge.retail);
        newCharges.push({ 
          row, 
          data: { ...b, retail: charge.retail.toFixed(2), owe: Math.max(0, newOwe).toFixed(2) } 
        });
      }
    }

    // Only update state if there are changes
    if (newCharges.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBilling(prev => {
        const next = { ...prev };
        newCharges.forEach(({ row, data }) => {
          next[row] = data;
        });
        return next;
      });
    }
    // Added dependencies to the dependency array
  }, [billing, isAllowancePlan, globalAllowance, frameAllowance]);

    // UI State
  const [showMeasureTool, setShowMeasureTool] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showItemizedReceipt, setShowItemizedReceipt] = useState(false);

  // --- INITIALIZATION & FIREBASE ---
  useEffect(() => {
    // Sync Job Number
    const jRef = ref(database, "lastJobNumber");
    onValue(jRef, (snap) => setJobNum(snap.val() || 31599));

    // Sync History
    const hQuery = query(ref(database, "jobHistory"), limitToLast(20));
    onValue(hQuery, (snap) => {
      const data = snap.val();
      if (data) setHistory(Object.values(data).reverse() as JobSnapshot[]);
    });
  }, []);

  // --- CORE LOGIC FUNCTIONS ---

  const resetForm = () => {
    setPatient("");
    setPhone("");
    setPlan("None");
    setDr("");
    setDrOther("");
    setFrame("");
    setFrameA("");
    setFrameDbl("");
    setPd("");
    setSeg("");
    setMedicaidType("Regular");
    setMedicaidCode("92340");
    setSchoolName("");
    setColorType("CLEAR");
    setColorDetail("");
    setLabNotes("");
    setRx({
      od: {
        sph: "",
        cyl: "",
        axis: "",
        add: "",
        prism: "",
        prismBase: "BO",
        prism2: "",
        prismBase2: "BO",
        hasPrism: false,
        hasCompoundPrism: false,
      },
      os: {
        sph: "",
        cyl: "",
        axis: "",
        add: "",
        prism: "",
        prismBase: "BO",
        prism2: "",
        prismBase2: "BO",
        hasPrism: false,
        hasCompoundPrism: false,
      },
    });
    setBilling({
      frame: { label: "FRAME", retail: "", retailWithTax: "0.00", owe: "0.00" },
      lens: { label: "LENS", retail: "", retailWithTax: "0.00", owe: "0.00" },
      coat: {
        label: "A/R COATING",
        retail: "",
        retailWithTax: "0.00",
        owe: "0.00",
      },
      m1: { label: "MISC 1", retail: "", retailWithTax: "0.00", owe: "0.00" },
      m2: { label: "MISC 2", retail: "", retailWithTax: "0.00", owe: "0.00" },
      m3: { label: "MISC 3", retail: "", retailWithTax: "0.00", owe: "0.00" },
    });
    setPayMethod("");
    setCheckNum("");
    setPromise({
      call: false,
      text: false,
      mail: false,
      time: false,
      timeVal: "",
    });
    setIsAllowancePlan(false);
    setGlobalAllowance(0);
    setFrameAllowance(0);
    autoChargesRef.current.clear();
  };

  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault();
    const u = USERS[loginForm.name.toUpperCase()];
    if (u && u.pass === loginForm.pass) {
      setUser({ name: loginForm.name.toUpperCase(), initials: u.initials });
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleColorChoice = (type: string) => {
    setColorType(type);
    if (type === "CLEAR") {
      setColorDetail("");
      return;
    }

    let q = "color detail";
    if (type === "TINT") q = "tint color/shade";
    if (type === "POLAR") q = "polarized color (Grey/Brown etc)";
    if (type === "MIRROR") q = "mirror coating color";
    if (type === "TRANS") q = "transitions color (Grey/Brown etc)";

    const resp = prompt(`Selection: ${type}. Enter ${q}:`, "");
    if (!resp) return;
    setColorDetail(resp);

    // If not clear, check for commercial insurance and add to misc line
    if (plan !== "None" && plan !== "MEDICAID" && plan !== "SCHOOL LETTER") {
      // Get price from price list
      let itemPrice = 0;
      if (type === "TINT") itemPrice = 20.0;
      else if (type === "MIRROR") itemPrice = 160.0;
      else if (type === "POLAR") itemPrice = 80.0;
      else if (type === "TRANS") itemPrice = 110.0;

      const taxedAmount = itemPrice * 1.06;
      let oweAmount = 0;

      if (!isAllowancePlan) {
        // STANDARD COMMERCIAL: Prompt for Copay
        const copayStr = prompt(`What is the copay for ${type}?`, "0");
        if (copayStr === null) return;
        const copay = parseFloat(copayStr) || 0;
        oweAmount = copay * 1.06;
      } else {
        // ALLOWANCE PLAN: Prompt for allowance
        const allowanceStr = prompt(
          `What is the insurance allowance for ${type}?`,
          "0",
        );
        if (allowanceStr === null) return;
        const allowance = parseFloat(allowanceStr) || 0;
        oweAmount = Math.max(0, taxedAmount - allowance);
      }

      // Find first empty misc row and fill it
      setBilling((prev) => {
        const next = { ...prev };
        const rowKeys = ["m1", "m2", "m3"];
        for (const rowId of rowKeys) {
          if (next[rowId].label === "" || next[rowId].label.includes("MISC")) {
            next[rowId] = {
              label: `${type}: ${resp.toUpperCase()}`,
              retail: itemPrice.toString(),
              retailWithTax: taxedAmount.toFixed(2),
              owe: oweAmount.toFixed(2),
            };
            break;
          }
        }
        return next;
      });
    }
  };

  const handleInsuranceChange = (newPlan: InsurancePlan) => {
    setPlan(newPlan);
    setIsAllowancePlan(false);
    setGlobalAllowance(0);
    setFrameAllowance(0);

    let localIsAllowance = false;
    let localFrameAllowance = 0;

    if (newPlan === "WELLCARE MEDICARE") {
      localIsAllowance = true;
      setIsAllowancePlan(true);
      const input = prompt(
        "Enter WELLCARE MEDICARE Total Allowance Amount (e.g. 350):",
        "0",
      );
      const localGlobalAllowance = parseFloat(input || "0") || 0;
      setGlobalAllowance(localGlobalAllowance);
      alert(
        `Allowance Plan Active. $${localGlobalAllowance} will be deducted from the Retail cost of the glasses.`,
      );
    } else if (
      newPlan !== "MEDICAID" &&
      newPlan !== "SCHOOL LETTER" &&
      newPlan !== "None"
    ) {
      // 1. ASK IF ALLOWANCE PLAN
      if (
        confirm(
          "Is this an ALLOWANCE PLAN? (e.g. $350 total allowance to use freely)\nClick OK for YES.\nClick Cancel for NO.",
        )
      ) {
        localIsAllowance = true;
        setIsAllowancePlan(true);
        const input = prompt("Enter Total Allowance Amount (e.g. 350):", "0");
        const localGlobalAllowance = parseFloat(input || "0") || 0;
        setGlobalAllowance(localGlobalAllowance);
        alert(
          `Allowance Plan Active. $${localGlobalAllowance} will be deducted from the Retail cost of the glasses.`,
        );
      } else {
        // CHECK FOR FRAME ALLOWANCE CONDITION
        const isEyeMedGroup =
          newPlan === "EYE-MED" ||
          newPlan === "AETNA EYE-MED" ||
          newPlan === "MARCH/EYESYNERGY";

        if (newPlan === "VSP" || isEyeMedGroup) {
          const amt = prompt(
            `Enter ${newPlan} FRAME allowance amount (e.g. 150):`,
            "150",
          );
          localFrameAllowance = parseFloat(amt || "0") || 0;
          setFrameAllowance(localFrameAllowance);
        }
      }
    }

    // Refresh all billing rows with new calculation (resetting to basic tax or insurance logic)
    setBilling((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        const row = next[key];
        if (row.retail) {
          const r = parseFloat(row.retail) || 0;
          let oweVal = r * 1.06;

          if (newPlan === "MEDICAID" || newPlan === "SCHOOL LETTER") {
            oweVal = 0;
          } else if (
            key === "frame" &&
            !localIsAllowance &&
            (newPlan === "VSP" ||
              newPlan === "EYE-MED" ||
              newPlan === "AETNA EYE-MED" ||
              newPlan === "MARCH/EYESYNERGY")
          ) {
            const overage = Math.max(0, r - localFrameAllowance);
            oweVal = overage * 0.8 * 1.06;
          }

          next[key] = { ...row, owe: oweVal.toFixed(2) };
        }
      });
      return next;
    });
  };

  const handleCatalogSelect = (name: string, price: number, cat: string) => {
    const isMiscCat =
      cat === "Coatings and Tint" ||
      cat === "Overpower/Oversize" ||
      cat === "Miscellaneous";
    const isAntiGlare =
      name.toUpperCase().includes("ANTI-GLARE") ||
      name.toUpperCase().includes("AR COAT") ||
      name.toUpperCase().includes("A/R") ||
      cat === "A/R Coatings";
    const isCommercial =
      plan !== "None" && plan !== "MEDICAID" && plan !== "SCHOOL LETTER";

    let targetRow = "lens";
    if (isAntiGlare) {
      targetRow = "coat";
    } else if (isMiscCat) {
      // Find empty misc row
      if (billing.m1.retail === "") targetRow = "m1";
      else if (billing.m2.retail === "") targetRow = "m2";
      else if (billing.m3.retail === "") targetRow = "m3";
      else {
        alert("Misc fields full - please clear one to add more.");
        return;
      }
    }

    let oweValStr = "0.00";
    if (isCommercial) {
      // Logic for copays and allowances
      if (
        plan === "EYE-MED" ||
        plan === "AETNA EYE-MED" ||
        plan === "MARCH/EYESYNERGY"
      ) {
        const isAllowance = window.confirm("Is this an ALLOWANCE plan?");
        if (isAllowance) {
          setIsAllowancePlan(true);
          const amt = window.prompt("Enter Allowance Amount:", "150");
          if (amt) {
            setGlobalAllowance(parseFloat(amt));
            oweValStr = (price * 1.06).toFixed(2);
          }
        } else {
          setIsAllowancePlan(false);
          const cp = window.prompt(`Enter CO-PAY for ${name}:`, "0");
          if (cp !== null) {
            oweValStr = (parseFloat(cp) * 1.06).toFixed(2);
          }
        }
      } else {
        // VSP or other commercial
        const cp = window.prompt(`Enter CO-PAY for ${name}:`, "0");
        if (cp !== null) {
          oweValStr = (parseFloat(cp) * 1.06).toFixed(2);
        }
      }
    } else {
      oweValStr = (price * 1.06).toFixed(2);
    }

    updateBillingRow(targetRow, {
      retail: price.toString(),
      label: isMiscCat || isAntiGlare ? name : `LENS: ${name}`,
      retailWithTax: (price * 1.06).toFixed(2),
      owe: oweValStr,
    });

    const nameUpper = name.toUpperCase();
    let promptMsg = "";
    if (nameUpper.includes("TRANS")) promptMsg = "What color for Transitions?";
    else if (nameUpper.includes("TINT")) promptMsg = "What tint color/shade?";
    else if (nameUpper.includes("POLAR")) promptMsg = "What polarized color?";
    else if (nameUpper.includes("MIRROR"))
      promptMsg = "What mirror coating color?";

    if (promptMsg) {
      const resp = window.prompt(promptMsg, "");
      if (resp) {
        updateBillingRow(targetRow, {
          label: `${isMiscCat || isAntiGlare ? name : `LENS: ${name}`} (${resp})`,
        });
        setColorType(
          nameUpper.includes("TRANS")
            ? "TRANS"
            : nameUpper.includes("TINT")
              ? "TINT"
              : nameUpper.includes("POLAR")
                ? "POLAR"
                : "MIRROR",
        );
        setColorDetail(resp);
      }
    }

    // Auto-close catalog on mobile
    if (window.innerWidth < 768) setShowCatalog(false);
  };

  // --- AUTOMATIC REASONING (The "If" Functions) ---
  const autoChargesRef = React.useRef<Set<string>>(new Set());
  useEffect(() => {
    const newCharges: Array<{ key: string; row: string; data: BillingRow }> =
      [];

    // 1. Oversize Check
    const size = parseFloat(frameA) || 0;
    if (size >= 58 && !autoChargesRef.current.has("oversize")) {
      autoChargesRef.current.add("oversize");
      const row =
        billing.m1.retail === ""
          ? "m1"
          : billing.m2.retail === ""
            ? "m2"
            : "m3";
      newCharges.push({
        key: "oversize",
        row,
        data: {
          label: "EYESIZE 58+",
          retail: "20.00",
          retailWithTax: "21.20",
          owe: plan === "None" ? "21.20" : "0.00",
          autoChargeKey: "oversize",
        },
      });
    }

    // 2. RX Evaluation (Prism Check)
    const hasPrism = rx.od.hasPrism || rx.os.hasPrism;
    if (hasPrism && !autoChargesRef.current.has("prism")) {
      autoChargesRef.current.add("prism");
      const row =
        billing.m1.retail === ""
          ? "m1"
          : billing.m2.retail === ""
            ? "m2"
            : "m3";
      newCharges.push({
        key: "prism",
        row,
        data: {
          label: "PRISM CHARGE",
          retail: "10.00",
          retailWithTax: "10.60",
          owe: plan === "None" ? "10.60" : "0.00",
          autoChargeKey: "prism",
        },
      });
    }

    // 3. SPH Check
    const parseRx = (val: string) =>
      Math.abs(parseFloat(val.replace(/[^0-9.-]/g, "")) || 0);
    const maxSph = Math.max(parseRx(rx.od.sph), parseRx(rx.os.sph));
    if (maxSph >= 8 && !autoChargesRef.current.has("sph8")) {
      autoChargesRef.current.add("sph8");
      const row =
        billing.m1.retail === ""
          ? "m1"
          : billing.m2.retail === ""
            ? "m2"
            : "m3";
      newCharges.push({
        key: "sph8",
        row,
        data: {
          label: "OVER ±8.00 SPH",
          retail: "20.00",
          retailWithTax: "21.20",
          owe: plan === "None" ? "21.20" : "0.00",
          autoChargeKey: "sph8",
        },
      });
    } else if (
      maxSph >= 4 &&
      maxSph < 8 &&
      !autoChargesRef.current.has("sph4")
    ) {
      autoChargesRef.current.add("sph4");
      const row =
        billing.m1.retail === ""
          ? "m1"
          : billing.m2.retail === ""
            ? "m2"
            : "m3";
      newCharges.push({
        key: "sph4",
        row,
        data: {
          label: "OVER ±4.00 SPH",
          retail: "10.00",
          retailWithTax: "10.60",
          owe: plan === "None" ? "10.60" : "0.00",
          autoChargeKey: "sph4",
        },
      });
    }

    // 4. ADD Check
    const maxAdd = Math.max(parseRx(rx.od.add), parseRx(rx.os.add));
    if (maxAdd >= 4 && !autoChargesRef.current.has("add4")) {
      autoChargesRef.current.add("add4");
      const row =
        billing.m1.retail === ""
          ? "m1"
          : billing.m2.retail === ""
            ? "m2"
            : "m3";
      newCharges.push({
        key: "add4",
        row,
        data: {
          label: "ADD OVER +4.00",
          retail: "30.00",
          retailWithTax: "31.80",
          owe: plan === "None" ? "31.80" : "0.00",
          autoChargeKey: "add4",
        },
      });
    } else if (
      maxAdd >= 3 &&
      maxAdd < 4 &&
      !autoChargesRef.current.has("add3")
    ) {
      autoChargesRef.current.add("add3");
      const row =
        billing.m1.retail === ""
          ? "m1"
          : billing.m2.retail === ""
            ? "m2"
            : "m3";
      newCharges.push({
        key: "add3",
        row,
        data: {
          label: "ADD OVER +3.00",
          retail: "15.00",
          retailWithTax: "15.90",
          owe: plan === "None" ? "15.90" : "0.00",
          autoChargeKey: "add3",
        },
      });
    }

    if (newCharges.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBilling((prev) => {
        const next = { ...prev };
        newCharges.forEach(({ row, data }) => {
          if (next[row].retail === "" || next[row].label.includes("MISC")) {
            next[row] = data;
          }
        });
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameA, rx]);

  // --- TOTAL CALCULATIONS ---
  const totals = (Object.values(billing) as BillingRow[]).reduce(
    (acc, b) => {
      acc.retail += parseFloat(b.retail) || 0;
      acc.owe += parseFloat(b.owe) || 0;
      return acc;
    },
    { retail: 0, owe: 0 },
  );

  let finalOwe = totals.owe;
  if (isAllowancePlan && globalAllowance > 0) {
    const overage = Math.max(0, totals.retail - globalAllowance);
    const isEyeMedGroup =
      plan === "EYE-MED" ||
      plan === "AETNA EYE-MED" ||
      plan === "MARCH/EYESYNERGY";
    if (isEyeMedGroup) {
      // 20% off the overage
      finalOwe = overage * 0.8 * 1.06;
    } else {
      finalOwe = overage * 1.06;
    }
  }

  // --- SUBMISSION ---
  const handlePrint = async () => {
    const snapshot: JobSnapshot = {
      jobNum,
      optician: user!.initials,
      patient,
      plan,
      dr: dr === "Other" ? drOther : dr,
      frame,
      pd,
      seght: seg,
      lensName: billing.lens.label,
      rx,
      billing,
      timestamp: serverTimestamp() as unknown as number,
    };

    try {
            await push(ref(database, "jobHistory"), snapshot);
      await set(ref(database, "lastJobNumber"), jobNum + 1);

      // Visual feedback
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
        resetForm();
      }, 500);
    } catch (err) {
      alert("Database error: " + err);
    }

  };

  // --- SPLASH SCREEN ---
  if (showSplash) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black z-[9999]"
        id="splash-screen"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <img
            src="/post2.png"
            alt="POST"
            className="w-48 h-48 object-contain"
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              POST
            </h1>
            <h2 className="text-white text-sm uppercase tracking-widest font-medium">
              PAL optical slip tool
            </h2>
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- LOGIN SECURITY ---
  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-all ${theme === "dark" ? "theme-dark bg-theme-bg" : "bg-slate-100"}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-theme-card rounded-2xl shadow-sm p-8 w-full max-w-sm border-theme-main"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-theme-text transition-all">
              P.O.S.T.
            </h1>
            <p className="text-xs font-black text-theme-muted uppercase tracking-widest">
              Pal Optical Slip Tool
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-black mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-theme-bg border-theme-border rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-theme-accent transition-all font-bold uppercase text-theme-text"
                value={loginForm.name}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-black mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-theme-bg border-theme-border rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-theme-accent transition-all font-bold text-theme-text"
                value={loginForm.pass}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, pass: e.target.value })
                }
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-[10px] font-black uppercase text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid Patient Order Selection
              </p>
            )}

            <button className="w-full bg-theme-text text-theme-card rounded-xl py-4 font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all active:scale-95 border-theme-border">
              Login Device
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- MAIN APP UI ---
  const missingFields: string[] = [];
  const isPrintDisabled = false;

  return (
    <div
      className={`flex flex-col md:flex-row h-screen overflow-hidden transition-all ${theme === "dark" ? "theme-dark bg-theme-bg" : "bg-slate-50"}`}
    >
      {/* SIDEBAR REMOVED AS REQUESTED (Consolidated to left stream) */}

      {/* CENTER: WORKBENCH */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* HEADER DASHBOARD */}
          <header
            className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 transition-colors ${theme === "dark" ? "border-white" : "border-black"}`}
          >
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-theme-text">
                  P.O.S.T.
                </h1>
                <p className="text-[10px] font-black text-theme-text uppercase tracking-[0.2em] mt-3">
                  Workbench v2.0 &bull; {user.name}
                </p>
              </div>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-3 bg-theme-card border-theme-border rounded-2xl text-theme-text hover:opacity-80 transition-all flex items-center gap-2"
                title="Toggle Theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowCatalog(true)}
                className="p-3 bg-theme-card border-theme-border rounded-2xl text-theme-text hover:opacity-80 transition-all group"
                title="Open Lens Catalog"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="bg-theme-card p-3 px-5 rounded-2xl border-theme-border">
                <label className="block text-[9px] font-black text-theme-text uppercase">
                  Current Job
                </label>
                <span className="text-xl font-black text-theme-accent">
                  {jobNum}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handlePrint}
                  disabled={isPrintDisabled}
                  className={`rounded-2xl px-6 py-2 flex items-center gap-2 font-black uppercase text-xs tracking-widest transition-all border-2 ${
                    !isPrintDisabled
                      ? "bg-green-500 border-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 cursor-pointer"
                      : theme === "dark"
                        ? "bg-white border-white text-black opacity-50 cursor-not-allowed"
                        : "bg-transparent border-black text-black opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  Submit Order
                </button>
                {missingFields.length > 0 && (
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-red-500 tracking-widest">
                      ⚠ Caution
                    </p>
                    {missingFields.map((f) => (
                      <p
                        key={f}
                        className="text-[9px] font-bold text-red-500 uppercase"
                      >
                        • {f}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setUser(null)}
                className="p-3 bg-theme-card border-theme-border rounded-2xl text-theme-text hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

                    <div className="flex flex-col gap-8 pb-32">
            {/* SINGLE COLUMN: ALL TOGETHER ON LEFT */}
            <section className="bg-theme-card p-6 rounded-3xl border-theme-main space-y-4 transition-all shadow-sm">
              <button
                onClick={() => setShowPatientForm(true)}
                className="w-full bg-theme-card text-theme-text border-theme-border rounded-xl py-3 px-4 flex items-center justify-between font-black uppercase text-[10px] tracking-widest hover:bg-theme-bg transition-all"
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> New Patient Sheet
                </span>
                <Plus className="w-4 h-4" />
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                    Insurance Plan
                  </label>
                  <select
                    value={plan}
                    onChange={(e) =>
                      handleInsuranceChange(e.target.value as InsurancePlan)
                    }
                    className="w-full bg-theme-bg border-theme-border rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-1 focus:ring-theme-accent text-sm text-theme-text"
                  >
                    <option value="None">Private Pay / None</option>
                    <option value="MEDICAID">MEDICAID</option>
                    <option value="SCHOOL LETTER">SCHOOL LETTER</option>
                    <option value="EYE-MED">EYE-MED</option>
                    <option value="AETNA EYE-MED">AETNA EYE-MED</option>
                    <option value="PREMIER VISION">PREMIER VISION</option>
                    <option value="MARCH/EYESYNERGY">MARCH/EYESYNERGY</option>
                    <option value="UNUM">UNUM</option>
                    <option value="NVA">NVA</option>
                    <option value="VBA">VBA</option>
                    <option value="VSP">VSP</option>
                    <option value="SPECTERA">SPECTERA</option>
                    <option value="WELLCARE MEDICARE">WELLCARE MEDICARE</option>
                  </select>
                </div>

                {plan === "MEDICAID" && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-theme-bg rounded-2xl border-theme-border">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-theme-text mb-1">
                        Medicaid Type
                      </label>
                      <select
                        value={medicaidType}
                        onChange={(e) => setMedicaidType(e.target.value)}
                        className="w-full bg-theme-bg border-theme-border rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-theme-accent outline-none text-theme-text"
                      >
                        {MEDICAID_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-theme-text mb-1">
                        Medicaid Code
                      </label>
                      <select
                        value={medicaidCode}
                        onChange={(e) => setMedicaidCode(e.target.value)}
                        className="w-full bg-theme-bg border-theme-border rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-theme-accent outline-none text-theme-text"
                      >
                        {MEDICAID_CODES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {plan === "SCHOOL LETTER" && (
                  <div className="p-4 bg-theme-bg rounded-2xl border-theme-border">
                    <label className="block text-[9px] font-black uppercase text-theme-text mb-1">
                      Lexington KY Schools
                    </label>
                    <select
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-theme-bg border-theme-border rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-theme-accent outline-none text-theme-text"
                    >
                      <option value="">Select School...</option>
                      {LEXINGTON_SCHOOLS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                      Patient Name
                    </label>
                    <input
                      placeholder="Last, First"
                      className="w-full bg-theme-bg border-theme-border rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-1 focus:ring-theme-accent text-sm text-theme-text"
                      value={patient}
                      onChange={(e) => setPatient(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                      Phone Number
                    </label>
                    <input
                      placeholder="(XXX) XXX-XXXX"
                      className="w-full bg-theme-bg border-theme-border rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-1 focus:ring-theme-accent text-sm text-theme-text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-6 py-2">
                      {[
                        { id: "call", label: "Call" },
                        { id: "mail", label: "Mail" },
                        { id: "time", label: "Time" },
                      ].map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-theme-border text-theme-text focus:ring-theme-accent accent-theme-accent"
                            checked={
                              (promise as Record<string, boolean | string>)[
                                p.id
                              ] as boolean
                            }
                            onChange={(e) =>
                              setPromise({
                                ...promise,
                                [p.id]: e.target.checked,
                              })
                            }
                          />
                          <span className="text-[10px] font-black uppercase text-theme-text group-hover:text-theme-accent transition-colors">
                            {p.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {promise.time && (
                      <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-200">
                        <label className="block text-[10px] font-black uppercase text-black mb-1 italic">
                          Promise Time
                        </label>
                        <input
                          placeholder="e.g. 2:00 PM"
                          className="w-full bg-white border border-black rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-1 focus:ring-black text-sm text-black"
                          value={promise.timeVal}
                          onChange={(e) =>
                            setPromise({ ...promise, timeVal: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* FRAME & LENS SPECIFICATIONS (SECOND BOX) */}
            <section className="bg-theme-card p-8 rounded-3xl border-theme-main space-y-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-theme-text font-bold italic">
                  Frame & Lens Specifications
                </h3>
                <button
                  onClick={() => setShowMeasureTool(true)}
                  className="text-[10px] font-black uppercase text-theme-text flex items-center gap-1 hover:underline"
                >
                  <CreditCard className="w-3 h-3 text-theme-accent" /> Use
                  Camera Grid
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-theme-bg p-4 rounded-2xl border-theme-border">
                  <label className="block text-[10px] font-black uppercase text-theme-text font-bold mb-1 tracking-wider">
                    Frame Name
                  </label>
                  <input
                    className="w-full bg-transparent font-black text-xl outline-none text-theme-text"
                    placeholder="e.g. Ray-Ban RB5154"
                    value={frame}
                    onChange={(e) => {
                      setFrame(e.target.value);
                      updateBillingRow("frame", {
                        label: e.target.value
                          ? `FRAME: ${e.target.value}`
                          : "FRAME",
                      });
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-theme-bg p-4 rounded-2xl border-theme-border">
                    <label className="block text-[10px] font-black uppercase text-theme-text font-bold mb-1 tracking-wider">
                      Eye Size (A)
                    </label>
                    <input
                      className="w-full bg-transparent font-black text-xl outline-none text-theme-text"
                      placeholder="e.g. 52"
                      value={frameA}
                      onChange={(e) => setFrameA(e.target.value)}
                    />
                  </div>
                  <div className="bg-theme-bg p-4 rounded-2xl border-theme-border">
                    <label className="block text-[10px] font-black uppercase text-theme-text font-bold mb-1 tracking-wider">
                      DBL / Bridge
                    </label>
                    <input
                      className="w-full bg-transparent font-black text-xl outline-none text-theme-text"
                      placeholder="e.g. 18"
                      value={frameDbl}
                      onChange={(e) => setFrameDbl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-theme-bg p-4 rounded-2xl border-theme-border">
                    <label className="block text-[10px] font-black uppercase text-theme-text font-bold mb-1 tracking-wider">
                      P.D.
                    </label>
                    <input
                      className="w-full bg-transparent font-black text-xl outline-none text-theme-text"
                      value={pd}
                      onChange={(e) => setPd(e.target.value)}
                    />
                  </div>
                  <div className="bg-theme-bg p-4 rounded-2xl border-theme-border">
                    <label className="block text-[10px] font-black uppercase text-theme-text font-bold mb-1 tracking-wider">
                      Seg Height
                    </label>
                    <input
                      className="w-full bg-transparent font-black text-xl outline-none text-theme-text"
                      value={seg}
                      onChange={(e) => setSeg(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-theme-border space-y-4">
                  <label className="block text-[11px] font-black uppercase text-theme-text italic">
                    Lens Type & Color
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap gap-2 items-center">
                                            {["CLEAR", "TINT", "POLAR", "MIRROR", "TRANS"].map((type) => (
                        <button
                          key={type}
                          onClick={() => handleColorChoice(type)}
                          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                            colorType === type
                              ? "bg-theme-text border-theme-border text-theme-card shadow-md scale-105"
                              : "bg-theme-card border-theme-border text-theme-text hover:bg-theme-bg"
                          }`}
                        >
                          {type}
                        </button>
                      ))}

                      {colorType !== "CLEAR" && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 border-b-2 border-black pb-1 ml-4"
                        >
                          <span className="text-[11px] font-black uppercase whitespace-nowrap italic text-black">
                            Color:
                          </span>
                          <input
                            type="text"
                            placeholder="Type color..."
                            className="bg-transparent border-none outline-none font-black uppercase text-[12px] w-40 placeholder:text-slate-400 text-black"
                            value={colorDetail}
                            onChange={(e) => setColorDetail(e.target.value)}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BILLING TABLE */}
            <section className="bg-theme-card p-6 rounded-3xl border-theme-main space-y-4 text-theme-text shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest text-black font-bold italic">
                Billing Summary
              </h3>

                            <div className="flex text-[8px] font-black uppercase text-theme-text border-b-theme-border pb-1 gap-2">
                <span className="flex-[2]">Description</span>
                <span className="flex-1">Retail</span>
                <span className="w-16 text-right">+Tax(6%)</span>
                <span className="w-16 text-right">Pt Owe</span>
              </div>

              <div className="space-y-2">
                {Object.keys(billing).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-theme-border group/row gap-2"
                  >
                    <div className="flex-[2]">
                      {key.startsWith("m") ? (
                        <input
                          placeholder={`Misc ${key.charAt(1)}`}
                          className="bg-transparent border-none outline-none text-xs font-bold w-full uppercase placeholder:text-slate-400 text-black"
                          value={billing[key].label}
                          onChange={(e) =>
                            updateBillingRow(key, { label: e.target.value })
                          }
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-theme-text uppercase">
                          {billing[key].label}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        className="w-full bg-transparent text-left font-black text-xs outline-none text-theme-text"
                        placeholder="0.00"
                        value={billing[key].retail}
                        onChange={(e) =>
                          updateBillingRow(key, {
                            retail: e.target.value,
                            retailWithTax: (
                              parseFloat(e.target.value || "0") * 1.06
                            ).toFixed(2),
                            owe: calcOwe(e.target.value, key),
                          })
                        }
                      />
                    </div>

                    <div className="w-16 text-right text-[10px] font-bold text-slate-500">
                      {billing[key].retailWithTax}
                    </div>
                    <div className="w-16">
                      <input
                        className="w-full bg-transparent text-right font-black text-xs outline-none text-red-600"
                        value={billing[key].owe}
                        onChange={(e) =>
                          updateBillingRow(key, { owe: e.target.value })
                        }
                      />
                    </div>
                    <button
                      onClick={() => {
                        const defaultLabels: Record<string, string> = {
                          frame: "FRAME",
                          lens: "LENS",
                          coat: "A/R COATING",
                        };
                        updateBillingRow(key, {
                          label: defaultLabels[key] || "",
                          retail: "",
                          retailWithTax: "0.00",
                          owe: "0.00",
                        });
                      }}
                      className="p-1 text-black hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {isAllowancePlan && (
                <div className="bg-theme-bg p-3 rounded-xl border-theme-border flex justify-between items-center text-[11px]">
                  <span className="text-black font-bold uppercase tracking-widest italic">
                    Plan Allowance
                  </span>
                  <span className="font-black text-red-600">
                    -${globalAllowance.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="pt-6 border-t border-theme-border space-y-4">
                <label className="block text-[10px] font-black uppercase text-theme-text tracking-widest italic">
                  Payment Method
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setShowCardMenu(!showCardMenu);
                      if (payMethod === "Cash" || payMethod === "Check") {
                        setPayMethod("");
                      }
                    }}
                    className={`px-4 py-2 rounded-xl border-theme-border text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
                      cardTypes.includes(payMethod)
                        ? "bg-theme-text text-theme-card"
                        : "bg-theme-card text-theme-text hover:bg-theme-bg"
                    }`}
                  >
                    {cardTypes.includes(payMethod)
                      ? `Card: ${payMethod}`
                      : "Credit Card"}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${showCardMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      setPayMethod("Cash");
                      setShowCardMenu(false);
                    }}
                    className={`px-4 py-2 rounded-xl border-theme-border text-[10px] font-black uppercase transition-all ${
                      payMethod === "Cash"
                        ? "bg-theme-text text-theme-card shadow-lg"
                        : "bg-theme-card text-theme-text hover:bg-theme-bg"
                    }`}
                  >
                    Cash
                  </button>

                  <button
                    onClick={() => {
                      setPayMethod("Check");
                      setShowCardMenu(false);
                      const num = prompt("Enter Check Number:");
                      setCheckNum(num || "");
                    }}
                    className={`px-4 py-2 rounded-xl border-theme-border text-[10px] font-black uppercase transition-all ${
                      payMethod === "Check"
                        ? "bg-theme-text text-theme-card shadow-lg"
                        : "bg-theme-card text-theme-text hover:bg-theme-bg"
                    }`}
                  >
                    {payMethod === "Check" && checkNum
                      ? `Check #${checkNum}`
                      : "Check"}
                  </button>
                </div>

                <AnimatePresence>
                  {showCardMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-wrap gap-2 p-4 bg-theme-bg rounded-2xl border border-dashed border-theme-border"
                    >
                      {cardTypes.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setPayMethod(c);
                            setShowCardMenu(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg border-theme-border text-[9px] font-black uppercase transition-all ${
                            payMethod === c
                              ? "bg-theme-text text-theme-card"
                              : "bg-theme-card text-theme-text hover:bg-theme-bg"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                              <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setShowItemizedReceipt(true)}
                    className="w-full rounded-2xl px-6 py-2 flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-all border-2 bg-blue-500 border-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                  >
                    <FileText className="w-4 h-4" />
                    Itemized Receipt
                  </button>
                </div>

                <div className="pt-4 flex justify-between items-end">

                <div>
                  <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                    Patient Total
                  </label>
                  <span className="text-5xl font-black italic tracking-tighter text-theme-text">
                    ${f(finalOwe)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-theme-muted uppercase tracking-wider">
                    Optician: {user.initials}
                  </p>
                </div>
              </div>
            </section>

                                    {/* DOCTOR & PRESCRIPTION */}
            <section className="bg-theme-card p-10 rounded-3xl border-theme-main space-y-8 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-theme-text font-bold italic">
                  Doctor & Prescription
                </h3>
                <span className="p-1 px-2 rounded bg-white text-black font-black text-[9px] uppercase flex items-center gap-1 border border-black">
                  <ShieldCheck className="w-3 h-3 text-green-600" /> Verified
                </span>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-3 p-5 bg-theme-bg rounded-2xl border-theme-border transition-all">
                  <label className="block text-[11px] font-black uppercase text-theme-text">
                    Prescribing Doctor
                  </label>
                  <select
                    className="w-full bg-white border border-black rounded-xl px-4 py-3 font-bold outline-none focus:ring-1 focus:ring-black text-sm text-black"
                    value={dr}
                    onChange={(e) => setDr(e.target.value)}
                  >
                    <option value="">Select Dr...</option>
                    <option value="Steven Klecker">Dr. Steven Klecker</option>
                    <option value="Kathryn Robbins">Dr. Kathryn Robbins</option>
                    <option value="Other">Other...</option>
                  </select>
                  {dr === "Other" && (
                    <input
                      placeholder="Type Doctor Name..."
                      className="w-full bg-white border border-black rounded-xl px-4 py-3 font-bold outline-none focus:ring-1 focus:ring-black text-sm text-black"
                      value={drOther}
                      onChange={(e) => setDrOther(e.target.value)}
                    />
                  )}
                </div>

                {["od", "os"].map((eye) => (
                  <div key={eye} className="grid grid-cols-5 gap-4">
                    <div className="col-span-5 text-[11px] font-black uppercase text-theme-text mb-2 italic">
                      {eye === "od" ? "RIGHT EYE (OD)" : "LEFT EYE (OS)"}
                    </div>
                    {["sph", "cyl", "axis", "add"].map((field) => (
                      <div key={field}>
                        <label className="block text-[9px] font-black uppercase text-theme-text mb-1 text-center">
                          {field}
                        </label>
                        <input
                          placeholder="0.00"
                          className="w-full bg-theme-bg border-b-2 border-theme-border py-2 text-center font-bold text-lg outline-none text-theme-text"
                          value={
                            (
                              rx as Record<
                                string,
                                Record<string, string | boolean>
                              >
                            )[eye][field] as string
                          }
                          onChange={(e) =>
                            handleRxChange(
                              eye as "od" | "os",
                              field,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center">
                      <label className="block text-[9px] font-black uppercase text-theme-text mb-1 text-center">
                        Prism
                      </label>
                      <input
                        type="checkbox"
                        checked={
                          (
                            rx as Record<
                              string,
                              Record<string, string | boolean>
                            >
                          )[eye].hasPrism as boolean
                        }
                        onChange={(e) =>
                          setRx({
                            ...rx,
                            [eye]: {
                              ...(
                                rx as Record<
                                  string,
                                  Record<string, string | boolean>
                                >
                              )[eye],
                              hasPrism: e.target.checked,
                            },
                          })
                        }
                        className="w-6 h-6 rounded border-theme-border text-theme-accent focus:ring-theme-accent accent-theme-accent"
                      />
                    </div>

                    {(rx as Record<string, Record<string, string | boolean>>)[
                      eye
                    ].hasPrism && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="col-span-5 flex flex-col gap-4 mt-2 p-4 bg-theme-bg rounded-xl border border-theme-border"
                      >
                        <div className="flex items-end gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              setRx({
                                ...rx,
                                [eye]: {
                                  ...(
                                    rx as Record<
                                      string,
                                      Record<string, string | boolean>
                                    >
                                  )[eye],
                                  hasCompoundPrism: !((
                                    rx as Record<
                                      string,
                                      Record<string, string | boolean>
                                    >
                                  )[eye].hasCompoundPrism as boolean),
                                },
                              })
                            }
                            className={`w-8 h-8 mb-1 shrink-0 rounded-full flex items-center justify-center transition-colors ${(rx as Record<string, Record<string, string | boolean>>)[eye].hasCompoundPrism ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                            title="Toggle Compound Prism"
                          >
                            <Plus
                              className={`w-5 h-5 transition-transform ${(rx as Record<string, Record<string, string | boolean>>)[eye].hasCompoundPrism ? "rotate-45" : ""}`}
                            />
                          </button>
                          <div className="flex-1">
                            <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                              Amount
                            </label>
                            <input
                              placeholder="0.00"
                              className="w-full bg-white border border-theme-border rounded px-3 py-2 text-sm font-bold text-black"
                              value={
                                (
                                  rx as Record<
                                    string,
                                    Record<string, string | boolean>
                                  >
                                )[eye].prism as string
                              }
                              onChange={(e) =>
                                handleRxChange(
                                  eye as "od" | "os",
                                  "prism",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                              Base
                            </label>
                            <select
                              className="w-full bg-white border border-theme-border rounded px-2 py-2 text-sm font-bold text-black"
                              value={
                                (
                                  rx as Record<
                                    string,
                                    Record<string, string | boolean>
                                  >
                                )[eye].prismBase as string
                              }
                              onChange={(e) =>
                                setRx({
                                  ...rx,
                                  [eye]: {
                                    ...(
                                      rx as Record<
                                        string,
                                        Record<string, string | boolean>
                                      >
                                    )[eye],
                                    prismBase: e.target.value,
                                  },
                                })
                              }
                            >
                              <option value="BO">BO</option>
                              <option value="BU">BU</option>
                              <option value="BD">BD</option>
                              <option value="BI">BI</option>
                            </select>
                          </div>
                        </div>

                        {(
                          rx as Record<string, Record<string, string | boolean>>
                        )[eye].hasCompoundPrism && (
                          <div className="flex items-end gap-4 pl-12">
                            <div className="flex-1">
                              <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                                Amount 2
                              </label>
                              <input
                                placeholder="0.00"
                                className="w-full bg-white border border-theme-border rounded px-3 py-2 text-sm font-bold text-black"
                                value={
                                  (
                                    rx as Record<
                                      string,
                                      Record<string, string | boolean>
                                    >
                                  )[eye].prism2 as string
                                }
                                onChange={(e) =>
                                  handleRxChange(
                                    eye as "od" | "os",
                                    "prism2",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-[10px] font-black uppercase text-theme-text mb-1">
                                Base 2
                              </label>
                              <select
                                className="w-full bg-white border border-theme-border rounded px-2 py-2 text-sm font-bold text-black"
                                value={
                                  (
                                    rx as Record<
                                      string,
                                      Record<string, string | boolean>
                                    >
                                  )[eye].prismBase2 as string
                                }
                                onChange={(e) =>
                                  setRx({
                                    ...rx,
                                    [eye]: {
                                      ...(
                                        rx as Record<
                                          string,
                                          Record<string, string | boolean>
                                        >
                                      )[eye],
                                      prismBase2: e.target.value,
                                    },
                                  })
                                }
                              >
                                <option value="BO">BO</option>
                                <option value="BU">BU</option>
                                <option value="BD">BD</option>
                                <option value="BI">BI</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}

                <div className="flex gap-4">
                  {["dvo", "nvo", "ivo"].map((flag) => (
                    <button
                      key={flag}
                      onClick={() =>
                        setRxFlags({
                          ...rxFlags,
                          [flag]: !(rxFlags as Record<string, boolean>)[flag],
                        })
                      }
                      className={`flex-1 p-3 rounded-xl text-[11px] font-black uppercase transition-all border-theme-border ${(rxFlags as Record<string, boolean>)[flag] ? "bg-theme-text text-theme-card" : "bg-theme-card text-theme-text hover:bg-theme-bg"}`}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>
            </section>



                        {/* LAB NOTES */}
            <section className="bg-theme-card p-6 rounded-3xl border-theme-main space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-theme-accent font-bold italic">
                Lab Notes
              </h3>
              <textarea
                placeholder="Enter any special instructions for the lab..."
                className="w-full bg-theme-bg border-theme-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-1 focus:ring-theme-accent text-sm text-theme-text min-h-[300px] resize-y"
                value={labNotes}
                onChange={(e) => setLabNotes(e.target.value)}
              />
            </section>

            {/* WAIVERS — PDF BUTTONS */}
            <section className="bg-theme-card p-6 rounded-3xl border-theme-main space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-theme-accent font-bold italic">
                Waivers & Precautions
              </h3>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-wider">
                Click to open form-fillable PDF. Have patient sign on screen.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "expired",
                    label: "Expired Rx",
                    file: "/waivers/waiver-expired-rx.pdf",
                  },
                  {
                    id: "pof",
                    label: "Patient Own Frame",
                    file: "/waivers/waiver-patient-own-frame.pdf",
                  },
                  {
                    id: "thick",
                    label: "Frame Thickness",
                    file: "/waivers/waiver-frame-thickness.pdf",
                  },
                  {
                    id: "poly",
                    label: "Child / Poly",
                    file: "/waivers/waiver-child-poly.pdf",
                  },
                  {
                    id: "noline",
                    label: "Lined to No-Line",
                    file: "/waivers/waiver-lined-to-no-line.pdf",
                  },
                  {
                    id: "semirim",
                    label: "Semi-Rimless",
                    file: "/waivers/waiver-semi-rimless.pdf",
                  },
                  {
                    id: "remake",
                    label: "Remake",
                    file: "/waivers/waiver-remake.pdf",
                  },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => window.open(w.file, "_blank")}
                    className="flex items-center gap-3 p-3 bg-theme-bg rounded-xl border-theme-border hover:bg-theme-accent hover:text-theme-card transition-all text-left group"
                  >
                    <FileText className="w-4 h-4 text-theme-accent group-hover:text-theme-card transition-colors" />
                    <span className="text-[11px] font-black uppercase text-theme-text group-hover:text-theme-card transition-colors">
                      {w.label}
                    </span>
                    <span className="ml-auto text-[9px] font-bold uppercase text-theme-muted group-hover:text-theme-card/70 transition-colors">
                      Open PDF →
                    </span>
                  </button>
                ))}
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                  ⚠ Place your form-fillable PDF files in the
                  "pal-optical-react/public/waivers/" folder with the names
                  shown above.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* OVERLAYS */}
      <AnimatePresence>
        {showMeasureTool && (
          <MeasurementTool
            onClose={() => setShowMeasureTool(false)}
            onSave={(m) => {
              setPd(m.pd.toFixed(1));
              setSeg(m.seg.toFixed(1));
              setShowMeasureTool(false);
            }}
          />
        )}
        {showPatientForm && (
          <PatientForm
            initialName={patient}
            onClose={() => setShowPatientForm(false)}
            onSave={(data) => {
              setPatient(data.name);
              setPhone(data.phone);
              setShowPatientForm(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* MAIL ADDRESS MODAL */}
      <AnimatePresence>
        {showMailPopup && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMailPopup(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-theme-card border-theme-main p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-black uppercase italic mb-4 text-theme-text">
                Mailing Address
              </h2>
              <p className="text-[11px] font-bold text-theme-muted uppercase mb-6">
                Patient requested Mail Option. Enter address for clinical slip.
              </p>

              <textarea
                autoFocus
                placeholder="Enter full address..."
                className="w-full h-32 bg-theme-bg border-theme-border rounded-xl p-4 font-bold text-theme-text outline-none focus:ring-1 focus:ring-theme-accent transition-all uppercase"
                value={mailAddress}
                onChange={(e) => setMailAddress(e.target.value)}
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowMailPopup(false)}
                  className="flex-1 bg-theme-text text-theme-card py-3 rounded-xl font-black uppercase tracking-widest border-theme-border"
                >
                  Confirm Address
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATALOG OVERLAY */}
      <AnimatePresence>
        {showCatalog && (
          <div className="fixed inset-0 z-[1100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCatalog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative w-full max-w-lg bg-theme-card h-full shadow-2xl flex flex-col border-l border-theme-border"
            >
              <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-card">
                <h2 className="text-sm font-black uppercase tracking-widest text-theme-text italic">
                  Select Lens Option
                </h2>
                <button
                  onClick={() => setShowCatalog(false)}
                  className="p-2 text-theme-text hover:text-theme-accent"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
                            <div className="flex-1 overflow-y-auto">
                <Catalog
                  currentPlan={plan}
                  isAllowancePlan={isAllowancePlan}
                  onSelectItem={handleCatalogSelect}
                  selectedItemName={billing.lens.label}
                />


                {/* RECENT ACTIVITY MOVED HERE */}
                <div className="p-6 border-t-4 border-theme-main bg-theme-card">
                  <h3 className="text-xs font-black uppercase text-theme-text mb-4 flex items-center gap-2 italic">
                    <History className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3 pb-20">
                    {history.length > 0 ? (
                      history.map((j, idx) => (
                        <div
                          key={idx}
                          className="bg-theme-bg p-3 rounded-xl border border-theme-border flex flex-col gap-1 text-[11px] text-theme-text hover:bg-theme-accent hover:text-theme-card transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-black text-xs">
                              {j.jobNum}
                            </span>
                            <span className="p-1 px-2 rounded bg-theme-card border border-theme-border font-black text-[9px] uppercase">
                              {j.plan}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold uppercase">
                              {j.patient}
                            </span>
                            <small className="text-theme-muted font-black">
                              ({j.optician})
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-theme-muted font-bold uppercase text-[10px] tracking-widest">
                        No recent transactions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE NAV */}
      <nav className="lg:hidden h-16 bg-theme-card border-t border-theme-border flex items-center justify-around px-4">
        <button
          onClick={() => setShowCatalog(true)}
          className="flex flex-col items-center gap-1 text-theme-text"
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase">Search</span>
        </button>
        <button
          onClick={() => setShowPatientForm(true)}
          className="flex flex-col items-center gap-1 text-theme-text"
        >
          <UserPlus className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase">Form</span>
        </button>
        <button
          onClick={handlePrint}
          disabled={isPrintDisabled}
          className={`p-3 px-6 rounded-2xl flex items-center gap-2 shadow-xl border-2 transition-all ${
            !isPrintDisabled
              ? "bg-green-500 border-green-500 text-white hover:bg-green-600 shadow-green-500/30"
              : theme === "dark"
                ? "bg-white border-white text-black opacity-50"
                : "bg-transparent border-black text-black opacity-50"
          }`}
        >
          <Printer className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase">Order</span>
        </button>
      </nav>

      {/* ITEMIZED RECEIPT OVERLAY */}
      <AnimatePresence>
        {showItemizedReceipt && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowItemizedReceipt(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white text-black p-0 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                <h2 className="text-lg font-black uppercase italic">Itemized Receipt Generator</h2>
                <button 
                  onClick={() => setShowItemizedReceipt(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                <ReceiptPageWrapper 
                  patientData={{
                    name: patient,
                    phone: phone,
                    address: mailAddress,
                    plan: plan,
                    billing: billing,
                    totals: totals,
                    finalOwe: finalOwe,
                    payMethod: payMethod,
                    checkNum: checkNum
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

            {/* HIDDEN PRINT LAYOUT — LANDSCAPE, TWO WRITE-UPS, ONE PAGE */}
      {!showItemizedReceipt && (
        <div
          className={`fixed inset-0 bg-white z-[99999] pointer-events-none opacity-0 ${isPrinting ? "opacity-100" : "hidden"}`}
        >
          {isPrinting && (
            <style>{`
              @media print {
                @page { size: landscape; margin: 0.25in; }
                body * { visibility: hidden; }
                .print-only, .print-only * { visibility: visible; }
                .print-only { position: absolute; left: 0; top: 0; width: 100%; }
              }
            `}</style>
          )}
          <div className="print-only w-full h-full bg-white text-black p-4 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4 h-full">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className={`flex flex-col justify-between h-full ${n === 1 ? "border-r-2 border-dashed border-black pr-4" : "pl-4"}`}
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-4xl font-black border-4 border-black px-4 py-1">
                      P.O.S.T.
                    </h1>
                    <div className="text-right">
                      <p className="text-[14px] font-bold uppercase">
                        Write-Up # {jobNum}
                      </p>
                      <p className="text-[14px] font-bold uppercase">
                        Date: {new Date().toLocaleDateString()}
                      </p>
                      <p className="text-[14px] font-bold uppercase">
                        Optician: {user.initials}
                      </p>
                    </div>
                  </div>

                  {/* PATIENT INFO */}
                  <div className="space-y-1 text-[16px] font-bold uppercase">
                    <div className="border-b border-black flex justify-between py-1">
                      <span>Patient:</span> <span>{patient}</span>
                    </div>
                    {promise.mail && mailAddress && (
                      <div className="border-b border-black flex flex-col py-1">
                        <span className="text-[12px]">Mailing Address:</span>
                        <span className="text-[14px] whitespace-pre-wrap leading-tight">
                          {mailAddress}
                        </span>
                      </div>
                    )}
                    <div className="border-b border-black flex justify-between py-1">
                      <span>Plan:</span>{" "}
                      <span>
                        {plan}{" "}
                        {plan === "MEDICAID"
                          ? `(${medicaidType} - ${medicaidCode})`
                          : plan === "SCHOOL LETTER"
                            ? `(${schoolName})`
                            : ""}
                      </span>
                    </div>
                    <div className="border-b border-black flex justify-between py-1">
                      <span>Payment:</span>{" "}
                      <span>
                        {payMethod} {payMethod === "Check" && `#${checkNum}`}
                      </span>
                    </div>
                  </div>

                  {/* FRAME SPECS BOX (SECOND BOX) */}
                  <div className="border-4 border-black p-3 bg-white my-2">
                    <div className="grid grid-cols-2 gap-y-2 text-[14px] font-black uppercase">
                      <div className="col-span-2 border-b border-black pb-1 mb-1">
                        Frame: {frame || "___"}
                      </div>
                      <div>A: {frameA || "___"}</div>
                      <div>DBL: {frameDbl || "___"}</div>
                      <div>PD: {pd || "___"}</div>
                      <div>SEG: {seg || "___"}</div>
                      <div className="col-span-2 pt-1 border-t border-black mt-1">
                        Color: {colorType} {colorDetail ? `(${colorDetail})` : ""}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className={`w-4 h-4 border-2 border-black flex items-center justify-center ${billing.coat.retail ? "bg-black" : ""}`}>
                          {billing.coat.retail && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        <span>A/R Coating {billing.coat.retail ? `(${billing.coat.label})` : ""}</span>
                      </div>
                    </div>
                  </div>

                  {/* BILLING TABLE */}
                  <table className="w-full text-[14px] font-bold border-collapse border-2 border-black">
                    <thead>
                      <tr className="bg-slate-100 italic border-b-2 border-black">
                        <th className="text-left p-1">ITEM</th>
                        <th className="text-center p-1">RETAIL</th>
                        <th className="text-right p-1">OWE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.values(billing) as BillingRow[]).map((b, i) => (
                        <tr key={i} className="border-t border-black">
                          <td className="p-1">{b.label}</td>
                          <td className="p-1 text-center">${f(b.retail)}</td>
                          <td className="p-1 text-right">${f(b.owe)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* TOTAL */}
                  <div className="flex justify-between items-end pt-1 mt-1">
                    <div className="text-xl font-black italic">
                      TOTAL: ${f(finalOwe)}
                    </div>
                    <div className="text-[10px] font-bold uppercase">
                      {promise.call && "☎ Will Call "}
                      {promise.mail && "✉ Will Mail "}
                      {promise.time && `⏰ ${promise.timeVal}`}
                    </div>
                  </div>

                  {/* RX BLOCK */}
                  <div className="border-4 border-black p-3 bg-white my-2">
                    <div className="border-b-2 border-black pb-2 mb-2">
                      <span className="text-[12px] font-black uppercase">Prescribing Doctor: {dr === "Other" ? drOther : dr}</span>
                    </div>
                    <div className="text-[14px] font-black border-b-2 border-black pb-2 mb-2 grid grid-cols-2 gap-4">
                      <div>
                        <span className="underline">OD:</span> SPH{" "}
                        {rx.od.sph || "___"} / CYL {rx.od.cyl || "___"} x{" "}
                        {rx.od.axis || "___"} / ADD {rx.od.add || "___"}
                        {rx.od.hasPrism && (
                          <span className="block text-[12px]">
                            Prism: {rx.od.prism}Δ {rx.od.prismBase}
                            {rx.od.hasCompoundPrism &&
                              ` / ${rx.od.prism2}Δ ${rx.od.prismBase2}`}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="underline">OS:</span> SPH{" "}
                        {rx.os.sph || "___"} / CYL {rx.os.cyl || "___"} x{" "}
                        {rx.os.axis || "___"} / ADD {rx.os.add || "___"}
                        {rx.os.hasPrism && (
                          <span className="block text-[12px]">
                            Prism: {rx.os.prism}Δ {rx.os.prismBase}
                            {rx.os.hasCompoundPrism &&
                              ` / ${rx.os.prism2}Δ ${rx.os.prismBase2}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* LAB NOTES */}
                  <div className="border-2 border-dashed border-black p-3 mt-2 flex-1">
                    <p className="text-[14px] font-black uppercase mb-1">
                      Lab Notes:
                    </p>
                    <p className="text-[18px] font-bold leading-tight min-h-[100px]">
                      {labNotes ||
                        "_______________________________________________"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Wrapper component to inject patient data into a simplified ReceiptPage
// Wrapper component to inject patient data into a simplified ReceiptPage
// Wrapper component to inject patient data into a simplified ReceiptPage
function ReceiptPageWrapper({ patientData }: { 
  patientData: {
    name: string;
    phone: string;
    address: string;
    plan: string;
    billing: Record<string, BillingRow>;
    totals: { retail: number; owe: number; };
    finalOwe: number;
    payMethod: string;
    checkNum: string;
  } 
}) {
  type ReceiptItem = {
    id: number;
    code: string;
    desc: string;
    qty: number;
    price: number;
  };

  // Helper to auto-assign V-Codes based on item description
  const getVCode = (label: string) => {
    const l = label.toUpperCase();
    if (l.includes("FRAME")) return "V2020";
    if (l.includes("SINGLE VISION") || l.includes("SV ") || l.includes("PLANO")) return "V2100";
    if (l.includes("BIFOCAL") || l.includes("FT-28") || l.includes("FT-35") || l.includes("BIF")) return "V2200";
    if (l.includes("TRIFOCAL") || l.includes("TRIF")) return "V2300";
    if (l.includes("PROGRESSIVE") || l.includes("PROG") || l.includes("VARILUX")) return "V2410";
    if (l.includes("TRANSITIONS") || l.includes("TRANS")) return "V2744";
    if (l.includes("TINT")) return "V2745";
    if (l.includes("ANTI-REFLECTIVE") || l.includes("A/R") || l.includes("AR COAT") || l.includes("GLARE")) return "V2750";
    if (l.includes("POLARIZED") || l.includes("POLAR")) return "V2762";
    if (l.includes("POLYCARBONATE") || l.includes("POLY")) return "V2784";
    return "V2799";
  };

  // Initialize line items from current billing state
  const initialItems = Object.values(patientData.billing)
    .filter((b) => b.retail && parseFloat(b.retail) > 0)
    .map((b, idx: number) => ({
      id: idx,
      code: getVCode(b.label),
      desc: b.label,
      qty: 1,
      price: parseFloat(b.retail)
    }));

  const [items, setItems] = useState<ReceiptItem[]>(initialItems);
  const [patAddress, setPatAddress] = useState<string>(patientData.address || "");

  const handleItemChange = (id: number, field: keyof ReceiptItem, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 0;
    setItems([...items, { id: newId, code: "", desc: "NEW ITEM", qty: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  // Calculations
  const subtotal = items.reduce((s: number, i: ReceiptItem) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + tax;
  const patientOwes = patientData.finalOwe;
  const insuranceDiscount = grandTotal > patientOwes ? grandTotal - patientOwes : 0;
  const amtPaid = patientOwes;
  const balance = patientOwes - amtPaid;

  return (
    <div className="receipt-content-wrapper">
      <style>{`
        @media print {
          @page { 
            size: portrait; 
            margin: 0.5in; 
          }

          /* Hide UI elements that cause blank pages or clutter */
          #root > *:not(.receipt-content-wrapper),
          main, header, nav, section, .fixed, .absolute, .backdrop-blur-md, button {
            display: none !important;
          }

          .receipt-content-wrapper {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
          }

          /* Force all text to black for the printer */
          .receipt-content-wrapper * {
            color: black !important;
            border-color: black !important;
            visibility: visible !important;
          }

          .print\\:hidden { display: none !important; }

          /* Clean up inputs for paper */
          input, textarea {
            border: none !important;
            background: transparent !important;
            outline: none !important;
            width: 100% !important;
          }

          .max-w-3xl {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="max-w-3xl mx-auto border-2 border-black p-10 bg-white shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-black pb-5 mb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic text-black uppercase">Pal Optical</h1>
            <p className="text-sm font-bold text-black">1555 E New Circle Rd, Suite 146</p>
            <p className="text-sm font-bold text-black">Lexington, KY 40509</p>
            <p className="text-sm font-bold text-black">Phone: (859) 266-3003</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-slate-300 italic">RECEIPT</h2>
            <p className="font-bold text-black">DATE: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 mb-2">Patient Info</h3>
            <div className="font-black text-sm uppercase text-black">{patientData.name}</div>
            <div className="font-bold text-sm text-black">{patientData.phone}</div>
            <textarea
              className="w-full mt-2 text-sm font-bold bg-transparent border border-dashed border-slate-300 p-2 resize-none outline-none text-black print:border-none"
              placeholder="Enter Patient Address..."
              value={patAddress}
              onChange={(e) => setPatAddress(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 mb-2">Insurance Plan</h3>
            <p className="font-black text-sm uppercase text-black">{patientData.plan}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-sm mb-6 text-black">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 font-black uppercase">Code</th>
              <th className="text-left py-2 font-black uppercase">Description</th>
              <th className="text-right py-2 font-black uppercase w-16">Qty</th>
              <th className="text-right py-2 font-black uppercase w-24">Price</th>
              <th className="text-right py-2 font-black uppercase w-24">Total</th>
              <th className="print:hidden w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-3">
                  <input
                    className="bg-transparent border-none outline-none font-bold w-20 uppercase text-black"
                    value={item.code}
                    onChange={(e) => handleItemChange(item.id, 'code', e.target.value)}
                  />
                </td>
                <td className="py-3">
                  <input
                    className="bg-transparent border-none outline-none font-bold w-full uppercase text-black"
                    value={item.desc}
                    onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)}
                  />
                </td>
                <td className="py-3 text-right">
                  <input
                    type="number"
                    className="bg-transparent border-none outline-none font-bold w-full text-right text-black"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="py-3 text-right">
                  <input
                    type="number"
                    className="bg-transparent border-none outline-none font-bold w-full text-right text-black"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="py-3 text-right font-black text-black">${(item.qty * item.price).toFixed(2)}</td>
                <td className="py-3 text-right print:hidden">
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table Actions */}
        <div className="mb-6 print:hidden">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-xs uppercase text-black">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Totals Section */}
        <div className="ml-auto w-72 space-y-2 text-black">
          <div className="flex justify-between font-bold">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Tax (6%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-black text-xl border-t-2 border-black pt-2">
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          
          {insuranceDiscount > 0 && (
            <div className="flex justify-between font-bold text-red-600 pt-1">
              <span>Insurance Benefits:</span>
              <span>-${insuranceDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-black border-t-2 border-black pt-2 mt-2">
            <span>Patient Total:</span>
            <span>${patientOwes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-black text-green-600 bg-green-50 p-1 px-2 rounded mt-2">
            <span>Paid ({patientData.payMethod}):</span>
            <span>-${amtPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-black border-t border-black pt-2 mt-2">
            <span>Balance:</span>
            <span>${balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">Thank you for choosing Pal Optical!</p>
          <button 
            onClick={() => window.print()}
            className="mt-6 px-8 py-3 bg-black text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all print:hidden">
            Print Itemized Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
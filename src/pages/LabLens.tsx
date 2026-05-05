import { useState, useCallback } from "react";
import BackButton from "../components/BackButton";

const SPH_MAX = 4.0,
  SPH_MIN = -8.0,
  CYL_MAX = 0.0,
  CYL_MIN = -4.0,
  STEP = 0.25;

const range = (from: number, to: number, step: number) => {
  const arr: number[] = [];
  for (
    let v = from;
    step > 0 ? v <= to : v >= to;
    v = Math.round((v + step) * 100) / 100
  )
    arr.push(v);
  return arr;
};

const fmt = (n: number) =>
  n === 0 ? "PL" : n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
const key = (s: number, c: number) => `${fmt(s)} ${fmt(c)}`;

const sphs = range(SPH_MAX, SPH_MIN, -STEP);
const cyls = range(CYL_MAX, CYL_MIN, -STEP);

type Sheets = { poly: Record<string, number>; plastic: Record<string, number> };

export default function LabLens() {
  const [dark, setDark] = useState(true);
  const [material, setMaterial] = useState<"poly" | "plastic">("poly");
  const [sheets, setSheets] = useState<Sheets>({ poly: {}, plastic: {} });
  const [input, setInput] = useState("");

  const inc = useCallback(
    (k: string) =>
      setSheets((s) => ({
        ...s,
        [material]: { ...s[material], [k]: (s[material][k] || 0) + 1 },
      })),
    [material],
  );
  const dec = useCallback(
    (k: string) =>
      setSheets((s) => {
        const cur = (s[material][k] || 0) - 1;
        const next = { ...s[material] };
        if (cur <= 0) delete next[k];
        else next[k] = cur;
        return { ...s, [material]: next };
      }),
    [material],
  );

  const total = Object.values(sheets[material]).reduce((a, b) => a + b, 0);

  const handleInput = (val: string) => {
    const parts = val.match(/([+-]?\d*\.?\d+|PL|SPH)/gi);
    if (!parts) return;
    const clean = (v: string) => {
      if (/PL|SPH/i.test(v)) return 0;
      const n = parseFloat(v);
      return Math.abs(n) >= 10 ? n / 100 : n;
    };
    const round25 = (n: number) => Math.round(n * 4) / 4;
    const s = round25(clean(parts[0])),
      c = round25(clean(parts[1] || "SPH"));
    if (s > SPH_MAX || s < SPH_MIN || c > CYL_MAX || c < CYL_MIN) {
      alert(`Out of bounds: ${fmt(s)} ${fmt(c)}`);
      return;
    }
    inc(key(s, c));
  };

  const exportCSV = () => {
    const data = sheets[material];
    if (!Object.keys(data).length) {
      alert("Sheet is empty.");
      return;
    }
    let csv = "Material,Sphere,Cylinder,Quantity\n";
    Object.entries(data).forEach(([k, count]) => {
      const [s, c] = k.split(" ");
      csv += `${material.toUpperCase()},${s},${c},${count}\n`;
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `pal_${material}_tally.csv`;
    a.click();
  };

  const bg = dark ? "bg-black text-white" : "bg-white text-black";
  const cardBg = dark
    ? "bg-gray-900 border-gray-700"
    : "bg-white border-gray-300";
  const cellHas = dark ? "bg-white text-black" : "bg-black text-white";

  return (
    <div className={`min-h-screen ${bg} p-4 transition-colors`}>
      <BackButton />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center border-b-2 border-current pb-3 mb-4 mt-10">
          <h1 className="text-xl font-black uppercase tracking-wide">
            Pal Optical // Tally System
          </h1>
          <div className="flex gap-2 items-center">
            <select
              className={`px-3 py-2 border rounded font-bold text-sm ${cardBg}`}
              value={material}
              onChange={(e) =>
                setMaterial(e.target.value as "poly" | "plastic")
              }
            >
              <option value="poly">POLYCARBONATE</option>
              <option value="plastic">PLASTIC (CR-39)</option>
            </select>
            <div
              className={`px-4 py-2 border rounded text-center text-sm ${cardBg}`}
            >
              <div className="text-xs opacity-60">Total</div>
              <div className="text-xl font-bold">{total}</div>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className="px-3 py-2 border rounded text-xs uppercase font-bold border-current"
            >
              🌗 Theme
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-3 flex-wrap">
          <button
            onClick={() => {
              if (confirm(`Clear ${material.toUpperCase()}?`))
                setSheets((s) => ({ ...s, [material]: {} }));
            }}
            className="px-4 py-2 border border-current rounded text-xs uppercase font-bold"
          >
            Clear Sheet
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-current rounded text-xs uppercase font-bold"
          >
            Print
          </button>
          <button
            onClick={exportCSV}
            className={`px-4 py-2 rounded text-xs uppercase font-bold ${dark ? "bg-white text-black" : "bg-black text-white"}`}
          >
            Export CSV
          </button>
        </div>

        <input
          className={`w-full px-4 py-3 border rounded mb-4 font-mono text-base ${cardBg}`}
          placeholder="Type lens (e.g. -200 -125 or PL SPH) and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleInput(input.trim());
              setInput("");
            }
          }}
          autoFocus
        />

        <div className={`overflow-auto border rounded ${cardBg}`}>
          <table
            className="border-collapse text-xs font-mono"
            style={{ minWidth: 800 }}
          >
            <thead>
              <tr>
                <th
                  className={`border px-2 py-2 sticky left-0 ${dark ? "bg-gray-800" : "bg-gray-200"}`}
                >
                  Sph \ Cyl
                </th>
                {cyls.map((c) => (
                  <th
                    key={c}
                    className={`border px-2 py-2 ${dark ? "bg-gray-800" : "bg-gray-200"}`}
                  >
                    {fmt(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sphs.map((s) => (
                <tr key={s}>
                  <th
                    className={`border px-2 py-2 sticky left-0 font-bold ${dark ? "bg-gray-800" : "bg-gray-200"}`}
                  >
                    {fmt(s)}
                  </th>
                  {cyls.map((c) => {
                    const k = key(s, c);
                    const count = sheets[material][k] || 0;
                    return (
                      <td
                        key={c}
                        className={`border text-center cursor-pointer select-none h-10 w-12 transition-colors ${count > 0 ? cellHas : "hover:opacity-60"}`}
                        onClick={() => inc(k)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          dec(k);
                        }}
                      >
                        <span className="font-bold text-sm">
                          {count > 0 ? count : "-"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs opacity-40 mt-4">
          Left-click = +1 | Right-click = -1 | jamesbrentlinger2026™
        </p>
      </div>
    </div>
  );
}

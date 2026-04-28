import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X,
  Check,
  Bell
} from 'lucide-react';
import { LENSES } from './data';
import { Lens, LensType } from './types';

const CATEGORIES: (LensType | 'All')[] = ['All', 'Daily', 'Two-Week', 'Monthly', 'RGP'];
const SORT_OPTIONS = [
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Hide splash after 2.5 seconds as requested
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [activeCategory, setActiveCategory] = useState<(LensType | 'All')>('All');
  const [selectedLens, setSelectedLens] = useState<Lens | null>(null);
  const [sortBy, setSortBy] = useState('alphabetical');
  const [checkedLensIds, setCheckedLensIds] = useState<Set<string>>(new Set());
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(checkedLensIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCheckedLensIds(newSet);
  };

  const sendNotification = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 5000);
  };

  const filteredLenses = useMemo(() => {
    let result = LENSES.filter(lens => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        lens.name.toLowerCase().includes(query) ||
        lens.brand.toLowerCase().includes(query) ||
        lens.manufacturer.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || lens.type === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        const brandCompare = a.brand.localeCompare(b.brand);
        if (brandCompare !== 0) return brandCompare;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      return 0;
    });

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans selection:bg-white/20">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] bg-[#090909] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-80 h-80"
            >
              <img 
                src="/optiview.gif" 
                alt="OptiView Startup" 
                className="w-full h-full object-contain"
                onLoad={() => {
                  // We could potentially use the onLoad to start the timer, 
                  // but for GIFs we usually just rely on a fixed delay.
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/40 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 border-b border-white/10 sticky top-0 z-40 bg-[#090909]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img 
            src="/android-chrome-512x512.png" 
            alt="Logo" 
            className="w-10 h-10 rounded-lg object-cover shadow-lg shadow-white/5"
          />
          <span className="text-lg font-semibold tracking-tight">OPTI<span className="text-white italic">VIEW</span></span>
        </div>
        <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-white/50">
          <a href="#" className="text-white border-b border-white pb-1 italic">Inventory</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mr-2">Stock:</span>
            <span className="text-sm font-mono font-bold text-white">77</span>
          </div>

          {checkedLensIds.size > 0 && (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={sendNotification}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg flex items-center gap-2 shadow-lg shadow-white/10 transition-all border border-white"
            >
              <Bell size={14} className="text-black" />
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Notify Registry ({checkedLensIds.size})</span>
            </motion.button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* Toast Notification */}
        <AnimatePresence>
          {showNotificationToast && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 20, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 border border-white/20 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4 min-w-[320px]"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shrink-0">
                <Check size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white leading-none">Registration Dispatched</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Notification sent for {checkedLensIds.size} registry items</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub-Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-light tracking-tight">Lens Catalogue</h1>
            <p className="text-white/40 text-sm font-light uppercase tracking-widest leading-loose">Premium Custom & Specialty Optics</p>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 w-full md:w-auto">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="relative group flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder="Search brand or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/50 transition-all placeholder:text-white/20 text-white"
                />
              </div>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/60 focus:outline-none focus:border-blue-500 transition-colors"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-[#111111]">{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto scrollbar-hide w-full">
              <button
                onClick={() => {
                  const allVisibleIds = filteredLenses.map(l => l.id);
                  const allChecked = allVisibleIds.length > 0 && allVisibleIds.every(id => checkedLensIds.has(id));
                  const newSet = new Set(checkedLensIds);
                  if (allChecked) {
                    allVisibleIds.forEach(id => newSet.delete(id));
                  } else {
                    allVisibleIds.forEach(id => newSet.add(id));
                  }
                  setCheckedLensIds(newSet);
                }}
                className={`px-4 py-1.5 rounded-md text-[10px] whitespace-nowrap font-bold uppercase tracking-wider transition-all border border-white/20 ${
                  filteredLenses.length > 0 && filteredLenses.every(l => checkedLensIds.has(l.id))
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {filteredLenses.length > 0 && filteredLenses.every(l => checkedLensIds.has(l.id)) ? 'Deselect All' : 'Select All Filters'}
              </button>
              <div className="w-px bg-white/10 mx-1 self-stretch" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-md text-[10px] whitespace-nowrap font-bold uppercase tracking-wider transition-all flex-1 text-center ${
                    activeCategory === cat 
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'text-white/40 hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'All Tiers' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredLenses.map((lens, index) => (
              <motion.div
                layout
                key={lens.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedLens(lens)}
                className={`group relative bg-[#111111] border rounded-2xl flex flex-col h-[300px] hover:bg-[#161616] transition-all cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-white/5 ${checkedLensIds.has(lens.id) ? 'border-white/50 ring-1 ring-white/20' : 'border-white/5'}`}
              >
                {/* Full Card Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={lens.imageUrl} 
                    alt={lens.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${checkedLensIds.has(lens.id) ? 'opacity-100 scale-105' : 'opacity-80 group-hover:opacity-100 group-hover:scale-110'}`}
                  />
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-black/50 group-hover:bg-black/0 transition-colors duration-500 ${checkedLensIds.has(lens.id) ? 'bg-black/20' : ''}`} />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${checkedLensIds.has(lens.id) ? 'from-white/10 via-[#090909]/70 to-transparent' : 'from-[#090909]/80 via-transparent to-transparent'}`} />
                </div>

                <div className="relative z-10 p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-widest font-black bg-white px-2 py-0.5 rounded text-black shadow-lg">
                        {lens.type}
                      </span>
                    </div>
                    
                    {/* Checkbox Trigger */}
                    <button 
                      onClick={(e) => toggleCheck(lens.id, e)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${checkedLensIds.has(lens.id) ? 'bg-white border-white shadow-lg shadow-white/20' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                    >
                      {checkedLensIds.has(lens.id) ? <Check size={16} className="text-black" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                    </button>
                  </div>

                  <div className="flex-1 mt-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white font-black [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                      {lens.manufacturer}
                    </span>
                    <h3 className="text-xl font-bold mt-1 leading-tight text-white group-hover:text-white transition-colors tracking-tight [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                      {lens.brand} 
                      <span className="block text-white text-lg leading-snug">{lens.name}</span>
                    </h3>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] uppercase tracking-widest text-white/20 font-extrabold">Registry Price</p>
                      <p className="text-lg font-mono text-white/70">${lens.price?.toFixed(2)}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded bg-white/5 text-[9px] text-white/40 border border-white/10 uppercase tracking-widest font-bold group-hover:border-white/40 group-hover:text-white transition-all">
                      Analyze
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredLenses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-4 border border-white/10">
              <Search size={20} />
            </div>
            <h3 className="text-lg font-light tracking-tight text-white/80">No matches in register</h3>
            <p className="text-white/30 text-xs uppercase tracking-widest mt-2">Adjust search parameters</p>
          </motion.div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLens && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLens(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl z-[60] overflow-hidden"
            >
              <div className="p-8 md:p-12 relative">
                <button 
                  onClick={() => setSelectedLens(null)}
                  className="absolute top-6 right-6 p-2 h-10 w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
                >
                  <X size={20} className="text-white/60" />
                </button>

                <div className="flex flex-col md:flex-row gap-12">
                  <div className="w-full md:w-2/5 h-80 md:h-[450px] rounded-3xl overflow-hidden bg-black/40 border border-white/10 relative group shadow-2xl flex items-center justify-center p-4">
                    <img 
                      src={selectedLens.imageUrl} 
                      alt={selectedLens.name}
                      className="w-full h-full object-contain transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-white/60 font-black mb-1">Visual Box Profile</p>
                      <p className="text-[10px] text-white font-mono uppercase italic tracking-widest [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">BX_ART_SIG_{selectedLens.manufacturer.substring(0, 3).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">
                          {selectedLens.type}
                        </span>
                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                          {selectedLens.manufacturer}
                        </span>
                      </div>

                      <h2 className="text-4xl font-bold tracking-tight mb-4 text-white [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]">
                        {selectedLens.brand} <span className="text-white">{selectedLens.name}</span>
                      </h2>
                      
                      <p className="text-white/50 text-lg font-light leading-relaxed">
                        {selectedLens.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">Specifications</h4>
                        <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                          {[
                            { label: 'Material', value: selectedLens.specs?.material },
                            { label: 'Water', value: selectedLens.specs?.waterContent },
                            { label: 'Diameter', value: selectedLens.specs?.diameter },
                            { label: 'Base Curve', value: selectedLens.specs?.baseCurve }
                          ].map(spec => (
                            <div key={spec.label} className="flex justify-between items-center text-[11px]">
                              <span className="text-white/40 uppercase tracking-widest">{spec.label}</span>
                              <span className="text-white font-mono">{spec.value || 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedLens.features.map(feat => (
                            <span key={feat} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[11px] font-medium text-white/60 uppercase tracking-tighter">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-1">Estimated Unit Price</p>
                        <p className="text-2xl font-mono text-white/70">${selectedLens.price?.toFixed(2)}</p>
                      </div>
                      <button className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-white/5">
                        Registry Notification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Interface Bar */}
      <footer className="bg-[#0c0c0c] border-t border-white/10 px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-4 mt-20">
        <div className="flex items-center gap-6">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border border-white/10 bg-zinc-800"></div>
            <div className="w-6 h-6 rounded-full border border-white/10 bg-zinc-700"></div>
            <div className="w-6 h-6 rounded-full border border-white/10 bg-zinc-600"></div>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Trusted by 14.2k Active Users</p>
        </div>
        <div className="text-[10px] font-mono text-white/20 flex gap-6 uppercase tracking-tight">
          <span>Session: AIS_NODE_PREVIEW</span>
          <span>&copy; 2026 Optistack Core</span>
        </div>
      </footer>
    </div>
  );
}

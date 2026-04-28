import { Lens } from './types';

// Visual Database Mapping
const getImg = (brand: string, name: string, manufacturer: string) => {
  const brandLower = brand.toLowerCase();
  const nameLower = name.toLowerCase();
  const mnLower = manufacturer.toLowerCase();
  const full = `${brandLower} ${nameLower}`;

  // --- JOHNSON & JOHNSON (ACUVUE) ---
  if (mnLower.includes('johnson')) {
    if (full.includes('abiliti')) {
      return '/acuvue-abiliti-overnight.png';
    }
    if (full.includes('oasys max')) {
      if (full.includes('multifocal')) return '/acuvueoasysmaxmulti.png';
      if (full.includes('toric')) return '/acuvueoasysmaxtoric.jpg';
      return '/acuvueoasysmax.jpg';
    }
    if (full.includes('oasys 1-day')) {
      if (full.includes('toric')) return '/acuvueoasys1dayhydratoric.jpg';
      return '/acuvueoasys1dayhydra.jpg';
    }
    if (full.includes('oasys')) {
      if (full.includes('multifocal')) return '/acuvueoasysmulti.jpg';
      if (full.includes('toric')) return '/acuvueoasystoric.jpg';
      return '/acuvueoasys.jpg';
    }
    if (full.includes('moist')) {
      if (full.includes('multifocal')) return '/acuvue1daymoistmulti.jpg';
      if (full.includes('toric')) return '/acuvue1daymoisttoric.jpg';
      return '/acuvue1daymoist.jpg';
    }
    if (full.includes('vita')) {
      if (full.includes('toric')) return '/acuvuevitatoric.jpg';
      return '/acuvuevita.jpg';
    }
    if (full.includes('acuvue 2')) return '/acuvue2.jpg';
    if (full.includes('define')) return '/acuvue1daydefine.jpg';
  }

  // --- ALCON ---
  if (mnLower.includes('alcon')) {
    if (full.includes('total1')) {
      if (full.includes('multifocal')) return '/dailiestotal1multi.jpg';
      if (full.includes('toric')) return '/dailiestotal1storic.jpg';
      return '/dailiestotal1sph.jpg';
    }
    if (full.includes('total30')) {
      if (full.includes('multifocal')) return '/total30multi.jpg';
      if (full.includes('toric')) return '/total30toric.jpg';
      return '/total30.jpg';
    }
    if (full.includes('precision1')) {
      if (full.includes('toric')) return '/precision1toric.jpg';
      return '/precision1.jpg';
    }
    if (full.includes('precision7')) {
      if (full.includes('toric')) return '/precision7toric.jpg';
      return '/precision7.jpg';
    }
    if (full.includes('hydraglyde')) {
      if (full.includes('multifocal')) return '/airoptixhydramulti.jpg';
      if (full.includes('toric')) return '/airoptixhydratoric.jpg';
      return '/airoptixhydra.jpg';
    }
    if (full.includes('aquacomfort')) {
      if (full.includes('multifocal')) return '/dailiesaquaplusmulti.jpg';
      if (full.includes('toric')) return '/dailiesaquaplustoric.jpg';
      return '/dailiesaquaplus.jpg';
    }
    if (full.includes('colors')) return '/airoptixcolors.jpg';
    if (full.includes('night & day')) return '/airoptixnight.jpg';
    if (full.includes('freshlook')) return '/dailiescolors.jpg';
  }

  // --- COOPERVISION ---
  if (mnLower.includes('cooper')) {
    if (full.includes('biofinity')) {
      if (full.includes('energys')) return '/biofinityenergys.png';
      if (full.includes('xr toric')) return '/biofinityxrtoric.png';
      if (full.includes('xr')) return '/biofinityxr.png';
      if (full.includes('toric multifocal')) return '/biofinitytoricmulti.png';
      if (full.includes('toric')) return '/procleartoric.png';
    }
    if (full.includes('myday')) {
      if (full.includes('multifocal')) return '/mydaymulti.png';
      if (full.includes('toric')) return '/mydaytoric.png';
      return '/myday.png';
    }
    if (full.includes('clariti')) {
      if (full.includes('toric')) return '/clariti1daytoric.jpg';
      if (full.includes('multifocal')) return '/clariti1daymulti.jpg';
      return '/clariti1da.jpg';
    }
    if (full.includes('avaira')) {
      if (full.includes('toric')) return '/avairavitalitytoric.jpg';
      return '/avairavitality.jpg';
    }
    if (full.includes('proclear 1-day')) {
      if (full.includes('multifocal')) return '/proclear1daymulti.png';
      return '/proclear1day.png';
    }
    if (full.includes('proclear')) {
      if (full.includes('multifocal toric')) return '/proclearmultitoric.png';
      if (full.includes('multifocal xr')) return '/proclearmultixrmulti.png';
      if (full.includes('toric')) return '/procleartoric.png';
      if (full.includes('xr toric')) return '/proclearxrtoric.png';
      return '/proclear.png';
    }
    if (full.includes('misight')) return '/misight.png';
  }

  // --- BAUSCH + LOMB ---
  if (mnLower.includes('bausch')) {
    if (full.includes('infuse')) {
      if (full.includes('multifocal')) return '/biofinityinfusemulti.jpg';
      if (full.includes('toric')) return '/biofinityinfusetoric.jpg';
      return '/biofinityinfuse.jpg';
    }
    if (full.includes('ultra one day')) {
      if (full.includes('multifocal')) return '/bandsultra1daymulti.png';
      if (full.includes('toric')) return '/bandsultra1daytoric.png';
    }
    if (full.includes('ultra')) {
      if (full.includes('multifocal') && full.includes('toric')) return '/bandsultramultitoric.png';
      if (full.includes('multifocal')) return '/bandsultramulti.png';
      if (full.includes('toric')) return '/bandsultratoric.png';
      return '/bandsultra.png';
    }
    if (full.includes('biotrue')) return '/biotrue1day.png';
    if (full.includes('soflens')) {
      if (full.includes('daily')) {
        if (full.includes('toric')) return '/bandsultrasoflensdailytoric.png';
        return '/bandsultrasoflensdaily.png';
      }
      if (full.includes('38')) return '/soflens38.png';
      if (full.includes('59')) return '/soflens59.png';
      if (full.includes('multifocal')) return '/soflensmulti.png';
      if (full.includes('toric')) return '/soflenstoric.png';
    }
    if (full.includes('purevision')) {
      if (full.includes('multifocal')) return '/purevision2multi.png';
      if (full.includes('toric')) return '/purevision2toric.png';
      return '/purevision2.png';
    }
  }

  return 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800';
};


export const LENSES: Lens[] = [
  // --- 1. JOHNSON & JOHNSON (ACUVUE) ---
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `acuvue-oasys-2wk-${variant.toLowerCase()}`,
    brand: 'Acuvue',
    name: `Oasys ${variant}`,
    type: 'Two-Week' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'Relief for dry eyes often felt when using digital devices.',
    features: ['Hydraclear Plus', 'UV Blocking', variant],
    popularity: 98,
    price: variant === 'Sphere' ? 90 : variant === 'Toric' ? 60 : 65,
    specs: {
      material: 'Senofilcon A',
      waterContent: '38%',
      diameter: '14.0mm',
      baseCurve: '8.4mm'
    }
  })),
  ...['Sphere', 'Toric'].map(variant => ({
    id: `acuvue-oasys-1day-${variant.toLowerCase()}`,
    brand: 'Acuvue',
    name: `Oasys 1-Day ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'Engineered for your most demanding days.',
    features: ['Hydraluxe', 'UV Blocking', variant],
    popularity: 96,
    price: variant === 'Sphere' ? 110 : 70,
    specs: {
      material: 'Senofilcon A',
      waterContent: '35%',
      diameter: '14.3mm',
      baseCurve: '8.5mm'
    }
  })),
  ...['Sphere', 'Toric', 'Multifocal', 'Multifocal for Astigmatism'].map(variant => ({
    id: `acuvue-oasys-max-1day-${variant.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Acuvue',
    name: `Oasys MAX 1-Day ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'Designed to help with digital eye strain and light sensitivity.',
    features: ['TearStable', 'OptiBlue Light Filter', variant],
    popularity: 97,
    price: variant === 'Sphere' ? 130 : 
           variant === 'Toric' ? 60 : 
           variant === 'Multifocal' ? 155 : 70,
    specs: {
      material: 'Senofilcon A',
      waterContent: '38%',
      diameter: '14.3mm',
      baseCurve: '8.5mm / 9.0mm'
    }
  })),
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `acuvue-moist-1day-${variant.toLowerCase()}`,
    brand: 'Acuvue',
    name: `1-Day Moist ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'The trusted choice for fresh comfort every day.',
    features: ['Lacreon', 'UV Blocking', variant],
    popularity: 94,
    price: variant === 'Sphere' ? 90 : variant === 'Toric' ? 115 : 125,
    specs: {
      material: 'Etafilcon A',
      waterContent: '58%',
      diameter: '14.2mm',
      baseCurve: '8.5mm / 9.0mm'
    }
  })),
  ...['Sphere', 'Toric'].map(variant => ({
    id: `acuvue-vita-${variant.toLowerCase()}`,
    brand: 'Acuvue',
    name: `Vita ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'Consistent comfort all month long.',
    features: ['HydraMax', 'Non-Coated Silicone', variant],
    popularity: 88,
    price: variant === 'Sphere' ? 80 : 75,
    specs: {
      material: 'Senofilcon C',
      waterContent: '41%',
      diameter: '14.0mm',
      baseCurve: '8.4mm / 8.8mm'
    }
  })),
  {
    id: 'acuvue-2-sphere',
    brand: 'Acuvue',
    name: 'Acuvue 2 Sphere',
    type: 'Two-Week',
    manufacturer: 'Johnson & Johnson',
    description: 'The classic blue-choice for reliability.',
    features: ['Infinity Edge', 'Easy Handling'],
    popularity: 75,
    price: 55
  },
  {
    id: 'acuvue-define',
    brand: 'Acuvue',
    name: '1-Day Define',
    type: 'Daily' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'Beauty lenses that enhance your natural eye color with multiple styles.',
    features: ['Lacreon', 'Beauty-Wrapped-In-Comfort', 'Available in 7 Styles'],
    popularity: 82,
    price: 65
  },
  {
    id: 'acuvue-abiliti',
    brand: 'Abiliti',
    name: 'Specialty Collection',
    type: 'RGP' as const,
    manufacturer: 'Johnson & Johnson',
    description: 'Advanced specialized eye care for myopia management and protection. Featuring overnight and therapeutic solutions.',
    features: ['Advanced Ocular Wellness', 'Myopia Management', 'Overnight & Therapeutic'],
    popularity: 65,
    price: 550
  },

  // --- 2. Biofinity & COOPERVISION FAMILY ---
  ...['Sphere', 'Toric', 'Multifocal', 'XR', 'XR Toric', 'Toric Multifocal'].map(variant => ({
    id: `cooper-biofinity-${variant.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Biofinity',
    name: `Biofinity ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'CooperVision',
    description: 'Naturally breathable silicone hydrogel lenses.',
    features: ['Aquaform', 'High Oxygen', variant],
    popularity: 95,
    price: variant === 'Sphere' || variant === 'XR' ? 65 : 
           variant === 'Toric' ? 75 : 
           variant === 'Multifocal' ? 100 : 140,
    specs: {
      material: 'Comfilcon A',
      waterContent: '48%',
      diameter: '14.0mm',
      baseCurve: '8.6mm'
    }
  })),
  {
    id: 'cooper-biofinity-energys',
    brand: 'Biofinity',
    name: 'Energys Sphere',
    type: 'Monthly',
    manufacturer: 'CooperVision',
    description: 'Lens design specifically for digital life.',
    features: ['Digital Zone Optics', 'Aquaform'],
    popularity: 91,
    price: 70
  },
  ...['Sphere', 'Toric', 'Multifocal', 'Energys'].map(variant => ({
    id: `cooper-myday-${variant.toLowerCase()}`,
    brand: 'MyDay',
    name: `MyDay ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'CooperVision',
    description: 'Uncompromised comfort and health.',
    features: ['Smart Silicone', 'Daily Ease', variant],
    popularity: 90,
    price: variant === 'Sphere' ? 155 : 
           variant === 'Toric' ? 130 : 
           variant === 'Multifocal' ? 130 : 110
  })),
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `cooper-clariti-1day-${variant.toLowerCase()}`,
    brand: 'Clariti',
    name: `Clariti 1-Day ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'CooperVision',
    description: 'Breathable, healthy, and high-performing daily lenses.',
    features: ['WetLoc', 'Silicone Hydrogel', variant],
    popularity: 87,
    price: variant === 'Sphere' ? 80 : 
           variant === 'Toric' ? 100 : 105
  })),
  ...['Sphere', 'Toric'].map(variant => ({
    id: `cooper-avaira-vitality-${variant.toLowerCase()}`,
    brand: 'Avaira Vitality',
    name: `Avaira Vitality ${variant}`,
    type: 'Two-Week' as const,
    manufacturer: 'CooperVision',
    description: 'High performing 2-week lens with Class 1 UV protection.',
    features: ['Class 1 UV Protection', 'Third Gen Silicone Hydrogel', variant],
    popularity: 84,
    price: variant === 'Sphere' ? 55 : 60
  })),
  ...['Sphere', 'Toric', 'Multifocal', 'Multifocal Toric', 'XR'].map(variant => ({
    id: `cooper-proclear-${variant.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Proclear',
    name: `Proclear ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'CooperVision',
    description: 'Natural solution for eye dryness.',
    features: ['PC Technology', 'Biocompatible', variant],
    popularity: 80,
    price: variant === 'Sphere' || variant === 'XR' ? 80 : 
           variant === 'Toric' ? 105 : 
           variant === 'Multifocal' ? 100 : 180
  })),
  ...['Sphere', 'Multifocal'].map(variant => ({
    id: `cooper-proclear-1day-${variant.toLowerCase()}`,
    brand: 'Proclear',
    name: `Proclear 1-Day ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'CooperVision',
    description: 'Naturally attracts water for comfort.',
    features: ['PC Technology', 'Biocompatible', variant],
    popularity: 81,
    price: variant === 'Sphere' ? 95 : 115
  })),
  {
    id: 'cooper-misight-1day',
    brand: 'MiSight',
    name: '1-Day Myopia Control',
    type: 'Daily',
    manufacturer: 'CooperVision',
    description: 'Specially designed for children with myopia.',
    features: ['Myopia Management', 'ActiveSontrol'],
    popularity: 85,
    price: 130
  },
  ...['55 Evolution', 'Toric', 'Now'].map(sub => ({
    id: `cooper-biomedics-${sub.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Biomedics',
    name: `Biomedics ${sub}`,
    type: sub === 'Now' ? 'Daily' : 'Monthly' as any,
    manufacturer: 'CooperVision',
    description: 'The proven choice for value and comfort.',
    features: ['Value Driven', 'Sharp Vision', sub],
    popularity: 78,
    price: sub === '55 Evolution' ? 70 : 
           sub === 'Toric' ? 75 : 62
  })),

  // --- 3. ALCON FAMILY ---
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `alcon-total1-${variant.toLowerCase()}`,
    brand: 'Dailies',
    name: `Total1 ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Alcon',
    description: 'The first and only water gradient contact lens.',
    features: ['Water Gradient', 'SmarTears', variant],
    popularity: 99,
    price: variant === 'Sphere' ? 115 : 
           variant === 'Toric' ? 130 : 140,
    specs: {
      material: 'Delefilcon A',
      waterContent: '33% core / >80% surface',
      diameter: '14.1mm',
      baseCurve: '8.5mm'
    }
  })),
  ...['Sphere', 'Toric', 'Multifocal', 'Multifocal for Astigmatism'].map(variant => ({
    id: `alcon-total30-${variant.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Total30',
    name: `Total30 ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'Alcon',
    description: 'Comfort that feels like nothing at day 30.',
    features: ['Celligent Technology', 'Biomimetic', variant],
    popularity: 96,
    price: variant.includes('Multifocal') ? 100 : 
           variant === 'Toric' ? 75 : 65,
    specs: {
      material: 'Lehfilcon A',
      waterContent: '55% core / >90% surface',
      diameter: '14.2mm',
      baseCurve: '8.4mm'
    }
  })),
  ...['Sphere', 'Toric'].map(variant => ({
    id: `alcon-precision1-${variant.toLowerCase()}`,
    brand: 'Precision1',
    name: `Daily ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Alcon',
    description: 'Designed for first-time wearers to address common vision needs.',
    features: ['SmartSurface', 'UV Filter', variant],
    popularity: 93,
    price: variant === 'Sphere' ? 80 : 100,
    specs: {
      material: 'Verofilcon A',
      waterContent: '51% core / >80% surface',
      diameter: '14.2mm',
      baseCurve: '8.3mm / 8.7mm'
    }
  })),
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `alcon-optix-hydraglyde-${variant.toLowerCase()}`,
    brand: 'Air Optix',
    name: `Plus HydraGlyde ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'Alcon',
    description: 'Breathable monthly lens with moisture retention.',
    features: ['HydraGlyde', 'SmartShield', variant],
    popularity: 90,
    price: variant === 'Sphere' ? 65 : 
           variant === 'Toric' ? 75 : 110
  })),
  {
    id: 'alcon-optix-colors',
    brand: 'Air Optix',
    name: 'Colors',
    type: 'Monthly' as const,
    manufacturer: 'Alcon',
    description: 'Naturally beautiful eye color enhancement in various shades.',
    features: ['3-in-1 Color Tech', 'Breathable', 'Available in 9+ Colors'],
    popularity: 85,
    price: 115
  },
  {
    id: 'alcon-optix-nightday',
    brand: 'Air Optix',
    name: 'Night & Day Aqua',
    type: 'Monthly',
    manufacturer: 'Alcon',
    description: 'Certified for 30 nights of continuous wear.',
    features: ['High Oxygen', 'Aspheric Optics'],
    popularity: 89,
    price: 100
  },
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `alcon-dacp-${variant.toLowerCase()}`,
    brand: 'Dailies',
    name: `AquaComfort Plus ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Alcon',
    description: 'Triple Action Moisture for comfort all day.',
    features: ['Blink-Activated', 'Moisture-Rich', variant],
    popularity: 91,
    price: variant === 'Sphere' ? 80 : 
           variant === 'Toric' ? 100 : 115
  })),
  ...['Sphere', 'Toric'].map(variant => ({
    id: `alcon-precision7-${variant.toLowerCase()}`,
    brand: 'Precision7',
    name: `One-Week ${variant}`,
    type: 'Two-Week' as const, // Grouping 7-day under Two-Week as closest category
    manufacturer: 'Alcon',
    description: 'The newest addition for 2026, premium weekly replacement.',
    features: ['7-Day Freshness', 'Advanced Surface', variant],
    popularity: 94,
    price: variant === 'Sphere' ? 80 : 100
  })),
  {
    id: 'alcon-freshlook-colors',
    brand: 'FreshLook',
    name: 'Color Collections',
    type: 'Monthly' as const,
    manufacturer: 'Alcon',
    description: 'Enhance or transform your eye color with several professional series.',
    features: ['Colorblends', 'Dimensions', 'One-Day Options'],
    popularity: 80,
    price: 85
  },

  // --- 4. BAUSCH + LOMB FAMILY ---
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `bl-infuse-${variant.toLowerCase()}`,
    brand: 'Infuse',
    name: `Daily ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Bausch + Lomb',
    description: 'Next-generation lens solution for ocular surface stability. Featuring bio-affinity infused ingredients and biodegradable components.',
    features: ['ProBalance', 'Breathable Silicone', 'Bio-affinity Infused', variant],
    popularity: 92,
    price: variant === 'Sphere' ? 105 : 
           variant === 'Toric' ? 120 : 130,
    specs: {
      material: 'Kalifilcon A',
      waterContent: '55%',
      diameter: '14.2mm',
      baseCurve: '8.6mm'
    }
  })),
  ...['Sphere', 'Toric', 'Multifocal', 'Multifocal for Astigmatism'].map(variant => ({
    id: `bl-ultra-monthly-${variant.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Ultra',
    name: `Monthly ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'Bausch + Lomb',
    description: 'Excellent vision for digital device users.',
    features: ['MoistureSeal', 'Comfort-Edge', variant],
    popularity: 89,
    price: variant === 'Sphere' ? 65 : 
           variant === 'Toric' ? 75 : 90
  })),
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `bl-ultra-one-day-${variant.toLowerCase()}`,
    brand: 'Ultra',
    name: `ONE Day ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Bausch + Lomb',
    description: 'Ultimate daily comfort with high moisture retention.',
    features: ['Advanced MoistureSeal', 'Daily Freshness', variant],
    popularity: 95,
    price: 155
  })),
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `bl-biotrue-${variant.toLowerCase()}`,
    brand: 'Biotrue',
    name: `ONEday ${variant}`,
    type: 'Daily' as const,
    manufacturer: 'Bausch + Lomb',
    description: 'Inspired by the biology of your eyes.',
    features: ['HyperGel', '78% Water Content', variant],
    popularity: 88,
    price: variant === 'Sphere' ? 75 : 
           variant === 'Toric' ? 95 : 105
  })),
  ...['38', 'Daily', 'Toric', 'Multifocal'].map(style => ({
    id: `bl-soflens-${style.toLowerCase()}`,
    brand: 'SofLens',
    name: `${style}`,
    type: style === 'Daily' ? 'Daily' : style === 'Toric' ? 'Two-Week' : 'Monthly' as any,
    manufacturer: 'Bausch + Lomb',
    description: 'The legacy line providing consistent performance.',
    features: ['Tried and True', 'Comfort Design', style],
    popularity: 70,
    price: style === '38' ? 55 : 
           style === 'Daily' ? 85 : 
           style === 'Toric' ? 70 : 95
  })),
  ...['Sphere', 'Toric', 'Multifocal'].map(variant => ({
    id: `bl-purevision-2-${variant.toLowerCase()}`,
    brand: 'PureVision 2',
    name: `${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'Bausch + Lomb',
    description: 'High definition optics for crisp vision.',
    features: ['HD Optics', 'AerGel Design', variant],
    popularity: 82,
    price: variant === 'Sphere' || variant === 'Toric' ? 95 : 105
  })),
  ...['Sphere', 'Toric', 'Multifocal', 'Multifocal Toric'].map(variant => ({
    id: `bl-revive-${variant.toLowerCase().replace(/ /g, '-')}`,
    brand: 'Revive',
    name: `Custom Soft ${variant}`,
    type: 'Monthly' as const,
    manufacturer: 'Bausch + Lomb',
    description: 'Custom-made soft contact lenses for precise fit.',
    features: ['Custom Fit', 'Specialized Geometry', variant],
    popularity: 68,
    price: variant.includes('Toric') ? 160 : 100
  })),
  {
    id: 'bl-silsoft',
    brand: 'SilSoft',
    name: 'Aphakic Specialty',
    type: 'RGP',
    manufacturer: 'Bausch + Lomb',
    description: 'High oxygen specialty lens for post-cataract or surgery.',
    features: ['Aphakic Support', 'High Oxygen Penetration'],
    popularity: 60,
    price: 220
  }
].map((l: any) => ({ 
  ...l, 
  imageUrl: getImg(l.brand, l.name, l.manufacturer),
   specs: l.specs || {
    material: l.type === 'RGP' ? 'Sili-Fluoro Carbon' : 'Silicone Hydrogel',
    waterContent: l.type === 'Daily' ? '54%' : '38%',
    diameter: '14.2mm',
    baseCurve: '8.6mm'
  }
}));

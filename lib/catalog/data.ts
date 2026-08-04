export const baseProducts = [
  ["almendras", "Almendras", "250 g"], ["nueces", "Nueces", "250 g"], ["mani-tostado", "Maní tostado", "250 g"], ["chia", "Chía", "250 g"], ["lino", "Lino", "250 g"], ["sesamo", "Sésamo", "250 g"], ["avena", "Avena", "1 kg"], ["granola", "Granola", "500 g"], ["miel", "Miel", "500 g"], ["pasas", "Pasas de uva", "250 g"], ["mix-premium", "Mix Premium", "300 g"], ["mix-energia", "Mix Energía", "300 g"], ["harina-almendra", "Harina de Almendra", "500 g"], ["harina-coco", "Harina de Coco", "500 g"], ["mantequilla-mani", "Mantequilla de Maní", "350 g"],
] as const;

type Combo = { name: string; group: string; purpose: string; items: string[]; featured?: boolean; discount: number };
export const combos: Combo[] = [
  { name: "Desayuno Clásico", group: "Desayuno", purpose: "Para empezar el día sin pensar demasiado.", items: ["Avena 1 kg", "Granola 500 g", "Miel 500 g"], featured: true, discount: 8 },
  { name: "Desayuno Premium", group: "Desayuno", purpose: "Para yogur, licuados y desayunos completos.", items: ["Granola", "Miel", "Chía", "Almendras"], discount: 10 },
  { name: "Desayuno Familiar", group: "Desayuno", purpose: "Rinde más para la rutina de toda la casa.", items: ["Avena 2 kg", "Granola 1 kg", "Miel 1 kg"], discount: 10 },
  { name: "Desayuno Kids", group: "Desayuno", purpose: "Una opción simple para meriendas y desayunos.", items: ["Granola", "Miel", "Pasas", "Maní"], discount: 7 },
  { name: "Fitness Starter", group: "Fitness", purpose: "Energía real para acompañar tu entrenamiento.", items: ["Avena", "Maní", "Almendras"], discount: 7 },
  { name: "Fitness Premium", group: "Fitness", purpose: "Base completa para una rutina activa.", items: ["Almendras", "Nueces", "Chía", "Granola"], featured: true, discount: 10 },
  { name: "Recuperación", group: "Fitness", purpose: "Para recargar después de moverte.", items: ["Avena", "Mantequilla de Maní", "Mix Energía"], discount: 8 },
  { name: "Energía Diaria", group: "Energía", purpose: "Una pausa práctica para trabajar o estudiar.", items: ["Mix Energía", "Pasas", "Maní"], featured: true, discount: 8 },
  { name: "Energía Premium", group: "Energía", purpose: "Variedad para tener energía a mano.", items: ["Almendras", "Nueces", "Mix Premium"], discount: 10 },
  { name: "Energía para Oficina", group: "Energía", purpose: "Próximamente, con té y chocolate.", items: ["Mix Premium"], discount: 0 },
  { name: "Bienestar Diario", group: "Bienestar", purpose: "Ingredientes simples para todos los días.", items: ["Chía", "Lino", "Granola", "Miel"], featured: true, discount: 8 },
  { name: "Rutina Liviana", group: "Bienestar", purpose: "Una selección rica en fibra, sin promesas médicas.", items: ["Lino", "Chía", "Avena"], discount: 7 },
  { name: "Corazón", group: "Bienestar", purpose: "Con grasas saludables de origen natural.", items: ["Nueces", "Almendras", "Lino"], discount: 8 },
  { name: "Keto Básico", group: "Keto", purpose: "Una base simple para preparaciones keto.", items: ["Harina de Almendra", "Harina de Coco"], discount: 7 },
  { name: "Keto Premium", group: "Keto", purpose: "Harinas y frutos secos para variar tus recetas.", items: ["Harina de Almendra", "Harina de Coco", "Almendras", "Nueces"], featured: true, discount: 10 },
  { name: "Vegano Inicial", group: "Vegano", purpose: "Una selección vegetal fácil de incorporar.", items: ["Chía", "Lino", "Avena", "Granola"], discount: 7 },
  { name: "Vegano Premium", group: "Vegano", purpose: "Más variedad para tu despensa vegetal.", items: ["Almendras", "Granola", "Chía", "Pasas"], discount: 8 },
  { name: "Snack Familiar", group: "Familia", purpose: "Para compartir durante la semana.", items: ["Maní", "Pasas", "Granola"], discount: 7 },
  { name: "Familiar Premium", group: "Familia", purpose: "Volumen y variedad para toda la casa.", items: ["Almendras", "Nueces", "Granola", "Avena"], featured: true, discount: 10 },
  { name: "Box Natural", group: "Regalos", purpose: "Un detalle rico, simple y cuidado.", items: ["Almendras", "Miel", "Granola"], discount: 7 },
  { name: "Box Premium", group: "Regalos", purpose: "Una caja para regalar bienestar.", items: ["Almendras", "Nueces", "Mix Premium", "Miel"], discount: 10 },
  { name: "Box Empresarial", group: "Regalos", purpose: "Para agradecer a un equipo o cliente.", items: ["Mix Premium", "Granola", "Miel"], discount: 8 },
];

export const subscriptionPlans = [
  ["Esencial", "Para empezar", ["Granola 500 g", "Avena 1 kg", "Chía 250 g"], "5% OFF permanente"], ["Desayuno", "Tu mañana resuelta", ["Granola", "Avena", "Miel", "Pasas"], "Entrega mensual"], ["Fitness", "Para tu rutina activa", ["Almendras", "Maní", "Avena", "Mix Energía"], "Prioridad de stock"], ["Bienestar", "Ingredientes para todos los días", ["Chía", "Lino", "Granola", "Miel"], "Pausá cuando quieras"], ["Corazón", "Grasas saludables naturales", ["Nueces", "Almendras", "Lino"], "Entrega programada"], ["Familiar", "Reposición mensual", ["Avena", "Granola", "Maní", "Miel"], "Mejor relación cantidad/precio"], ["Keto", "Para recetas keto", ["Harina de Almendra", "Harina de Coco", "Almendras"], "Selección mensual"], ["Vegano", "Base vegetal", ["Chía", "Lino", "Granola", "Pasas"], "Cancelación sin costo"], ["Oficina", "Snacks para el equipo", ["Mix Premium", "Mix Energía", "Maní", "Almendras"], "Entrega mensual"], ["Universitario", "Para estudiar con energía", ["Mix Energía", "Pasas", "Maní", "Granola"], "Entrega programada"], ["Personalizado", "Armá tu propia caja", ["Elegí 6, 8 o 10 productos"], "Beneficios exclusivos"],
] as const;

export const seasonalPacks = ["Invierno", "Verano", "Rutina Liviana", "Pausa Bienestar", "Vuelta al Trabajo", "Vuelta al Cole", "Día de la Madre", "Día del Padre", "Navidad", "Año Nuevo", "Picnic", "Running", "Trekking", "Senderismo", "Camping"];

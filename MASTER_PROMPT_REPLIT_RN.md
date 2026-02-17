# MASTER PROMPT — Migrar Sencillo Web a App Mobile (React Native + NativeWind)

Quiero que actúes como **arquitecto + implementador senior de React Native** y construyas una app mobile productiva basada en mi webapp **Sencillo**.

## Objetivo principal (no negociable)
- Migrar la app a React Native (Expo) usando `StyleSheet` + `NativeWind`.
- **Preservar 100% la lógica financiera actual** (cálculos, conversiones, acumulados, filtros, reportes y presupuesto).
- Mejorar estructura de código, mantenibilidad y experiencia mobile, sin alterar resultados numéricos.

## Stack y lineamientos técnicos
- Framework: **Expo + React Native + TypeScript**.
- UI: `NativeWind` para utilidades visuales + `StyleSheet` para tokens/estilos reutilizables.
- Navegación: `@react-navigation/native` con tabs + stacks.
- Estado:
  - Server/data sync: Firebase Auth + Firestore.
  - Estado local: Zustand o Context + reducers (elige una opción y justifícala).
- Fechas: dayjs/luxon para evitar bugs de zona horaria.
- Validación: zod.
- Formularios: react-hook-form.
- Testing:
  - Unit tests para lógica financiera pura.
  - Integration tests para flujos críticos.
- Calidad: ESLint + Prettier + TypeScript strict.

## Regla de oro sobre lógica financiera
Debes extraer la lógica financiera a funciones puras (`src/domain/finance/*`) y **probar paridad** contra reglas actuales:

### Segmentos y tipos
- `ingresos` => `income`
- `ahorro` => `expense`
- `gastos_fijos` => `expense`
- `gastos_variables` => `expense`

### Categorías P&L por defecto
```ts
const DEFAULT_PNL = {
  ingresos: ["Sueldo", "Honorarios", "Ventas"],
  gastos_fijos: ["Alquiler", "Internet", "Condominio", "Colegio", "Suscripciones"],
  gastos_variables: ["Mercado", "Salidas", "Salud", "Transporte", "Gustos"],
  ahorro: ["Ahorro General"]
}
```

### Monedas y conversión a USD de reporte
- Si moneda es USD: `amountUSD = amount`
- Si moneda es VES: `amountUSD = amount / tasaSeleccionada`
  - tasa seleccionada: BCV, paralelo (USDC) o manual.
- Si moneda es EUR:
  - `amountInBs = amount * tasaEURenBs` (manual o BCV-EUR)
  - `amountUSD = amountInBs / tasaBCV`

### Fuentes de tasas
Implementa fetch resiliente y fallback:
1. `https://ve.dolarapi.com/v1/cotizaciones`
2. `https://ve.dolarapi.com/v1/dolares/paralelo`
3. `https://open.er-api.com/v6/latest/USD`

Campos esperados de tasas:
```ts
type Rates = { bcv: number; parallel: number; eur: number; eurCross: number }
```

### Reglas de transacciones
Cada transacción debe tener mínimo:
```ts
{
  id?: string
  type: 'income' | 'expense'
  segment: 'ingresos' | 'ahorro' | 'gastos_fijos' | 'gastos_variables'
  amount: number
  currency: 'VES' | 'USD' | 'EUR'
  originalRate: number
  amountUSD: number
  category: string
  description?: string
  date: string // ISO
  profileId: 'personal'
}
```

### Recurrencia (al crear movimiento)
Soporta:
- none
- weekly (+7 días)
- monthly (+1 mes)
- quarterly (+3 meses)
- quadrimester (+4 meses)
- biannual (+6 meses)

Genera recurrencias hasta final del año actual (con safety counter para evitar loops infinitos).

### Dashboard (Home) — cálculos exactos
Para rango de vista `month`, `ytd`, `year`:
- Acumular: ingresos, gastos, gastos fijos, gastos variables, ahorro, balance.
- Mantener desglose por origen monetario:
  - VES “nominal” (monto original en Bs)
  - Hard currency (USD + EUR expresado en USD)
- Balance:
  - Si transacción `type=income`, suma.
  - Si `expense`, resta.

### Budget view — lógica exacta
Para el mes actual:
- `variableTotal` = suma de `gastos_variables` en USD.
- `income` = suma de `ingresos` en USD.
- `savings` = suma de `ahorro` en USD.
- `fixed` = suma de `gastos_fijos` en USD.
- `realAvailable = (income - savings) - fixed`
- `totalBudget = sum(budgets[category])`
- `progress = variableTotal / totalBudget * 100` (si totalBudget > 0, si no 0)

### Reporte P&L (tabla)
- Agrupación: daily, weekly, monthly, yearly.
- Segmentos: ingresos, ahorro, gastos_fijos, gastos_variables.
- Crear llaves dinámicas por concepto + moneda: `"{category} ({Bs|USD|EUR})"`.
- Para `ahorro` en VES, en reporte convertir con BCV vigente (`amount / rates.bcv`) para consistencia de lectura.
- Métricas por período:
  - `available = ingresos - ahorro`
  - `flexibleAvailable = ingresos - ahorro - gastos_fijos`
  - `net = ingresos - ahorro - gastos_fijos - gastos_variables`

## Firestore (estructura requerida)
Mantén esta estructura:
- `projects/{PROJECT_DOC_ID}/users/{uid}/settings/rates`
- `projects/{PROJECT_DOC_ID}/users/{uid}/settings/pnl`
- `projects/{PROJECT_DOC_ID}/users/{uid}/settings/budgets`
- `projects/{PROJECT_DOC_ID}/users/{uid}/transactions/{transactionId}`

Usa listeners realtime (`onSnapshot`) para settings y transacciones.
Ordena historial por fecha desc.

## Pantallas mínimas a construir
1. Login/Auth (email/password + Google si aplica en Expo).
2. Home Dashboard (KPIs + selector de período).
3. Modal de Nuevo/Editar movimiento.
4. Historial con filtros por segmento y mes.
5. Presupuestos (por categoría variable + barra de progreso).
6. Personalización (CRUD de categorías por segmento).
7. Reporte P&L (tabla navegable y legible en mobile).
8. Perfil (logout, reset password, acciones seguras).

## UX/UI mobile
- Mantén estética premium oscura inspirada en Sencillo.
- Cuidar safe areas, teclado, formularios largos y rendimiento en listas.
- Componentes reutilizables (`Button`, `MoneyInput`, `RateSelector`, `KpiCard`, etc.).
- Loading, empty states, errores y confirmaciones claras.

## Entregables obligatorios
1. App corriendo en Expo.
2. Código modular por capas:
   - `src/domain` (lógica pura)
   - `src/data` (firebase/repos)
   - `src/features/*`
   - `src/ui/*`
3. Tests de paridad financiera (crítico).
4. README con setup y decisiones técnicas.
5. Checklist de paridad (web vs mobile) con evidencia.

## Criterio de aceptación
No se considera terminado hasta que:
- Los mismos datos de entrada produzcan **los mismos resultados numéricos** que la web.
- Las vistas clave (Home, Budget, Reporte, Historial) estén funcionales.
- Existan tests que cubran conversiones, KPIs, budget, P&L y recurrencias.

## Forma de trabajo que te pido
1. Primero propón arquitectura y árbol de carpetas.
2. Luego implementa por fases pequeñas, mostrando diffs clave.
3. Después agrega tests de paridad.
4. Finalmente entrega guía para correr en Replit + Expo Go.

Cuando haya ambigüedad, prioriza siempre **preservar lógica financiera existente** sobre cambios cosméticos.

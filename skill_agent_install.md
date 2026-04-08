# Guía de Instalación de Skills para el Agente de IA

Este proyecto utiliza habilidades ("skills") instaladas localmente para potenciar el agente de IA durante el desarrollo.
Las skills **no están incluidas en el repositorio** (excluidas por `.gitignore`). Instálalas en tu entorno local antes de comenzar a trabajar.

Las skills se ubican en `.agent/skills/` dentro del directorio raíz del proyecto.

---

## Skills Requeridas

### 1. Stitch Skills (Google Labs) — 8 skills

Proporciona herramientas de diseño UI, generación de pantallas en Stitch AI, mejora de prompts y conversión a componentes de React.

**Repositorio:** https://github.com/google-labs-code/stitch-skills.git

**Instalación manual (copia directa):**
```bash
git clone https://github.com/google-labs-code/stitch-skills.git temp_stitch
mkdir -p .agent/skills
cp -r temp_stitch/skills/* .agent/skills/
rm -rf temp_stitch
```

**Skills incluidas:** `stitch-design`, `stitch-loop`, `design-md`, `enhance-prompt`, `react-components`, `remotion`, `shadcn-ui`, `taste-design`

---

### 2. UI/UX Pro Max (NextLevelBuilder) — 1 skill

Motor de inteligencia de diseño con 67 estilos UI, 161 paletas de colores, 57 combinaciones tipográficas y 161 reglas de razonamiento por industria.

**Repositorio:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git

**Instalación via CLI (recomendada para Antigravity):**
```bash
npx uipro-cli init --ai antigravity
```

**Instalación manual alternativa:**
```bash
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git temp_uipro
cp -r temp_uipro/src/ui-ux-pro-max .agent/skills/ui-ux-pro-max
rm -rf temp_uipro
```

---

### 3. React Best Practices (Vercel Labs) — 1 skill

Guía de optimización de rendimiento para React y Next.js con 69 reglas en 8 categorías (waterfalls, bundle size, SSR, re-renders, etc.).

**Repositorio:** https://github.com/vercel-labs/agent-skills  
**Commit específico:** `73140fc5b3a214ad3222bcf557b397b3c02d11c1`  
**Directorio dentro del repo:** `skills/react-best-practices`

**Instalación:**
```bash
git clone https://github.com/vercel-labs/agent-skills.git temp_vercel
cd temp_vercel && git checkout 73140fc5b3a214ad3222bcf557b397b3c02d11c1 && cd ..
cp -r temp_vercel/skills/react-best-practices .agent/skills/
rm -rf temp_vercel
```

---

### 4. Expo Skills (Expo Team) — 12 skills

Skills oficiales del equipo de Expo para construir, desplegar y depurar apps con Expo Router, React Native, EAS, módulos nativos y más.

**Repositorio:** https://github.com/expo/skills.git

**Instalación:**
```bash
git clone https://github.com/expo/skills.git temp_expo
cp -r temp_expo/plugins/expo/skills/* .agent/skills/
rm -rf temp_expo
```

**Skills incluidas:** `building-native-ui`, `expo-api-routes`, `expo-cicd-workflows`, `expo-deployment`, `expo-dev-client`, `expo-module`, `expo-tailwind-setup`, `expo-ui-jetpack-compose`, `expo-ui-swift-ui`, `native-data-fetching`, `upgrading-expo`, `use-dom`

---

## Verificación

Después de la instalación, tu directorio `.agent/skills/` debe contener las siguientes carpetas:

```
.agent/skills/
├── building-native-ui/
├── design-md/
├── enhance-prompt/
├── expo-api-routes/
├── expo-cicd-workflows/
├── expo-deployment/
├── expo-dev-client/
├── expo-module/
├── expo-tailwind-setup/
├── expo-ui-jetpack-compose/
├── expo-ui-swift-ui/
├── native-data-fetching/
├── react-best-practices/
├── react-components/
├── remotion/
├── shadcn-ui/
├── stitch-design/
├── stitch-loop/
├── taste-design/
├── ui-ux-pro-max/
├── upgrading-expo/
└── use-dom/
```

> **Nota:** El agente de IA (Antigravity, Gemini CLI, Claude Code, etc.) detecta y usa las skills automáticamente al encontrarlas en `.agent/skills/`.

import js from '@eslint/js' // Importa las reglas recomendadas de JavaScript core.
import globals from 'globals' // Proporciona listas de variables globales (como 'window' o 'document').
import reactHooks from 'eslint-plugin-react-hooks' // Reglas para asegurar el uso correcto de los Hooks de React.
import reactRefresh from 'eslint-plugin-react-refresh' // Valida que los componentes sean aptos para la recarga rápida de Vite.
import { defineConfig, globalIgnores } from 'eslint/config' // Utilidades para definir la configuración de forma estructurada.

export default defineConfig([
  // Define carpetas que ESLint debe ignorar por completo (como la carpeta de producción).
  globalIgnores(['dist']), 
  {
    // Indica que estas reglas se aplicarán a todos los archivos de JavaScript y React.
    files: ['**/*.{js,jsx}'],
    // Hereda configuraciones base para no tener que escribir cientos de reglas manualmente.
    extends: [
      js.configs.recommended, // Reglas básicas de JS (evitar variables no definidas, etc.).
      reactHooks.configs.flat.recommended, // Reglas esenciales para useEffect, useState, etc.
      reactRefresh.configs.vite, // Configuración específica para el ecosistema de Vite.
    ],
    languageOptions: {
      // Le dice a ESLint que el código corre en un navegador (así no marca error al usar 'fetch' o 'console').
      globals: globals.browser, 
      parserOptions: { 
        ecmaFeatures: { jsx: true } // Habilita el soporte para entender la sintaxis de React (JSX).
      },
    },
  },
])
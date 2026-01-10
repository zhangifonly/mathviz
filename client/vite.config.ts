import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Plotly 图表库 (最大的依赖，单独分包便于缓存)
          'vendor-plotly': ['plotly.js', 'react-plotly.js'],
          // 数学库
          'vendor-math': ['mathjs', 'katex', 'react-katex'],
        },
      },
    },
    // plotly 本身就很大，提高警告阈值
    chunkSizeWarningLimit: 1500,
  },
})

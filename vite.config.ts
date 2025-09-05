import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Adicione esta seção
    proxy: {
      // Qualquer requisição que comece com /api será redirecionada
      '/api': {
        target: 'https://localhost', // O endereço do seu backend com Nginx
        changeOrigin: true, // Necessário para o proxy funcionar corretamente
        secure: false, // IMPORTANTE: Isso fará o Vite ignorar o erro do certificado SSL
        // Reescreve a URL: remove o /api do começo antes de enviar para o backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
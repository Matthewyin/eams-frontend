import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        host: true, // 监听所有地址，包括局域IP
        port: 3000, // 设置端口为3000
        strictPort: true, // 端口被占用时直接退出
        open: false, // 不自动打开浏览器
        proxy: {
            // 代理所有 /api 前缀的请求到后端服务器
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true, // 支持跨域
                secure: false, // 支持https
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url))
            }
        }
    }
})
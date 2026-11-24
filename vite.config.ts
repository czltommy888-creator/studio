import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
const target=process.env.JOURNAL_ORIGIN||'http://127.0.0.1:5822'
const staticGallery=process.env.VITE_STATIC_GALLERY==='true'
const proxy=Object.fromEntries(['/api','/media','/admin','/journal-assets'].map(prefix=>[prefix,{target,changeOrigin:false}]))
export default defineConfig({
 base:process.env.VITE_BASE_PATH||'/',
 publicDir:staticGallery?'public':false,
 resolve:{dedupe:['react','react-dom']},
 server:{proxy},preview:{proxy},
 plugins:staticGallery?[]:[{
   name:'publish-catalog-photos',
   apply:'build',
   generateBundle(){
     this.emitFile({type:'asset',fileName:'favicon.svg',source:readFileSync('public/favicon.svg')})
   }
 }],
 build:{copyPublicDir:staticGallery,rollupOptions:{onwarn(warning, report){
   if(warning.code==='MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return
   report(warning)
 }}}
})

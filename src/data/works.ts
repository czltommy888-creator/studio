import {createContext,useContext,useMemo} from 'react'
import {useLibrary} from '../library'
import editorial from './editorial.json'
import staticCatalog from './static-works.json'
export interface Work { id:string; title:string; category:string; year?:string|null; location?:string; description:string; src:string; thumb:string; medium:string; width:number; height:number; order:number; coverOrder?:number|null }
type Note = { description:string; location:string; coverOrder:number|null }
const notes: Record<string,Note> = editorial
export function usePublishedPortfolio(){
 const staticMode=import.meta.env.VITE_STATIC_GALLERY==='true'
 const remote=useLibrary(!staticMode)
 const rows=staticMode?staticCatalog:remote.works
 const status=staticMode?'':remote.status
 const works=useMemo(()=>rows.map(row=>{
   const note=notes[row.id]
   const image=(variant:'thumb'|'display')=>staticMode
    ? import.meta.env.BASE_URL+'media/'+row.id+'/'+variant+'.webp'
    : '/media/'+row.id+'/'+variant
   return {...row, category:row.category.toUpperCase(), location:note?.location,
     description:row.description||note?.description||row.title, order:row.sortOrder,
     coverOrder:note?.coverOrder, src:image('display'), medium:image('display'), thumb:image('thumb')}
 }),[rows,staticMode])
 const chosen=works.filter(w=>w.coverOrder).sort((a,b)=>(a.coverOrder??0)-(b.coverOrder??0))
 return {works,covers:chosen.length?chosen:works.slice(0,4),categories:[...new Set(works.map(w=>w.category))],status}
}
export const Portfolio=createContext<{works:Work[];covers:Work[];categories:string[]}>({works:[],covers:[],categories:[]})
export const usePortfolio=()=>useContext(Portfolio)
export const contactEmail: string = ''
export const number = (n:number) => String(n).padStart(2,'0')
export const asset = (path:string) => path
export const sourceSet = (w:Work) => [ [w.thumb,840], [w.src,2880] ].map(([path,size])=>asset(String(path))+' '+Math.round(Math.min(w.width, Number(size)*w.width/Math.max(w.width,w.height)))+'w').join(', ')


import {useEffect,useState} from 'react'

export type PublishedWork = {
 id:string
 title:string
 category:string
 year:string
 description:string
 width:number
 height:number
 sortOrder:number
 status:'published'
 updatedAt:string
}

export async function request<T>(url:string,init?:RequestInit):Promise<T>{
 const response=await fetch(url,init)
 if(!response.ok)throw new Error((await response.json().catch(()=>({}))).error||'Request failed.')
 return response.status===204?undefined:await response.json()
}

export function useLibrary(enabled=true){
 const [works,setWorks]=useState<PublishedWork[]>([]),[status,setStatus]=useState(enabled?'Loading photographs…':'')
 useEffect(()=>{
  if(!enabled){setStatus('');return}
  let active=true,version=0
  async function sync(){
   const current=++version
   try{
    const rows=await request<PublishedWork[]>('/api/works')
    if(active&&current===version){setWorks(rows);setStatus('')}
   }catch{
    if(active&&current===version)setStatus('Connection interrupted. Reconnecting…')
   }
  }
  const events=new EventSource('/api/events')
  events.onmessage=sync
  events.onerror=()=>{if(active)setStatus('Reconnecting to the library…')}
  void sync()
  const timer=setInterval(sync,20000)
  addEventListener('online',sync)
  return()=>{active=false;clearInterval(timer);events.close();removeEventListener('online',sync)}
 },[enabled])
 return {works,status}
}

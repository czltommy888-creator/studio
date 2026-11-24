import {useEffect,useRef,useState} from 'react'
import {ArrowLeft,ArrowRight,X} from 'lucide-react'
import {number,type Work} from '../data/works'
import {Photo} from './Photo'
export function PhotoViewer({group,initialId,close}:{group:Work[];initialId:string;close:()=>void}){
 const [id,setId]=useState(initialId),index=Math.max(0,group.findIndex(w=>w.id===id)), ref=useRef<HTMLDialogElement>(null), touch=useRef<[number,number]|null>(null)
 const w=group[index],change=(delta:number)=>setId(group[(index+group.length+delta)%group.length].id)
 useEffect(()=>{const dlg=ref.current!,origin=document.activeElement as HTMLElement;dlg.showModal();document.body.style.overflow='hidden';return()=>{dlg.close();document.body.style.overflow='';origin?.focus({preventScroll:true})}},[])
 return <dialog ref={ref} aria-label="Photography viewer" onCancel={e=>{e.preventDefault();close()}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();change(1)}if(e.key==='ArrowLeft'){e.preventDefault();change(-1)}}}><div className="viewer"><div className="viewer-top"><span className="wordmark">CHEN_STUDIO</span><button aria-label="Close viewer" onClick={close}><X/></button></div><div className="screen" onTouchStart={e=>{touch.current=[e.touches[0].clientX,e.touches[0].clientY]}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current[0],dy=e.changedTouches[0].clientY-touch.current[1];if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy))change(dx<0?1:-1);touch.current=null}}><Photo key={w.id} high work={w}/></div><div className="viewer-foot"><div aria-live="polite"><span className="micro">{w.category} {w.year&&' / '+w.year}</span><h3>{w.title}</h3></div><div className="pager"><button aria-label="Previous photograph" onClick={()=>change(-1)}><ArrowLeft/></button><span className="micro">{number(index+1)} / {number(group.length)}</span><button aria-label="Next photograph" onClick={()=>change(1)}><ArrowRight/></button></div></div></div></dialog>
}

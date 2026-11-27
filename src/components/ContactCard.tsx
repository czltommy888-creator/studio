import {useEffect,useRef} from 'react'
import {X} from 'lucide-react'
import cardUrl from '../assets/contact/CHEN.html?url'
import './contact-card.css'

export function ContactCard({close}:{close:()=>void}){
 const panel=useRef<HTMLDivElement>(null)
 const frame=useRef<HTMLIFrameElement>(null)
 const button=useRef<HTMLButtonElement>(null)
 const frameCleanup=useRef<()=>void>(()=>{})
 const onClose=useRef(close)
 onClose.current=close

 useEffect(()=>{
  const origin=document.activeElement as HTMLElement|null
  button.current?.focus({preventScroll:true})
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();onClose.current()}
  }
  const outside=(event:PointerEvent)=>{
   const target=event.target
   if(target instanceof Element&&!panel.current?.contains(target)&&!target.closest('[data-contact-trigger]'))onClose.current()
  }
  window.addEventListener('keydown',key)
  document.addEventListener('pointerdown',outside)
  return()=>{
   window.removeEventListener('keydown',key)
   document.removeEventListener('pointerdown',outside)
   frameCleanup.current()
   origin?.focus({preventScroll:true})
  }
 },[])

 function loaded(){
  frameCleanup.current()
  const doc=frame.current?.contentDocument
  if(!doc)return
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();onClose.current()}
  }
  doc.addEventListener('keydown',key)
  frameCleanup.current=()=>doc.removeEventListener('keydown',key)
 }

 return <div className="contact-card" id="studio-contact-card" ref={panel} role="dialog" aria-modal="false" aria-labelledby="studio-card-title">
  <div className="contact-card-heading">
   <h2 id="studio-card-title" className="micro">CHEN / Personal card</h2>
   <button ref={button} type="button" onClick={close} aria-label="Close contact card"><X size={18}/></button>
  </div>
  <iframe ref={frame} src={cardUrl} title="CHEN interactive personal card" onLoad={loaded}/>
 </div>
}

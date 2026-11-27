import {lazy,Suspense,useEffect,useRef} from 'react'
import front from './lanyard/front.png'
import back from './lanyard/back.png'
import cardStyle from './lanyard/model.css?inline'
import './contact-card.css'

const Lanyard=lazy(()=>import('./lanyard/model.js'))

export function ContactCard({close}:{close:()=>void}){
 const panel=useRef<HTMLDivElement>(null)
 const onClose=useRef(close)
 onClose.current=close
 useEffect(()=>{
  const origin=document.activeElement as HTMLElement|null
  panel.current?.focus({preventScroll:true})
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
   origin?.focus({preventScroll:true})
  }
 },[])
 return <div className="contact-card" id="studio-contact-card" ref={panel} tabIndex={-1} role="dialog" aria-modal="false" aria-label="CHEN personal card">
  <style>{cardStyle}</style>
  <button className="contact-card-close" type="button" onClick={close} aria-label="Close contact card">Close card</button>
  <Suspense fallback={null}>
   <Lanyard frontImage={front} backImage={back} cardColor="#171819" strapColor="#242425" strapLength={0.32} strapWidth={0.52} cornerRadius={0.16} size={0.40} finish="matte" breeze={0.02} intro={false}/>
  </Suspense>
 </div>
}

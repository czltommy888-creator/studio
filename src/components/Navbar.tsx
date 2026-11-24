import {useState,useEffect} from 'react'
import {Aperture,Menu,X} from 'lucide-react'
export function Navbar(){
 const [open,toggle]=useState(false),[active,setActive]=useState('home')
 useEffect(()=>{const update=()=>{const next=['contact','works','home'].find(id=>(document.getElementById(id)?.getBoundingClientRect().top??Infinity)<innerHeight*.5);setActive(next??'home')};update();addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update)},[])
 return <header><a className="wordmark" href="#home" onClick={()=>toggle(false)}><Aperture size={23} strokeWidth={1.4}/>CHEN_STUDIO</a><span className="nav-sub">Photography / Visual Diary</span><button className="menu" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>toggle(!open)}>{open?<X/>:<Menu/>}</button><nav aria-label="Primary" className={open?'open':''} onKeyDown={e=>{if(e.key==='Escape')toggle(false)}}>{['home','works','contact'].map(id=><a key={id} href={'#'+id} className={active===id?'active':''} onClick={()=>toggle(false)}>{id}</a>)}</nav></header>
}

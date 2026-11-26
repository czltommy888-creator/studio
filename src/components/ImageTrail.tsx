import {useEffect,useRef} from 'react'
import {gsap} from 'gsap'
import type {Work} from '../data/works'
import './image-trail.css'

// Adapted from Codrops ImageTrailEffects/demo.js, Copyright 2019 Codrops.
// Distance threshold, cached pointer interpolation and GSAP reveal/fade sequence.
// See THIRD_PARTY_NOTICES.md for source and integration license.
const slots=Array.from({length:8},(_,i)=>i)
type Point={x:number;y:number}
type Heat=Point & {born:number;strength:number}

export function ImageTrail({works}:{works:Work[]}){
 const region=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null)
 const currentWorks=useRef(works)
 currentWorks.current=works
 const signature=works.map(w=>[w.id,w.thumb,w.width,w.height].join(':')).join('|')
 useEffect(()=>{
  const el=region.current!,heatCanvas=canvas.current!
  const nodes=Array.from(el.querySelectorAll<HTMLImageElement>('.trail-print'))
  const media=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)')
  let destroy=()=>{}
  function configure(){
   destroy()
   if(!media.matches){el.dataset.interactive='false';return}
   el.dataset.interactive='true'
   const ctx=heatCanvas.getContext('2d')
   if(!ctx)return
   let disposed=false,visible=false,loading=false,frame=0,slot=0,index=0,z=0,lastSpawn=-Infinity,lastEvent=0
   let width=1,height=1,pointer:Point|null=null,previous:Point|null=null,origin:Point|null=null,cached:Point|null=null
   let speed=0,distance=0,heat:Heat[]=[],ready:Work[]=[]
   const pending=new Set<HTMLImageElement>()
   const source=currentWorks.current.slice()
   const timelines=new Map<HTMLImageElement,gsap.core.Timeline>()
   function clear(){
    cancelAnimationFrame(frame);frame=0
    timelines.forEach(t=>t.kill());timelines.clear()
    gsap.set(nodes,{opacity:0})
    nodes.forEach(n=>{n.removeAttribute('src');delete n.dataset.work})
    heat=[];ctx!.clearRect(0,0,width,height)
    pointer=previous=origin=cached=null;lastEvent=0;distance=0;speed=0;z=0
   }
   async function preload(){
    if(loading)return
    loading=true
    let next=0
    async function worker(){
     while(!disposed&&next<source.length){
      const work=source[next++],img=new Image()
      img.decoding='async';pending.add(img)
      try{img.src=work.thumb;await img.decode();if(!disposed)ready.push(work)}catch{/* Broken thumbnails stay out of the trail. */}
      finally{pending.delete(img)}
     }
    }
    await Promise.all(slots.slice(0,4).map(worker))
   }
   function resize(){
    clear()
    width=el.clientWidth;height=el.clientHeight
    // Render at half CSS resolution and cap the backing store to 960 x 480.
    const ratio=Math.min(.5,960/width,480/height)
    heatCanvas.width=Math.max(1,Math.round(width*ratio));heatCanvas.height=Math.max(1,Math.round(height*ratio))
    ctx!.setTransform(ratio,0,0,ratio,0,0)
   }
   function emit(now:number){
    if(!pointer||!cached||!ready.length)return
    const work=ready[index++%ready.length],img=nodes[slot++%nodes.length]
    timelines.get(img)?.kill()
    img.src=work.thumb;img.dataset.work=work.id
    const w=112+Math.random()*50,h=w*work.height/work.width
    img.style.width=w+'px';img.style.height=h+'px'
    const x=Math.max(w/2+8,Math.min(width-w/2-8,pointer.x))
    const y=Math.max(h/2+8,Math.min(height-h/2-8,pointer.y))
    const dx=Math.max(-32,Math.min(32,pointer.x-cached.x)),dy=Math.max(-24,Math.min(24,pointer.y-cached.y))
    const rotation=Math.random()*16-8
    if(!timelines.size)z=0
    const timeline=gsap.timeline({onComplete:()=>{timelines.delete(img);img.removeAttribute('src');delete img.dataset.work}})
     .set(img,{x:cached.x-w/2,y:cached.y-h/2,opacity:0,scale:.82,rotation:rotation-3,zIndex:++z})
     .to(img,{opacity:1,scale:1,duration:.17,ease:'power2.out'},0)
     .to(img,{x:x-w/2+dx*.18,y:y-h/2+dy*.18,rotation,duration:.68,ease:'expo.out'},0)
     .to(img,{opacity:0,scale:.88,y:'+=14',duration:.52,ease:'power2.in'},.55)
    timelines.set(img,timeline);lastSpawn=now;origin={...pointer};distance=0
   }
   function render(now:number){
    frame=0
    if(disposed||!visible||document.hidden)return
    if(pointer&&cached){
     cached.x+=(pointer.x-cached.x)*.17;cached.y+=(pointer.y-cached.y)*.17
     if(distance>=88&&now-lastSpawn>=80&&now-lastEvent<150)emit(now)
    }
    heat=heat.filter(p=>now-p.born<1250)
    ctx!.clearRect(0,0,width,height)
    for(const p of heat){
     const age=(now-p.born)/1250,radius=35+age*83,alpha=(1-age)**2*p.strength
     const glow=ctx!.createRadialGradient(p.x,p.y,0,p.x,p.y,radius)
     glow.addColorStop(0,'rgba(194,122,49,'+alpha*.36+')')
     glow.addColorStop(.3,'rgba(145,62,26,'+alpha*.29+')')
     glow.addColorStop(.64,'rgba(83,22,12,'+alpha*.18+')')
     glow.addColorStop(1,'rgba(15,0,0,0)')
     ctx!.fillStyle=glow;ctx!.fillRect(p.x-radius,p.y-radius,radius*2,radius*2)
    }
    if(heat.length||timelines.size||now-lastEvent<150)frame=requestAnimationFrame(render)
   }
   function move(e:PointerEvent){
    if(e.pointerType!=='mouse'||!visible||document.hidden)return
    const bounds=el.getBoundingClientRect(),p={x:e.clientX-bounds.left,y:e.clientY-bounds.top},now=performance.now()
    const travelled=previous?Math.hypot(p.x-previous.x,p.y-previous.y):0
    speed=travelled/Math.max(8,now-lastEvent)
    pointer=p;cached??={...p};origin??={...p}
    distance+=travelled;previous=p
    if(now-lastEvent>=24){
     heat.push({...p,born:now,strength:.3+Math.min(.7,speed*.22)})
     if(heat.length>48)heat.shift()
     lastEvent=now
    }
    if(!frame)frame=requestAnimationFrame(render)
   }
   const leave=()=>{pointer=previous=origin=cached=null;distance=0}
   const visibility=()=>{if(document.hidden)clear()}
   const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting
    if(visible)void preload();else clear()
   },{threshold:.08})
   const sizing=new ResizeObserver(resize)
   observer.observe(el);sizing.observe(el)
   el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerleave',leave)
   document.addEventListener('visibilitychange',visibility)
   nodes.forEach(n=>{n.onerror=()=>{ready=ready.filter(w=>w.id!==n.dataset.work);timelines.get(n)?.kill();timelines.delete(n);gsap.set(n,{opacity:0})}})
   destroy=()=>{
    disposed=true;clear();pending.forEach(img=>{img.src=''});pending.clear();ready=[]
    observer.disconnect();sizing.disconnect()
    el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)
    document.removeEventListener('visibilitychange',visibility);nodes.forEach(n=>{n.onerror=null})
    heatCanvas.width=heatCanvas.height=1
   }
  }
  configure();media.addEventListener('change',configure)
  return()=>{media.removeEventListener('change',configure);destroy()}
 },[signature])
 return <section ref={region} className="trail-region" aria-label="Explore the photographic archive" data-interactive="false">
  <canvas ref={canvas} className="trail-heat" aria-hidden="true"/>
  <div className="trail-pool" aria-hidden="true">{slots.map(i=><img className="trail-print" key={i} alt="" decoding="async"/>)}</div>
  <div className="trail-copy"><p className="micro">CHEN_STUDIO / Visual diary</p><h3>In <em>passing.</em></h3><p className="trail-instruction">Move through the frame. Follow a memory.</p><a className="micro" href="#photographs">Browse photographs ↓</a></div>
  <div className="trail-still" aria-hidden="true">{works.slice(0,3).map(w=><img src={w.thumb} key={w.id} alt="" loading="lazy"/>)}</div>
 </section>
}

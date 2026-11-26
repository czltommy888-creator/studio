import {useRef, type ReactNode} from 'react'
import {motion, useReducedMotion, useScroll, useTransform, type MotionValue} from 'framer-motion'
import {ArrowDown} from 'lucide-react'
import {type Work} from '../data/works'
import {diaryPhotographs} from '../data/diary-photographs'
import {Photo} from './Photo'
import './visual-diary.css'

const note = [
 'I keep a record of the light,',
 'and of those who pass through it.',
 'These are the moments I return to.'
]

function NoteLine({progress, index, children}:{
 progress:MotionValue<number>; index:number; children:ReactNode
}){
 const start=index*.15
 const clipPath=useTransform(progress,[start,start+.4],['inset(0 100% 0 0)','inset(0 0% 0 0)'])
 const opacity=useTransform(progress,[start,start+.12],[0,1])
 return <motion.span className="diary-line" style={{clipPath,opacity}}>{children}</motion.span>
}

function PhotoFragment({work, index, view}:{work:Work;index:number;view:(work:Work)=>void}){
 const ref=useRef<HTMLDivElement>(null)
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','start 0.3']})
 const y=useTransform(scrollYProgress,[0,1],[index===1?55:85,0])
 const clipPath=useTransform(scrollYProgress,[0,.72],['inset(100% 0 0 0)','inset(0% 0 0 0)'])
 const captionOpacity=useTransform(scrollYProgress,[.42,.8],[0,1])
 return <div className={`diary-fragment diary-fragment-${index+1}`} ref={ref}>
  <motion.div className="diary-fragment-motion" style={{y}}>
   <motion.div className="diary-fragment-image" style={{clipPath}}>
    <button data-view className="photo-button" aria-label={'View '+work.title} onClick={()=>view(work)}>
     <Photo key={work.id} work={work} sizes="(max-width: 700px) 92vw, 58vw"/>
    </button>
   </motion.div>
   <motion.p className="diary-caption micro" style={{opacity:captionOpacity}}>
    <span>{work.title}</span><span>{[work.location||work.category,work.year].filter(Boolean).join(' / ')}</span>
   </motion.p>
  </motion.div>
 </div>
}

function PhotoScene({photographs,view}:{photographs:Work[];view:(work:Work)=>void}){
 const sceneRef=useRef<HTMLDivElement>(null)
 const {scrollYProgress:scene}=useScroll({target:sceneRef,offset:['start end','start 0.15']})
 const titleY=useTransform(scene,[0,1],[54,0])
 const titleOpacity=useTransform(scene,[.24,.82],[0,1])
 return <div className="diary-scene" ref={sceneRef}>
  <div className="diary-composition">
   {photographs.map((work,index)=><PhotoFragment key={work.id} work={work} index={index} view={view}/>)}
   <motion.h2 className="diary-scene-title" style={{y:titleY,opacity:titleOpacity}}>
    What the light <em>leaves behind.</em>
   </motion.h2>
  </div>
  <a className="diary-continue micro" href="#works">Explore selected works <ArrowDown size={15}/></a>
 </div>
}

export function VisualDiary({view}:{view:(work:Work)=>void}){
 const noteRef=useRef<HTMLDivElement>(null)
 const reduceMotion=useReducedMotion()
 const {scrollYProgress:writing}=useScroll({target:noteRef,offset:['start 0.9','end 0.58']})
 return <section className="visual-diary" id="visual-diary" aria-label="Visual diary" data-reduced={reduceMotion||undefined}>
  <div className="diary-paper">
   <div className="diary-note" ref={noteRef}>
    <div className="diary-letter">
     <p>{note.map((line,index)=><NoteLine progress={writing} index={index} key={line}>{line}</NoteLine>)}</p>
     <span className="diary-signature">Chen</span>
    </div>
   </div>
  </div>
  <PhotoScene photographs={diaryPhotographs} view={view}/>
 </section>
}

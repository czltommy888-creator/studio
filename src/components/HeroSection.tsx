import {useRef,useState} from 'react'
import {motion,useScroll,useTransform,useReducedMotion} from 'framer-motion'
import {ChevronLeft,ChevronRight,ArrowDown,Expand} from 'lucide-react'
import {usePortfolio,number,type Work} from '../data/works'
import {Photo} from './Photo'
export function HeroSection({view}:{view:(w:Work)=>void}){
 const {covers}=usePortfolio()
 const [current,setCurrent]=useState(0), ref=useRef<HTMLElement>(null)
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']})
 const y=useTransform(scrollYProgress,[0,1],['0%','9%']), reduce=useReducedMotion()
 const titleY=useTransform(scrollYProgress,[0,1],[0,-30])
 const work=covers[current%covers.length]; if(!work)return null
 const change=(step:number)=>setCurrent(i=>(i+step+covers.length)%covers.length)
 return <section className="hero" ref={ref} aria-label="Featured photography"><motion.div data-cover={work.id} className="hero-image" style={{y:reduce?0:y}}><Photo key={work.id} work={work} hero sizes="(max-width:760px) 150vh, 100vw"/></motion.div><div className="hero-shade"/>
 <div className="hero-top micro"><span><i className="square"/>Featured photograph</span><span>{[work.location||work.category,work.year].filter(Boolean).join(' / ')}</span></div>
 <motion.div className="hero-type" style={{y:reduce?0:titleY}}><p className="micro"><span className="hairline"/> Photography &amp; visual stories</p><h1>CHEN_<em>STUDIO</em></h1><p className="tagline">Capturing moments.<br/><em>Preserving emotions.</em></p></motion.div>
 <div className="hero-foot"><div className="slider"><button aria-label="Previous featured photograph" onClick={()=>change(-1)}><ChevronLeft/></button><span>{number(current%covers.length+1)} <b>/</b> {number(covers.length)}</span><button aria-label="Next featured photograph" onClick={()=>change(1)}><ChevronRight/></button></div><button className="cover-title" onClick={()=>view(work)}>{work.title}<Expand size={14}/></button><a href="#visual-diary" className="micro explore">Scroll to explore <ArrowDown size={15}/></a></div></section>
}

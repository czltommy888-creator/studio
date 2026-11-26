import {useState} from 'react'
import {motion,useReducedMotion} from 'framer-motion'
import {usePortfolio,number,type Work} from '../data/works'
import {Photo} from './Photo'
import {ImageTrail} from './ImageTrail'
export function CategoryFilter({value,select}:{value:string;select:(v:string)=>void}){
 const {categories,works}=usePortfolio()
 return <div className="filters" aria-label="Filter photographs">{['All',...categories].map(c=><button aria-pressed={value===c} key={c} onClick={()=>select(c)}>{c.toLowerCase()} {value===c&&<sup>{number(c==='All'?works.length:works.filter(w=>w.category===c).length)}</sup>}</button>)}</div>
}
const photoVariants={
 hidden:{clipPath:'inset(100% 0% 0% 0%)'},
 visible:{clipPath:'inset(0% 0% 0% 0%)',transition:{duration:.75,ease:[.22,1,.36,1] as const}}
}
const captionVariants={
 hidden:{opacity:0,y:12},
 visible:{opacity:1,y:0,transition:{duration:.45,delay:.25}}
}

export function WorksGallery({view}:{view:(w:Work,category?:string)=>void}){
 const {works,categories}=usePortfolio()
 const [selected,select]=useState('All'), category=categories.includes(selected)?selected:'All'
 const reduceMotion=useReducedMotion()
 const group=works.filter(w=>category==='All'||w.category===category)
 return <section id="works" className="archive"><p className="micro section-label"><i className="square"/>The photographic archive</p><div className="section-heading"><h2>Selected <em>Works</em></h2><span className="micro archive-count">{number(works.length)} photographs</span></div><CategoryFilter value={category} select={select}/><ImageTrail works={group}/><div id="photographs" className="gallery">{group.map((w)=><motion.figure className={w.height>w.width?'portrait':''} key={w.id} initial={reduceMotion?false:"hidden"} whileInView="visible" viewport={{once:true,amount:.1}}><motion.div className="gallery-photo-reveal" variants={photoVariants}><button data-view className="photo-button" aria-label={'View '+w.title} onClick={()=>view(w,category==='All'?undefined:category)}><Photo work={w}/></button></motion.div><motion.figcaption variants={captionVariants}><h3>{w.title}</h3><span className="micro">{w.category}{w.year?' / '+w.year:''}</span></motion.figcaption></motion.figure>)}</div></section>
}

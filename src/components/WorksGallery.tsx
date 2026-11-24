import {useState} from 'react'
import {motion} from 'framer-motion'
import {usePortfolio,number,type Work} from '../data/works'
import {Photo} from './Photo'
export function CategoryFilter({value,select}:{value:string;select:(v:string)=>void}){
 const {categories,works}=usePortfolio()
 return <div className="filters" aria-label="Filter photographs">{['All',...categories].map(c=><button aria-pressed={value===c} key={c} onClick={()=>select(c)}>{c.toLowerCase()} {value===c&&<sup>{number(c==='All'?works.length:works.filter(w=>w.category===c).length)}</sup>}</button>)}</div>
}
export function WorksGallery({view}:{view:(w:Work,category?:string)=>void}){
 const {works,categories}=usePortfolio()
 const [selected,select]=useState('All'), category=categories.includes(selected)?selected:'All'
 const group=works.filter(w=>category==='All'||w.category===category)
 return <section id="works" className="archive"><p className="micro section-label"><i className="square"/>The photographic archive</p><div className="section-heading"><h2>Selected <em>Works</em></h2><span className="micro archive-count">{number(works.length)} photographs</span></div><CategoryFilter value={category} select={select}/><div className="gallery">{group.map((w)=><motion.figure className={w.height>w.width?'portrait':''} key={w.id} initial={{opacity:.3,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.45}}><button data-view className="photo-button" aria-label={'View '+w.title} onClick={()=>view(w,category==='All'?undefined:category)}><Photo work={w}/></button><figcaption><h3>{w.title}</h3><span className="micro">{w.category}{w.year?' / '+w.year:''}</span></figcaption></motion.figure>)}</div></section>
}

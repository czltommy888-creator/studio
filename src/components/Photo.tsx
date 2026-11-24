import {useState} from 'react'
import {asset,sourceSet,type Work} from '../data/works'
export function Photo({work,high=false,hero=false,sizes='(max-width: 700px) 94vw, 62vw'}:{work:Work; high?:boolean; hero?:boolean;sizes?:string}){
 const [failed,setFailed]=useState(false)
 return failed?<span className="unavailable" role="img" aria-label={work.description}>Photograph unavailable · {work.title}</span>:<img src={asset(high?work.src:work.medium)} srcSet={high?undefined:sourceSet(work)} sizes={sizes} width={work.width} height={work.height} alt={work.description} decoding="async" fetchPriority={hero?'high':'auto'} loading={high||hero?'eager':'lazy'} onError={()=>setFailed(true)}/>
}

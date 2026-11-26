import React,{useEffect,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {MotionConfig} from 'framer-motion'
import {Portfolio,usePublishedPortfolio,type Work} from './data/works'
import {Navbar} from './components/Navbar'
import {HeroSection} from './components/HeroSection'
import {VisualDiary} from './components/VisualDiary'
import {WorksGallery} from './components/WorksGallery'
import {PhotoViewer} from './components/PhotoViewer'
import {Footer,ContactSection} from './components/EndSections'
import {LoadingTransition,CustomCursor} from './components/Effects'
import './styles.css'
function App(){
 const library=usePublishedPortfolio()
 const [viewer,setViewer]=useState<{category?:string;id:string}|null>(null)
 const group=library.works.filter(w=>!viewer?.category||viewer.category===w.category)
 useEffect(()=>{if(viewer&&!group.length)setViewer(null)},[viewer,group.length])
 const view=(w:Work,category?:string)=>setViewer({id:w.id,category})
 return <Portfolio.Provider value={library}><MotionConfig reducedMotion="user"><div id="home"/><a className="skip" href="#works">Skip to photographs</a><LoadingTransition/><Navbar/><main>{library.status&&<p role="status" className="connection">{library.status}</p>}<HeroSection view={view}/><VisualDiary view={view}/><WorksGallery view={view}/><ContactSection/></main><Footer/><CustomCursor/>{viewer&&group.length>0&&<PhotoViewer key={viewer.id} group={group} initialId={viewer.id} close={()=>setViewer(null)}/>}</MotionConfig></Portfolio.Provider>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)


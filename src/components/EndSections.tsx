import {useState} from 'react'
import {motion} from 'framer-motion'
import {contactEmail} from '../data/works'
export function ContactSection({openContact}:{openContact:()=>void}){
 const [saved,setSaved]=useState(false)
 return <section id="contact" className="contact"><p className="micro section-label"><i className="square"/>Contact</p><h2>Get in <em>touch.</em></h2><button type="button" className="studio-card-trigger" data-contact-trigger aria-haspopup="dialog" aria-controls="studio-contact-card" onClick={openContact}>View studio card</button>{contactEmail?<a className="contact-link" href={'mailto:'+contactEmail}>{contactEmail}</a>:<details><summary>Prepare an enquiry</summary><form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const url=URL.createObjectURL(new Blob(['CHEN_STUDIO — Photography enquiry\n\n'+data.get('message')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='chen-studio-enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setSaved(true)}}><label htmlFor="message">Your enquiry</label><textarea id="message" name="message" required rows={4} onChange={()=>setSaved(false)}/><p>Studio contact details are pending. Save a draft to your device.</p><button type="submit">Download draft</button>{saved&&<small role="status">Draft prepared for download.</small>}</form></details>}</section>
}
export function Footer(){return <footer><motion.span initial={{opacity:.5}} whileInView={{opacity:1}} className="wordmark">CHEN_STUDIO</motion.span><span className="micro">Photography / Visual diary</span>{import.meta.env.VITE_STATIC_GALLERY!=='true'&&<a href="/admin">Manage photos</a>}<a href="#home">Back to top ↑</a></footer>}


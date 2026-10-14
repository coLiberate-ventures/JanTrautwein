import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BlurFade } from "../../tools/magicui/apps/www/registry/magicui/blur-fade";
import "./hero-study-03.css";
import { TextBlurIn } from "./components/ui/text-blur-in";
import { CoachingSection } from "./CoachingSection";
import { AIMentoringSection } from "./AIMentoringSection";
import { CoachingPage } from "./CoachingPage";

const logos = [["apple.svg","Apple",true],["climate-farmers.png","Climate Farmers",true],["liminal.png","Liminal",false],["amazon.svg","Amazon",true],["kologica.png","Kológica",true],["natural-symbiosis.png","Natural Symbiosis",false],["superoperator.svg","Superoperator",true],["motorworld.png","Motorworld",true],["wildlife-conservation-society.png","Wildlife Conservation Society",true],["catalyst-studio.png","Catalyst Studio",false],["evergreen-labs.png","Evergreen Labs",true],["parlance.png","Parlance",true],["adventures-in-connection.png","Adventures in Connection",false]];
const words=["LIVE","GROW","ENJOY","CREATE"];
const wordStyles={
 flip:{initial:{opacity:0,rotateX:65,y:18},animate:{opacity:1,rotateX:0,y:0},exit:{opacity:0,rotateX:-65,y:-18}},
 glide:{initial:{opacity:0,y:35},animate:{opacity:1,y:0},exit:{opacity:0,y:-35}},
 dissolve:{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0}},
 letters:{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0}}
};
// Supply a local video URL here when Jan's Journey footage is ready.
const journeyVideo=null;
function HomePage(){
 const reduced = useReducedMotion();
 const [paused,setPaused]=useState(false);
 const [word,setWord]=useState(0);
 const [wordStyle,setWordStyle]=useState("glide");
 const [activeLogo,setActiveLogo]=useState(null);
 const video=useRef(null);
 const stage=useRef(null);
 const moving=!reduced&&!paused;
 useEffect(()=>{
  if(!moving)return;
  const timer=setInterval(()=>{if(!document.hidden)setWord(w=>(w+1)%words.length)},4200);
  return()=>clearInterval(timer);
 },[moving]);
 useEffect(()=>{
  if(!video.current)return;
  if(moving)video.current.play().catch(()=>{});
  else video.current.pause();
 },[moving]);
 useEffect(()=>{
  const el=stage.current;
  let frame=0;
  const render=()=>{frame=0;const r=el.getBoundingClientRect();const distance=Math.max(-120,Math.min(700,-r.top));
   el.style.setProperty("--portrait-y",moving?distance*.075+"px":"0px");
   el.style.setProperty("--word-y",moving?distance*-.11+"px":"0px");
  };
  const update=()=>{if(!frame)frame=requestAnimationFrame(render)};
  window.addEventListener("scroll",update,{passive:true});render();
  return()=>{window.removeEventListener("scroll",update);cancelAnimationFrame(frame)};
 },[moving]);
 const reveal=(children,delay=0)=> moving?<BlurFade delay={delay} blur="3px" offset={9} duration={.7}>{children}</BlurFade>:<div>{children}</div>;
 return <div className={moving?"page":"page still"}>
 <a className="skip" href="#intro">Skip to introduction</a>
 <div className="prototype"><span>HERO STUDY 04 · STONE & BRONZE</span><div className="preview-controls"><label htmlFor="word-style">Word movement</label><select id="word-style" value={wordStyle} onChange={e=>setWordStyle(e.target.value)}><option value="flip">1 · Soft flip</option><option value="glide">2 · Vertical glide</option><option value="dissolve">3 · Quiet dissolve</option><option value="letters">4 · Letter cascade</option></select><button type="button" aria-pressed={paused||!!reduced} onClick={()=>setPaused(!paused)}>{reduced?"Reduced motion enabled":paused?"Enable movement":"Pause movement"}</button></div></div>
 <header className="nav"><a className="brand" href="#top"><span aria-hidden="true">△</span> Jan Trautwein</a><nav aria-label="Main navigation"><a href="coaching.html">Coaching</a><a href="#ai">AI mentoring</a><a href="#journey">Journey</a><a className="nav-contact" href="https://jantrautwein.com/contact.html">Let’s talk <span aria-hidden="true">↗</span></a></nav></header>
 <main>
 <section className="hero" id="top" ref={stage} aria-label="Introduction to Jan">
 <div className="back-word" data-word={words[word]} aria-hidden="true"><AnimatePresence mode="wait"><motion.span className="rotating-word" key={words[word]+wordStyle} initial={moving?wordStyles[wordStyle].initial:false} animate={wordStyles[wordStyle].animate} exit={moving?wordStyles[wordStyle].exit:{opacity:1}} transition={{duration:moving?.65:0,ease:[.22,1,.36,1]}}>{wordStyle==="letters"?words[word].split("").map((letter,i)=><motion.span className="word-letter" key={i} initial={moving?{opacity:0,y:25,rotateX:55}:false} animate={{opacity:1,y:0,rotateX:0}} transition={{duration:moving?.65:0,delay:moving?i*.09:0,ease:[.22,1,.36,1]}}>{letter}</motion.span>):words[word]}</motion.span></AnimatePresence></div>
 <div className="orbit" aria-hidden="true"><div className="orbit-track outer"><span className="planet large"/></div><div className="inner-ring"><div className="orbit-track inner"><span className="planet small"/></div></div></div>
 <div className="portrait"><img src="hero/assets/jan-cutout.png" width="1536" height="1024" alt="Jan smiling with his hands holding the collar of his cream hoodie" fetchPriority="high"/></div>
 <div className="hero-copy" id="intro">
 {reveal(<p className="eyebrow">YOUR WORK. YOUR LIFE. YOUR ADVENTURE.</p>,.08)}
 {reveal(<h1><TextBlurIn as="span" className="heading-blur-line" by="word">Create something</TextBlurIn><TextBlurIn as="span" className="heading-blur-line" by="word" delay={.12}>meaningful.</TextBlurIn><em className="heading-blur-line"><TextBlurIn as="span" by="word" delay={.24}>Enjoy your life</TextBlurIn></em><TextBlurIn as="span" className="heading-blur-line" by="word" delay={.36}>along the way.</TextBlurIn></h1>,.18)}
 {reveal(<><p className="lead">I’m Jan. A coach and creation partner for people building something that matters, who want more freedom and enjoyment in the life they’re creating.</p><div className="actions"><a className="button" href="coaching.html">Explore working together <span aria-hidden="true">↗</span></a><a className="quiet-link" href="#approach">Meet Jan <span aria-hidden="true">↓</span></a></div><p className="experience">Personal coaching since 2018</p></>,.3)}
 </div>
 <a className="scroll-cue" href="#credibility" aria-label="Scroll to coaching experience"><span aria-hidden="true">↓</span></a>
 </section>
 <section className="credibility" id="credibility" aria-label="Coaching experience"><div className="credibility-title"><p>I’ve coached <strong>founders and leaders</strong> from these companies;</p></div><div className="logo-marquee"><div className="logo-track">{[0,1].map(copy=><div className="logo-group" key={copy} aria-hidden={copy===1?true:undefined}>{logos.map(([file,name,color])=>copy===0?<button type="button" key={file} className={"logo-item"+(color?" color-logo":"")+(activeLogo===file?" active":"")} aria-label={"Show "+name+" logo"} aria-pressed={activeLogo===file} onClick={()=>setActiveLogo(activeLogo===file?null:file)}><img src={"hero/assets/logos/"+file} alt={name}/></button>:<div key={file} className={"logo-item"+(color?" color-logo":"")}><img src={"hero/assets/logos/"+file} alt=""/></div>)}</div>)}</div></div></section>
 <section className="approach" id="approach"><p className="eyebrow">A PARTNER IN WHAT COMES NEXT</p><h2><TextBlurIn as="span" className="heading-blur-line" by="word">What you create matters.</TextBlurIn><em className="heading-blur-line"><TextBlurIn as="span" by="word" delay={.16}>So does how you live.</TextBlurIn></em></h2><p>You want to bring something meaningful into the world. Let’s make room for the freedom, growth, and enjoyment you want along the way.</p></section>
 <CoachingSection moving={moving}/>
 <AIMentoringSection/>
 <section className="journey" id="journey">{journeyVideo?<video ref={video} muted loop playsInline autoPlay={moving} preload="none" poster="hero/assets/journey.png" aria-hidden="true"><source src={journeyVideo} type="video/mp4"/></video>:<img src="hero/assets/journey.png" alt="" loading="lazy"/>}<div><p className="eyebrow">JOURNEY · LIFE AS A GAME</p><h2><TextBlurIn as="span" className="heading-blur-line" by="word">Your life.</TextBlurIn><TextBlurIn as="span" className="heading-blur-line" by="word" delay={.14}>An adventure worth choosing.</TextBlurIn></h2><p className="journey-description">What changes when you look at life as a game? You can step back, become less afraid of failure, and take more ownership of the game you’re playing.</p><p className="journey-description">Journey brings that perspective into an adventure experience: a way to explore growth, choose your next steps, and have more fun in the process.</p><a className="button" href="https://journey.jantrautwein.com">Learn More <span aria-hidden="true">↗</span></a></div></section>
 </main><footer>Hero exploration · Provisional copy · Local preview</footer>
 </div>
}
const root=document.getElementById("root");
createRoot(root).render(root.dataset.page==="coaching"?<CoachingPage/>:<HomePage/>);


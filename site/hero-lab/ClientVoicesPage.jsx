import React, { useState } from "react";
import { SiteFooter } from "./SiteFooter";

const voices=[
 {name:"Katie Doherty",role:"Creative Entrepreneur",image:"katie-doherty-illustrated-v2.png",quote:"Jan has a holistic approach. He does not just focus on business strategy, but also on identifying core fears, limiting beliefs, and the deeper issues that can hold you back. With his guidance and accountability, I gained clarity and momentum again."},
 {name:"Sebastian",role:"Coach and Facilitator",image:"sebastian-illustrated-v2.png",quote:"Jan has an unusual combination: a lot of love and a very centered, stable energy. Whatever I shared, there was nothing wrong or shameful. That is quite unique."},
 {name:"Stefanie Baisch",role:"Educator",image:"stefanie-baisch-illustrated-v1.png",quote:"A year has passed since my final coaching session with Jan. What is striking is how I have managed to integrate new structures and ways of thinking into my life. These changes feel less like theoretical concepts and more like second nature."},
 {name:"Oliver Löwe",role:"Business Executive",image:"oliver-loewe-illustrated-v1.png",quote:"The last 20 years I worked very hard and yet something was missing. Already in the first session with Jan my eyes were opened. After ten months I finally feel free again and can enjoy my life again."}
];

export function ClientVoicesPage(){
 const [active,setActive]=useState(0);const voice=voices[active];
 return <div className="page client-voices-page"><header className="nav voices-nav"><a className="brand" href="index.html"><span aria-hidden="true">△</span> Jan Trautwein</a><nav aria-label="Main navigation"><a href="coaching.html">Coaching</a><a aria-current="page" href="client-voices.html">Client voices</a><a href="story.html">My Story</a><a href="index.html#ai">AI mentoring</a><a href="contact.html" className="nav-contact">Let’s talk <span aria-hidden="true">↗</span></a></nav></header><main className="voices-page-main"><section><p className="eyebrow">CLIENT VOICES</p><h1>What clients say.</h1><p>Choose a portrait to read their experience of working with me.</p></section><section className="voices-page-grid"><div className="voices-page-portraits">{voices.map((item,index)=><button key={item.name} className={active===index?"active":""} onClick={()=>setActive(index)} onMouseEnter={()=>setActive(index)}><img src={`main-concept/assets/testimonials/${item.image}`} alt=""/><span>{item.name}</span></button>)}</div><article aria-live="polite"><span>0{active+1} / 0{voices.length}</span><blockquote>“{voice.quote}”</blockquote><p><strong>{voice.name}</strong><br/>{voice.role}</p></article></section></main><SiteFooter/></div>;
}

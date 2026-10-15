import React from "react";
import { TextBlurIn } from "./components/ui/text-blur-in";

const examples=[
 {number:"01",title:"Content production & scheduling",text:"Explore how to automate parts of creating, editing, repurposing, and scheduling your content."},
 {number:"02",title:"Websites & apps",text:"Build tools for yourself, your business, or your clients, shaped around what you actually need."},
 {number:"03",title:"Agents as personal assistants",text:"Find ways to get support with email, scheduling, research, and the recurring tasks that fill your day."}
];

export function AIMentoringSection(){
 return <section className="ai-mentoring" id="ai" aria-labelledby="ai-heading">
  <div className="ai-intro">
   <p className="eyebrow">02 · AI MENTORING</p>
   <h2 id="ai-heading"><TextBlurIn as="span" className="heading-blur-line" by="word">A more effective business.</TextBlurIn><em className="heading-blur-line"><TextBlurIn as="span" by="word" delay={.14}>More fun to run.</TextBlurIn></em></h2>
   <p>We start with me looking over your shoulder: seeing how you work, what takes your time, and what you keep doing yourself.</p>
   <p>Together, we identify where AI could make a real difference, which processes you no longer need to handle manually, and what you could create with the time and energy you get back.</p>
   <p className="ai-beta">AI has changed how I work and live. I’m now opening this up to a few first clients, combining mentoring with practical implementation where it makes sense.</p>
   <a className="quiet-link" href="contact.html">Let’s explore what’s possible <span aria-hidden="true">↗</span></a>
  </div>
  <div className="ai-examples" aria-label="Examples of what we could explore"><p className="eyebrow">WHAT COULD THIS LOOK LIKE?</p>{examples.map(({number,title,text})=><article key={number}><span className="example-number" aria-hidden="true">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
 </section>
}

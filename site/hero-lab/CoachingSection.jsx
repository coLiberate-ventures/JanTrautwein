import React from "react";
import { motion } from "motion/react";
import { TextBlurIn } from "./components/ui/text-blur-in";

// Working language for Jan to review, not a finalized description of his process.
const themes = [
 {number:"01",title:"Stay focused. Follow through.",text:"Get clear on what matters, stay focused when distractions pull you away, and take action on the things you tend to put off. You have someone who holds you accountable to what you choose to commit to."},
 {number:"02",title:"Challenge your thinking. Grow beyond comfort.",text:"I question your assumptions and help you see possibilities you might be missing. Together, we explore where your comfort zone is keeping you small and what it would look like to step beyond it."},
 {number:"03",title:"A second pair of eyes. Another mind at work.",text:"Bring the decisions, ideas, and problems you’re working on. You have a creative problem solving partner to look at things with you, think through options, and come up with solutions together."},
 {number:"04",title:"Design a better game to play.",text:"Look at the story you’re telling about yourself, the rules you’re living by, and what you’re working toward. We can question those rules, create better ones, and shape a game that makes room for meaningful progress, freedom, and enjoyment."}
];

export function CoachingSection({moving}) {
 return <section className="coaching-section" id="coaching" aria-labelledby="coaching-heading">
  <motion.div className="coaching-layout" initial={moving?{opacity:0,y:18}:false} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} animate={!moving?{opacity:1,y:0}:undefined} transition={{duration:moving?.65:0}}>
   <div className="coaching-intro">
    <p className="eyebrow">01 · PERSONAL COACHING</p>
    <h2 id="coaching-heading"><TextBlurIn as="span" className="heading-blur-line" by="word">You don’t have to</TextBlurIn><TextBlurIn as="span" className="heading-blur-line" by="word" delay={.12}>figure it all out</TextBlurIn><em className="heading-blur-line"><TextBlurIn as="span" by="word" delay={.24}>on your own.</TextBlurIn></em></h2>
    <p className="coaching-note">Meaningful work.<br/>More freedom.<br/>A life that feels like yours.</p>
    <div className="coaching-signature"><span aria-hidden="true">△</span><span>Jan Trautwein<br/><small>Personal coaching since 2018</small></span></div>
   </div>
   <div className="coaching-detail">
    <h3>A committed partner.<br/>Real change.</h3>
    <p className="coaching-description">You’re building something that matters to you. And you want the life around it to feel meaningful too.</p>
    <p className="coaching-description">You have a partner who challenges your thinking, holds you accountable, and helps you follow through. A second pair of eyes and another mind working alongside yours to find creative solutions.</p>
    <div className="coaching-themes" aria-label="Themes we can explore together">{themes.map(({number,title,text})=><details className="coaching-theme" key={number}><summary><span className="theme-number">{number}</span><span>{title}</span><span className="theme-toggle" aria-hidden="true"/></summary><p>{text}</p></details>)}</div>
    <div className="coaching-invitation"><p>Curious about working together?</p><a className="button" href="contact.html">Let’s have a conversation <span aria-hidden="true">↗</span></a></div>
   </div>
  </motion.div>
 </section>
}

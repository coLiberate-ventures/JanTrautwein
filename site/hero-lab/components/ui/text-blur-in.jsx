import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

export function TextBlurIn({
 children,
 className,
 duration=0.8,
 delay=0,
 by="word",
 staggerDelay=0.04,
 as="p",
 ...props
}){
 const reduced=useReducedMotion();
 const units=by==="word"?children.split(" "):children.split("");
 const Component=as==="span"?motion.span:motion.p;
 return <Component className={cn(className)} aria-label={children} {...props}>
  {units.map((unit,index)=><motion.span
   key={`${unit}-${index}`}
   aria-hidden="true"
   initial={reduced?false:{opacity:0,filter:"blur(10px)"}}
   whileInView={{opacity:1,filter:"blur(0px)"}}
   viewport={{once:true,amount:.55}}
   transition={{duration:reduced?0:duration,delay:reduced?0:delay+index*staggerDelay}}
   style={{display:"inline-block"}}
  >{unit===" "?"\u00A0":unit}{by==="word"&&index<units.length-1&&"\u00A0"}</motion.span>)}
 </Component>;
}

export default TextBlurIn;

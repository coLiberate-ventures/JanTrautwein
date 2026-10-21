import React, { useState } from "react";
import { SiteFooter } from "./SiteFooter";

const endpoint="https://api.web3forms.com/submit";
const accessKey="a077514e-a332-4b1d-aa27-c6aaafed462a";

export function ContactPage(){
 const [status,setStatus]=useState("idle");
 const submit=async event=>{
  event.preventDefault();
  setStatus("sending");
  try{
   const form=event.currentTarget;
   const data=new FormData(form);
   data.set("access_key",accessKey);
   data.set("subject","New message from jantrautwein.com");
   data.set("from_name","jantrautwein.com contact form");
   const response=await fetch(endpoint,{method:"POST",headers:{Accept:"application/json"},body:data});
   const result=await response.json().catch(()=>({}));
   if(!response.ok||result.success!==true)throw new Error("Form delivery failed");
   form.reset();setStatus("sent");
  }catch{setStatus("error");}
 };
 return <div className="page contact-page">
  <header className="nav contact-nav"><a className="brand" href="index.html"><span aria-hidden="true">△</span> Jan Trautwein</a><nav aria-label="Main navigation"><a href="coaching.html">Coaching</a><a href="client-voices.html">Client voices</a><a href="story.html">My Story</a><a href="index.html#ai">AI mentoring</a><a href="index.html#journey">Journey</a></nav></header>
  <main className="contact-main"><section className="contact-intro"><p className="eyebrow">CONTACT</p><h1>Let’s connect.</h1><p>Send a message, or contact me on Telegram.</p></section><section className="contact-options"><a href="https://t.me/jantrautwein" target="_blank" rel="noreferrer"><span>01</span><h2>Message on Telegram</h2><p>Quick and direct.</p><b>Open Telegram <i aria-hidden="true">↗</i></b></a><div><span>02</span><h2>Send a message</h2><form onSubmit={submit}><label>Name<input name="name" autoComplete="name" required/></label><label>Email<input name="email" type="email" autoComplete="email" required/></label><label>Message<textarea name="message" required/></label><button className="button" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending":"Send message"} <span aria-hidden="true">↗</span></button>{status==="sent"&&<p className="form-feedback success">Your message has been sent.</p>}{status==="error"&&<p className="form-feedback error">Message delivery failed. Please use Telegram.</p>}</form></div></section></main><SiteFooter/>
 </div>;
}

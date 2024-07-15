"use client";
import React, { useRef, useState, FormEvent, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FiArrowRight, FiMail, FiMessageSquare, FiCheck, FiX } from "react-icons/fi";
import { SiGithub, SiTwitch, SiTwitter, SiYoutube } from "react-icons/si";
import emailjs from "@emailjs/browser";
import Notification from "@/components/Notification";

const blockVariants = { initial: { scale: 0.5, y: 50, opacity: 0 }, animate: { scale: 1, y: 0, opacity: 1 } };
const RATE_LIMIT_DURATION = 60000;

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ success: false, error: false, sending: false });
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const [notification, setNotification] = useState({ isVisible: false, message: '' });
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const storedTime = localStorage.getItem('lastSubmissionTime');
    if (storedTime) setLastSubmissionTime(parseInt(storedTime, 10));
  }, []);

  const sendEmail = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmissionTime < RATE_LIMIT_DURATION) {
      setFormState({ success: false, error: true, sending: false });
      setNotification({ isVisible: true, message: `Please wait ${Math.ceil((RATE_LIMIT_DURATION - (now - lastSubmissionTime)) / 1000)} seconds before submitting again.` });
      return;
    }
    setFormState({ success: false, error: false, sending: true });
    if (form.current) {
      const message = (form.current.elements.namedItem('user_message') as HTMLTextAreaElement)?.value.trim();
      const email = (form.current.elements.namedItem('user_email') as HTMLInputElement)?.value.trim();
      if (!message || !email) {
        setFormState({ success: false, error: true, sending: false });
        return;
      }
      emailjs.sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        form.current,
        process.env.NEXT_PUBLIC_PUBLIC_KEY!
      )
        .then(() => {
          setFormState({ success: true, error: false, sending: false });
          setLastSubmissionTime(now);
          localStorage.setItem('lastSubmissionTime', now.toString());
          form.current?.reset();
        })
        .catch(() => setFormState({ success: false, error: true, sending: false }));
    }
  }, [lastSubmissionTime]);

  interface BlockProps extends MotionProps { className?: string; }
  const Block: React.FC<BlockProps> = ({ className, ...rest }) => (
    <motion.div variants={blockVariants} transition={{ type: "spring", mass: 3, stiffness: 400, damping: 50 }}
      className={twMerge("col-span-4 rounded-lg border border-black bg-transparent p-6", className)} {...rest} />
  );

  interface SocialBlockProps { href: string; icon: React.ReactNode; bgColor: string; }
  const SocialBlock: React.FC<SocialBlockProps> = ({ href, icon, bgColor }) => (
    <Block whileHover={{ rotate: "2.5deg", scale: 1.1 }} className={`col-span-6 ${bgColor} md:col-span-3`}>
      <Link href={href} target="_blank" className="grid h-full place-content-center text-3xl text-white">{icon}</Link>
    </Block>
  );

  return (
    <div className="relative h-full overflow-scroll">
      <div className="relative z-10 bg-transparent bg-opacity-70 p-20 text-zinc-50 font-Mystery">
        <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.05 }}
          className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4">
          <Block className="col-span-12 row-span-2 md:col-span-6">
            <Image src='/Ghost.png' height={120} width={120} alt="avatar" className="mb-4 rounded-full" />
            <h1 className="mb-12 md:text-2xl xl:text-4xl sm:text-sm font-medium leading-tight">
              Welcome to Our contact page. <span className="text-zinc-400">We are a Ghostly game studio.</span>
            </h1>
            <Link href="https://store.steampowered.com/app/2934090/Onibi/" target="_blank"
              className="flex items-center gap-1 text-red-300 hover:underline">
              Steam Page <FiArrowRight />
            </Link>
          </Block>
          <SocialBlock href="https://www.youtube.com/@AniflowInteractive" icon={<SiYoutube />} bgColor="bg-red-500" />
          <SocialBlock href="https://github.com/aug16th" icon={<SiGithub />} bgColor="bg-green-600" />
          <SocialBlock href="https://www.twitch.tv/aug16th" icon={<SiTwitch />} bgColor="bg-[#815fc1]" />
          <SocialBlock href="https://x.com/aniflowstudios" icon={<SiTwitter />} bgColor="bg-blue-500" />
          <Block className="col-span-12 xl:text-3xl md:text-2xl sm:text-lg leading-snug">
            <p>Our passion is to build games. <span className="text-zinc-400">We build stunning games that you can never imagine but we promise to deliver our content. Happy Gaming ~_~</span></p>
          </Block>
          <Block className="col-span-12 flex flex-col items-center gap-4 md:col-span-12 xl:col-span-12">
            <FiMessageSquare className="text-3xl" />
            <p className="text-center text-lg text-zinc-400">Write Here</p>
          </Block>
          <Block className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12">
            <p className="mb-3 xl:text-lg md:text-lg sm:text-sm">Contact Us</p>
            <form onSubmit={sendEmail} ref={form} className="flex flex-col gap-4">
              <textarea name="user_message" placeholder="Enter your Message" className="h-32 rounded border border-zinc-700 bg-zinc-800 px-3 py-2 transition-colors focus:border-red-300 focus:outline-0 resize-none"
                style={{ minHeight: '32px', maxWidth: "100%" }} onChange={(e) => { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`; }} />
              <input type="email" name="user_email" placeholder="Enter your email" className="rounded h-[50px] border border-zinc-700 bg-zinc-800 px-3 py-2 transition-colors focus:border-red-300 focus:outline-0" style={{ maxWidth: "100%" }} />
              <button type="submit" className={`whitespace-nowrap h-[50px] flex justify-center items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors
                ${formState.success ? "bg-green-500 text-white" : formState.error ? "bg-red-500 text-white" : "bg-zinc-50 text-zinc-900 hover:bg-zinc-300"}`} disabled={formState.sending}>
                {formState.success ? <FiCheck /> : formState.error ? <FiX /> : <FiMail />}
                {formState.sending ? "Sending..." : formState.error ? "Failed" : "Send"}
              </button>
            </form>
          </Block>
        </motion.div>
        <footer className="mt-12 text-center text-zinc-500">&copy; {new Date().getFullYear()} Aniflow. All rights reserved.</footer>
      </div>
      <Notification message={notification.message} isVisible={notification.isVisible} onClose={() => setNotification({ isVisible: false, message: '' })} />
    </div>
  );
};

export default Contact;
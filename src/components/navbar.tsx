"use client"

import React, { useState,} from "react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./navlinks";
import Button from "./button";
import { FaHome, FaMailBulk, FaGamepad } from "react-icons/fa";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SiDiscord, SiTwitch, SiSteam } from "react-icons/si";
import { IconType } from "react-icons";

interface LinkItem {
  url: string;
  icon: IconType;
}

interface SocialLinkItem extends LinkItem {
  hoverGradient: string;
}

const links: LinkItem[] = [
  { url: "/", icon: FaHome },
  { url: "/Game/", icon: FaGamepad },
  { url: "/contact/", icon: FaMailBulk },
];

const socialLinks: SocialLinkItem[] = [
  {
    url: "https://discord.gg/vGCjA32myP",
    icon: SiDiscord,
    hoverGradient:
      "linear-gradient(to right, #7289DA 100%, transparent 100%)",
  },
  {
    url: "https://www.twitch.tv/aug16th",
    icon: SiTwitch,
    hoverGradient:
      "linear-gradient(to right, #815fc1 100%, transparent 100%)",
  },
  {
    url: "https://store.steampowered.com/app/2934090/Onibi/",
    icon: SiSteam,
    hoverGradient: "linear-gradient(to right, #2a475e  100%, transparent 100%)",
  },
];

const menuVariants: Record<string, Variants> = {
  top: {
    closed: { rotate: 0 },
    opened: { rotate: 45, backgroundColor: "rgb(255,255,255)" },
  },
  center: {
    closed: { opacity: 1 },
    opened: { opacity: 0 },
  },
  bottom: {
    closed: { rotate: 0 },
    opened: { rotate: -45, backgroundColor: "rgb(255,255,255)" },
  },
};

const listVariants = {
    closed: { x: "100vw" },
    opened: {
      rotate: 100,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 10,
        staggerChildren: 0.1, rotate: 100,
        duration: 5,
      },
    },
  };

const listItemVariants: Variants = {
  closed: { x: -10, opacity: 0 },
  opened: { rotate: 360, x: 0, opacity: 1 },
};

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="h-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 text-xl text-white bg-black">
      <div className="hidden md:flex gap-4 w-1/3">
        {links.map((link, index) => (
          <NavLink link={link} key={index} />
        ))}
      </div>
      <div className="md:hidden lg:flex xl:w-1/3 xl:justify-center">
        <div className="logo-container relative flex items-center">
          <Link href="/" passHref>
            <motion.div
              className="relative bg-black text-white rounded-md flex md:right-20 items-center justify-center z-50 xl:right-32"
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
              animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            >
              <Image
                src="/Aniflow.svg"
                alt="Onibi-logo"
                height={110}
                width={110}
              />
            </motion.div>
          </Link>
        </div>
      </div>
      <div className="hidden md:flex gap-1">
        {socialLinks.map((link, index) => (
          <Link href={link.url} target="_blank" key={index}>
            <Button icon={link.icon} hoverGradient={link.hoverGradient} />
          </Link>
        ))}
      </div>
      <div className="md:hidden">
        <button
          className="w-10 h-5 flex flex-col justify-between z-50 relative"
          onClick={() => setOpen(!open)}
          style={{ zIndex: "60" }}
        >
          {["top", "center", "bottom"].map((part) => (
            <motion.div
              key={part}
              variants={menuVariants[part]}
              animate={open ? "opened" : "closed"}
              className="w-7 h-1 bg-white rounded origin-left"
            />
          ))}
        </button>
        <AnimatePresence>
  {open && (
    <motion.div
      variants={listVariants}
      initial="closed"
      animate="opened"
      className="absolute top-0 left-0 w-screen h-screen bg-white text-white flex flex-col items-center justify-center gap-12 text-4xl"
      style={{ zIndex: "50" }}
    >
      {links.map((link, index) => (
        <motion.div variants={listItemVariants} className="" key={index}>
          <Link href={link.url}>
            <link.icon className="text-4xl text-black rotate-[260deg] top-12 right-10 relative" />
          </Link>
        </motion.div>
      ))}
      <motion.div variants={listVariants} className="relative  flex gap-12 text-black left-32 bottom-32">
        {socialLinks.map((link, index) => (
          <Link href={link.url} target="_blank" key={index}>
            <link.icon className="rotate-[160deg]" />
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
};

export default Navbar;
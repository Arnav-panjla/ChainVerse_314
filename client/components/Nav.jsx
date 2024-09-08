"use client"
import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import logo from '@public/assets/logo.png';
import { FaHome } from "react-icons/fa";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";

const Nav = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { href: "/home", icon: FaHome, name: "Home" },
    { href: "/chat", icon: BsFillChatSquareDotsFill, name: "Chat" },
    { href: "/post", icon: MdOutlinePostAdd, name: "Post" },
    { href: "/del", icon: FaUserFriends, name: "Friends" },
    { href: "/add", icon: IoMdPersonAdd, name: "Add Friend" },
  ];

  return (
    <header 
      className={`fixed z-100 top-0 left-0 h-screen bg-gray-900 transition-all duration-300 ${isExpanded ? 'w-48' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col items-center h-full py-8">
        <Link href="/" className="text-2xl relative hover:text-blue-400 transition-all duration-200">
          <Image src={logo} 
          alt="Logo" 
          width={100}
          height={100}
          className="w-20 h-20 mb-16 rounded-lg" />
        </Link>
        <nav className="flex flex-col space-y-8 text-gray-300 text-xl">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center relative hover:text-blue-400 transition-all duration-200">
              <item.icon className="text-2xl" />
              {isExpanded && <span className="ml-4">{item.name}</span>}
              <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-blue-400 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Nav;
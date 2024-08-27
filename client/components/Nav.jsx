"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MdMenu, MdClose } from 'react-icons/md'; // Importing icons from react-icons/md
import logo from '@public/assets/logo.png'; 

const Nav = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  
    return (
        <div className="z-30">
            <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-screen bg-black">
                <div className="container flex justify-between items-center h-full my-2">
                <div className="flex items-center space-x-8">
                    <Image src={logo} alt="Logo" className="w-[7vh] h-[7vh] ml-4" />
                    <h1 className="text-white text-3xl font-bold">ChainVerse</h1>
                </div>
                <nav className="hidden md:flex space-x-4 text-white text-xl ">
                    <Link
                    href="/"
                    className="text-2xl ml-6 text-white relative hover:text-neonBlue  transition-all duration-200"
                    >
                    Home
                    <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </Link>
                    <Link
                    href="/chat"
                    className="text-2xl ml-6 text-white relative hover:text-neonBlue  transition-all duration-200"
                    >
                    Chats
                    <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </Link>
                </nav>
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMobileMenu} className="text-white focus:outline-none mr-4">
                    {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                    </button>
                </div>
                </div>
                {isMobileMenuOpen && (
                <div className="relative  w-full h-screen ">    
                    <div className="md:hidden flex flex-col  bg-black w-full h-screen py-[2vh]  left-0">
                        <div className="mb-4 w-full h-[2px] bg-white bg-opacity-80"></div>
                        <Link
                        href="/"
                        className="text-2xl ml-6 text-white relative hover:text-neonBlue  transition-colors duration-200"
                        onClick={toggleMobileMenu}
                        >
                        Home
                        <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
                        </Link>
                        <div className="my-4 w-full h-[2px] bg-white bg-opacity-80"></div>
                        <Link
                        href="/chat"
                        className="text-2xl ml-6 text-white relative hover:text-neonBlue  transition-colors duration-200"
                        onClick={toggleMobileMenu}
                        >
                       Chats
                        <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
                        </Link>
                        <div className="my-4 w-full h-[2px] bg-white bg-opacity-80"></div>
                    </div>
                </div>
                )}
            </header>
        </div>
    );
  };

export default Nav
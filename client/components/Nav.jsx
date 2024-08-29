"use client";

import Link from "next/link";
import Image from "next/image";
import logo from '@public/assets/logo.png'; 

import { FaHome } from "react-icons/fa";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";

const Nav = () => {
    return (
        <div className="z-30">
            <header className="fixed top-0 left-0 w-[80px] h-screen bg-black">
                <div className="flex flex-col items-center h-full py-8">
                    <Link
                            href="/"
                            className="text-2xl relative hover:text-neonBlue transition-all duration-200"
                        >
                        <Image src={logo} alt="Logo" className="w-[7vh] h-[7vh] mb-16" />
                    </Link>
                    <nav className="flex flex-col space-y-8 text-white text-xl">
                        <Link
                            href="/"
                            className="text-2xl relative hover:text-neonBlue transition-all duration-200"
                        >
                            <FaHome/>
                            <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
                        </Link>
                        <Link
                            href="/search"
                            className="text-2xl relative hover:text-neonBlue transition-all duration-200"
                        >
                            <IoSearch />
                            <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
                        </Link>
                        <Link
                            href="/chat"
                            className="text-2xl relative hover:text-neonBlue transition-all duration-200"
                        >
                            <BsFillChatSquareDotsFill />
                            <div className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-neonBlue transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
                        </Link>
                        {/* Add more links as needed */}
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Nav;

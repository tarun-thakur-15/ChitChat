"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  ChevronDown,
  User,
  ArrowRight,
  Search,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { logoutApi } from "@/app/services/api";
import { toast } from "sonner";
import Image from "next/image";
import { MeResponse } from "@/app/services/schema";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import ChatShat from "../app/images/ChatShat.png";
import DefaultProfileImage from "../app/images/business-man.png";
import { startProgress } from "@/app/utils/progress";
interface HeaderProps {
  isLoggedInParent: boolean;
  user?: MeResponse["user"];
}

const handleLogout = async () => {
  try {
    const data = await logoutApi();
    toast.success(data.message || "Logged out successfully");
    window.location.reload();
  } catch (err: any) {
    console.error("Logout error:", err);
    toast.error(err.response?.data?.message || "Logout failed");
  }
};

export default function Header({ isLoggedInParent, user }: HeaderProps) {
  const [isLoggedin, setIsLoggedin] = useState(true);
  const [activeMenu, setActiveMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const isDark = theme === "dark";
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleClick = (e: any) => {
    setIsHamburgerMenuVisible(!isHamburgerMenuVisible);
    // e.preventDefault();
    setActiveMenu(!activeMenu);
    toggleMenu();
  };
  const navItems = [
    {
      id: "/notifications",
      label: "Notifications",
      icon: <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
    },
    { id: "/settings", label: "Settings", icon: <Settings /> },
  ];
  console.log("logged in user details:- ", user);
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {isLoggedin && user ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo + Project Name */}
          {/* <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              ChatWave
            </span>
          </div> */}
          <Link href={"/dashboard"}>
            <Image
              src={ChatShat}
              alt="ChatShat"
              className="h-[50px] w-[50px]"
            />
          </Link>

          {/* Right: Profile + Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden lg:flex items-center gap-2 focus:outline-none">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                  <Image
                    height={40}
                    width={40}
                    src={user.profileImage || DefaultProfileImage}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                  />
                </div>
                <span className="hidden sm:block text-gray-900 dark:text-white font-medium">
                  {user.fullName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="hidden lg:block w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  NProgress.start();
                  router.push("/my-profile");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
            {/* ---------hamburger div for mobile screens---------- */}

            <div className="hamburger lg:hidden z-50">
              <a
                className={`${activeMenu ? "active-menu" : ""} main-nav-toggle`}
                href="#"
                onClick={handleClick}
              >
                <i>Menu</i>
              </a>
            </div>

            {/* -------sliding div onclicking hamburger icon--------- */}
            {isHamburgerMenuVisible && (
              <div
                data-testid="mobile-menu"
                className={` fixed top-0 left-0 h-full w-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-0 z-40 ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="flex flex-col justify-center items-center  space-y-6  h-full">
                  <div className="h-[calc(100vh-115px)] flex-col justify-start items-start gap-[14px] flex w-full px-[20px] pt-[90px] overflow-y-scroll">
                    {" "}
                    {isLoggedInParent && (
                      <>
                        <div className="flex md:hidden items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-white">
                            User
                          </span>
                        </div>

                        {navItems.map((tab: any, index: number) => (
                          <Link
                            key={index}
                            href={tab.id}
                            className="self-stretch border-b-[#edeef0] justify-between items-center inline-flex"
                            onClick={handleClick}
                          >
                            <span className="text-center text-[#1e1f23] dark:text-white text-sm font-medium  tracking-wide ">
                              {tab.label}
                            </span>
                            <div className="h-[24px] w-[24px]">
                              <ArrowRight className="w-5 h-5 fill-[#2F3034]" />
                            </div>
                          </Link>
                        ))}

                        <button
                          onClick={handleLogout}
                          className="self-stretch border-b-[#edeef0] justify-between items-center inline-flex text-center text-[#1e1f23] text-sm font-medium  tracking-wide dark:text-white"
                        >
                          Logout
                        </button>
                      </>
                    )}
                    <div className="flex items-center gap-2 md:hidden">
                      <span className="text-sm">
                        {isDark ? "Dark" : "Light"}
                      </span>
                      <Switch
                        checked={isDark}
                        onCheckedChange={(checked) =>
                          setTheme(checked ? "dark" : "light")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="hidden lg:flex">
              <ThemeToggle />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/friend-requests" onClick={()=> startProgress()} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Friend Requests</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      onClick={() => startProgress()}
                      href={"/search"}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DropdownMenu>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={"/"}>
            <Image
              src={ChatShat}
              alt="ChatShat"
              className="h-[50px] w-[50px]"
            />
          </Link>
          <div className="flex">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

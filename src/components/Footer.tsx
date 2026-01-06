import React from "react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
    const { theme } = useTheme();

    const navLinks = [
        {
            title: "关于我们",
            links: ["平台介绍", "团队成员", "加入我们", "联系方式"]
        },
        {
            title: "帮助中心",
            links: ["新手指南", "交易流程", "常见问题", "投诉建议"]
        },
        {
            title: "交易保障",
            links: ["验机标准", "质保政策", "退换货政策", "安全支付"]
        },
        {
            title: "商务合作",
            links: ["商家入驻", "品牌合作", "广告投放", "API合作"]
        }
    ];

    const socialIcons = [
        { name: "微信", icon: "fa-weixin", color: "text-green-500" },
        { name: "微博", icon: "fa-weibo", color: "text-red-500" },
        { name: "抖音", icon: "fa-music", color: "text-black" },
        { name: "小红书", icon: "fa-book", color: "text-red-400" }
    ];

    // 动画变体
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const iconVariants = {
        hover: { scale: 1.2, rotate: 5 },
        tap: { scale: 0.9 }
    };

    return (
        <footer className={`transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div className="md:col-span-1" variants={itemVariants}>
                        <div className="flex items-center mb-4">
                            <motion.i 
                                className="fas fa-industry text-blue-700 text-2xl mr-2"
                                whileHover={{ rotate: 10 }}
                                transition={{ duration: 0.3 }}
                            ></motion.i>
                            <span className="font-bold text-xl">昌盛</span>
                        </div>
                        <p className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            环保科技，循环利用 - 专业二手设备交易平台，让每一台设备都能发挥最大价值。
                        </p>
                        <div className="flex space-x-4">
                            {socialIcons.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    className={`text-xl hover:opacity-80 transition-opacity ${social.color}`}
                                    aria-label={social.name}
                                    variants={iconVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <i className={`fab ${social.icon}`}></i>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    
                    {navLinks.map((group, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
                            <ul className="space-y-2">
                                {group.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <motion.a
                                            href="#"
                                            className={`hover:text-blue-500 transition-colors ${theme === "dark" ? "text-gray-400 hover:text-blue-400" : ""}`}
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            
            <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></div>
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                        © {new Date().getFullYear()} BlowMoldTech. 保留所有权利。
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <motion.a
                            href="#"
                            className={`text-sm hover:text-blue-500 transition-colors ${theme === "dark" ? "text-gray-500 hover:text-blue-400" : "text-gray-600"}`}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            隐私政策
                        </motion.a>
                        <motion.a
                            href="#"
                            className={`text-sm hover:text-blue-500 transition-colors ${theme === "dark" ? "text-gray-500 hover:text-blue-400" : "text-gray-600"}`}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            用户协议
                        </motion.a>
                        <motion.a
                            href="#"
                            className={`text-sm hover:text-blue-500 transition-colors ${theme === "dark" ? "text-gray-500 hover:text-blue-400" : "text-gray-600"}`}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            免责声明
                        </motion.a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
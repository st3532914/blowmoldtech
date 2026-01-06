import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { motion } from "framer-motion";
import { DeviceCard } from "@/components/DeviceCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";

const FEATURED_DEVICES = [{
    id: "1",
    name: "PET全自动吹瓶机PET-1200",
    category: "PET吹塑设备",
    price: 189000,
    originalPrice: 245000,
    condition: "9成新",

    images: [
        "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20blowing%20machine%20production%20line%2C%20industrial%20equipment%2C%20factory%20setting%2C%20high%20quality%2C%20professional%20photography&sign=1e2786fa29c0bad675a4626fe0db24a4"
    ],

    sellerType: "platform",
    sellerName: "BlowMoldTech自营",
    location: "上海",
    warranty: "1年",
    viewCount: 432,
    isFeatured: true
}, {
    id: "2",
    name: "PET吹塑成型机PET-800",
    category: "PET吹塑设备",
    price: 145000,
    originalPrice: 198000,
    condition: "8.5成新",

    images: [
        "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=PET%20bottle%20production%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=565fc1a635ba9d2f450b3728d523b7db"
    ],

    sellerType: "platform",
    sellerName: "BlowMoldTech自营",
    location: "广州",
    warranty: "1年",
    viewCount: 321,
    isFeatured: true
}, {
    id: "3",
    name: "注塑机IM-1000",
    category: "注塑设备",
    price: 98000,
    originalPrice: 135000,
    condition: "9成新",

    images: [
        "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=plastic%20injection%20molding%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=2dffdde1c6df615c8025320204291dba"
    ],

    sellerType: "user",
    sellerName: "远大塑业",
    location: "深圳",
    warranty: "6个月",
    viewCount: 256,
    isFeatured: true
}, {
    id: "4",
    name: "全自动灌装机FM-500",
    category: "灌装设备",
    price: 168000,
    originalPrice: 210000,
    condition: "8成新",

    images: [
        "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=automatic%20liquid%20filling%20machine%2C%20industrial%20equipment%2C%20factory%20setting%2C%20professional%20photography&sign=a389435bd88a6ce5f6d7c2528273e688"
    ],

    sellerType: "user",
    sellerName: "诚信机械",
    location: "杭州",
    warranty: "3个月",
    viewCount: 189,
    isFeatured: true
}];

const PLATFORM_ADVANTAGES = [{
    icon: "fa-check-circle",
    title: "专业检测",
    description: "每台设备经过专业工程师30项严格检测，确保性能稳定"
}, {
    icon: "fa-shield-alt",
    title: "交易保障",
    description: "平台担保交易，提供专业合同和资金监管，安全可靠"
}, {
    icon: "fa-tools",
    title: "售后支持",
    description: "提供安装调试、技术培训和维修保养等完善服务"
}, {
    icon: "fa-exchange-alt",
    title: "灵活方案",
    description: "提供设备租赁、以旧换新、分期付款等多种合作模式"
}];

const CATEGORIES = [{
    id: "all",
    name: "全部设备",
    icon: "fa-th-large"
}, {
    id: "pet-blowing",
    name: "PET吹塑设备",
    icon: "fa-industry"
}, {
    id: "blow-molding",
    name: "吹塑机",
    icon: "fa-industry"
}, {
    id: "injection-molding",
    name: "注塑设备",
    icon: "fa-cogs"
}, {
    id: "filling",
    name: "灌装设备",
    icon: "fa-bottle-water"
}, {
    id: "water-treatment",
    name: "水处理设备",
    icon: "fa-water"
}, {
    id: "auxiliary",
    name: "配套设备",
    icon: "fa-tools"
}, {
    id: "parts",
    name: "配件耗材",
    icon: "fa-puzzle-piece"
}];

const BANNER_DATA = [{
    id: "1",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=industrial%20equipment%20exhibition%2C%20PET%20bottle%20blowing%20machines%20on%20display%2C%20professional%20setting%2C%20high%20quality%20photography&sign=7a4c402eef391d49810d17984c598d62",
    title: "2025工业设备展会",
    description: "参观我们的展台，了解最新吹塑设备技术",
    link: "/devices"
}, {
    id: "2",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=industrial%20factory%20with%20PET%20bottle%20blowing%20machine%20production%20line%2C%20modern%20technology%2C%20high%20quality%20photography&sign=d9537067a9b4c810abb5d2a9b7f13484",
    title: "专业设备特惠季",
    description: "自营设备满10万减5000，限时优惠",
    link: "/devices"
}, {
    id: "3",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=professional%20engineer%20inspecting%20industrial%20machinery%2C%20quality%20control%2C%20factory%20setting&sign=d4b1a235772185e0a5d043e1db5d1847",
    title: "专业认证服务",
    description: "设备认证享一年质保，专业工程师上门服务",
    link: "/about"
}];

const QUICK_ACCESS = [{
    id: "1",
    name: "限时特惠",
    icon: "fa-bolt",
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30"
}, {
    id: "2",
    name: "新品上架",
    icon: "fa-tag",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
}, {
    id: "3",
    name: "品牌专区",
    icon: "fa-crown",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
}, {
    id: "4",
    name: "租赁服务",
    icon: "fa-handshake",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30"
}, {
    id: "5",
    name: "技术支持",
    icon: "fa-headset",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
}, {
    id: "6",
    name: "金融服务",
    icon: "fa-credit-card",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
}];

export default function Home() {
    const {
        theme
    } = useTheme();

    const {
        isAuthenticated,
        user,
        login
    } = useContext(AuthContext);

    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showSearchHistory, setShowSearchHistory] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim()) {
            setSearchHistory(prev => {
                const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10);
                localStorage.setItem("searchHistory", JSON.stringify(newHistory));
                return newHistory;
            });

            navigate(`/devices?q=${encodeURIComponent(query)}`);
            setShowSearchHistory(false);
        }
    };

    useEffect(() => {
        const savedHistory = localStorage.getItem("searchHistory");

        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error("Failed to parse search history:", error);
            }
        }
    }, []);

    const clearSearchHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem("searchHistory");
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleLogin = () => {
        const mockUser = {
            id: "user_123",
            name: "塑料加工厂",
            email: "example@blowmoldtech.com",
            avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=factory%20owner%2C%20business%20profile%20picture%2C%20professional%20style&sign=7a7629b2b99eb4a0742afeef3cd759d4",
            isVerified: true,
            creditScore: 98,
            memberLevel: "钻石会员"
        };

        login(mockUser);
    };

    const handleDeviceClick = (deviceId: string) => {
        navigate(`/device/${deviceId}`);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex(prev => (prev + 1) % BANNER_DATA.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`min-h-screen w-full transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            {}
            <div
                className={`sticky top-0 z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex flex-col items-center">
                        {}
                        <div className="flex items-center mb-3">
                            <i className="fas fa-industry text-blue-700 text-2xl mr-2"></i>
                            <span className="font-bold text-xl">昌盛</span>
                        </div>
                        {}
                        <div className="relative w-full max-w-3xl">
                            <div className="relative z-10">
                                <SearchBar
                                    placeholder="搜索PET吹塑、注塑、灌装、水处理及配套设备..."
                                    onSearch={handleSearch}
                                    className="w-full" />
                            </div>
                            {}
                            {showSearchHistory && searchHistory.length > 0 && <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -10
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                                <div
                                    className="p-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium">搜索历史</span>
                                    <button
                                        onClick={clearSearchHistory}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500">清除
                                                            </button>
                                </div>
                                <ul>
                                    {searchHistory.map((item, index) => <li key={index}>
                                        <button
                                            onClick={() => handleSearch(item)}
                                            className={`w-full text-left p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center`}>
                                            <i className="fas fa-history text-gray-400 mr-2"></i>
                                            {item}
                                        </button>
                                    </li>)}
                                </ul>
                            </motion.div>}
                        </div>
                    </div>
                </div>
            </div>
            {}
            <div className="relative overflow-hidden">
                <div className="h-[300px] md:h-[400px] relative">
                    {BANNER_DATA.map((banner, index) => <motion.div
                        key={banner.id}
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: currentBannerIndex === index ? 1 : 0,

                            transition: {
                                duration: 0.5
                            }
                        }}
                        className={`absolute inset-0 w-full h-full ${currentBannerIndex === index ? "block" : "hidden"}`}>
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover" />
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                            <div className="px-6 md:px-12 max-w-lg">
                                <motion.h2
                                    initial={{
                                        x: -50,
                                        opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1
                                    }}
                                    transition={{
                                        delay: 0.2
                                    }}
                                    className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {banner.title}
                                </motion.h2>
                                <motion.p
                                    initial={{
                                        x: -50,
                                        opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1
                                    }}
                                    transition={{
                                        delay: 0.3
                                    }}
                                    className="text-white/90 mb-4">
                                    {banner.description}
                                </motion.p>
                                <motion.button
                                    initial={{
                                        x: -50,
                                        opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1
                                    }}
                                    transition={{
                                        delay: 0.4
                                    }}
                                    whileHover={{
                                        scale: 1.05
                                    }}
                                    whileTap={{
                                        scale: 0.95
                                    }}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                                    onClick={() => navigate(banner.link)}>立即查看
                                                      </motion.button>
                            </div>
                        </div>
                    </motion.div>)}
                    {}
                    <div
                        className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {BANNER_DATA.map((_, index) => <button
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentBannerIndex === index ? "bg-white w-8" : "bg-white/50"}`}
                            onClick={() => setCurrentBannerIndex(index)} />)}
                    </div>
                </div>
            </div>
            {}
            <div className={`py-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {QUICK_ACCESS.map(item => <motion.div
                            key={item.id}
                            whileHover={{
                                y: -5
                            }}
                            className="flex flex-col items-center justify-center">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${item.bgColor}`}>
                                <i className={`fas ${item.icon} text-xl ${item.color}`}></i>
                            </div>
                            <span className="text-sm">{item.name}</span>
                        </motion.div>)}
                    </div>
                </div>
            </div>
            {}
            <div className="sticky top-20 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <CategoryFilter
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategoryChange} />
            </div>
            {}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {}
                <motion.section
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2
                    }}
                    className="mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">为什么选择昌盛?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PLATFORM_ADVANTAGES.map((advantage, index) => <motion.div
                            key={index}
                            whileHover={{
                                y: -5
                            }}
                            className={`p-6 rounded-16 transition-all ${theme === "dark" ? "bg-gray-800 hover:bg-gray-750" : "bg-white shadow-lg hover:shadow-xl"}`}>
                            <div className="text-blue-600 text-3xl mb-4">
                                <i className={`fas ${advantage.icon}`}></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {advantage.description}
                            </p>
                        </motion.div>)}
                    </div>
                </motion.section>
                {}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold mr-2">限时特惠</h2>
                            <div
                                className="flex items-center px-2 py-0.5 bg-red-100 text-red-600 rounded text-sm">
                                <span className="mr-1">08</span>:<span className="mr-1">45</span>:<span>33</span>
                            </div>
                        </div>
                        <button
                            className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : ""}`}>更多优惠 <i className="fas fa-chevron-right text-sm"></i>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_DEVICES.map(device => <motion.div
                            key={device.id}
                            whileHover={{
                                y: -5
                            }}
                            className={`overflow-hidden rounded-16 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                            <div className="relative">
                                <img
                                    src={device.images[0]}
                                    alt={device.name}
                                    className="w-full h-48 object-cover" />
                                <div className="absolute top-0 left-0 w-16 h-16">
                                    <div
                                        className="bg-red-500 text-white text-xs font-bold transform -rotate-45 translate-x-[-25%] translate-y-[-25%] py-1 w-[140%] text-center">
                                        {Math.round((1 - device.price / device.originalPrice) * 100)}% OFF
                                                            </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium mb-2 line-clamp-2">{device.name}</h3>
                                <div className="flex items-baseline">
                                    <span className="text-red-500 font-bold text-lg">¥{device.price}</span>
                                    <span
                                        className={`text-sm line-through ml-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>¥{device.originalPrice}</span>
                                </div>
                            </div>
                        </motion.div>)}
                    </div>
                </section>
                {}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">平台认证设备</h2>
                        <button
                            className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : ""}`}>查看更多 <i className="fas fa-chevron-right text-sm"></i>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_DEVICES.filter(device => device.sellerType === "platform").map(device => <DeviceCard
                            key={device.id}
                            device={device}
                            onClick={() => handleDeviceClick(device.id)} />)}
                    </div>
                </section>
                {}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">企业直售设备</h2>
                        <button
                            className={`flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : ""}`}>查看更多 <i className="fas fa-chevron-right text-sm"></i>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_DEVICES.filter(device => device.sellerType === "user").map(device => <DeviceCard
                            key={device.id}
                            device={device}
                            onClick={() => handleDeviceClick(device.id)} />)}
                    </div>
                </section>
                {}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">品牌专区</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {["西门子", "ABB", "海天", "震雄", "伊之密", "克劳斯玛菲"].map((brand, index) => <motion.div
                            key={index}
                            whileHover={{
                                scale: 1.05
                            }}
                            className={`p-4 rounded-lg text-center ${theme === "dark" ? "bg-gray-800 hover:bg-gray-750" : "bg-white shadow hover:shadow-md"}`}>
                            <div
                                className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                                <i className="fas fa-cogs text-2xl text-blue-500"></i>
                            </div>
                            <span className="font-medium">{brand}</span>
                        </motion.div>)}
                    </div>
                </section>
                {}
                <motion.section
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.4
                    }}
                    className={`p-8 rounded-16 mb-12 ${theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-blue-50 to-indigo-50"}`}>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-4">加入昌盛会员</h2>
                        <p
                            className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>成为会员享受专属折扣、优先看货、技术支持等多重特权，让您的设备采购更加便捷。
                                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {isAuthenticated ? <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                                onClick={() => navigate("/profile")}>我的会员中心
                                                </button> : <>
                                <button
                                    className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                                    onClick={() => navigate("/login")}>立即登录
                                                      </button>
                                <button
                                    className={`px-6 py-3 rounded-full font-medium transition-colors ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-800 hover:bg-gray-100 shadow"}`}
                                    onClick={() => navigate("/register")}>免费注册
                                                      </button>
                            </>}
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
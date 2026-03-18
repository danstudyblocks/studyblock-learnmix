import { v4 as uuidv4 } from "uuid";

//home one slider
import homeHeorSliderImg1 from "@/public/images/hero_slider_img_1.png";
import homeHeorSliderImg2 from "@/public/images/hero_slider_img_2.png";
import homeHeorSliderImg3 from "@/public/images/hero_slider_img_3.png";
import homeHeorSliderImg4 from "@/public/images/hero_slider_img_4.png";

//expert img slider
import expertImgSlider1 from "@/public/images/expert_slider_img_1.png";
import expertImgSlider2 from "@/public/images/expert_slider_img_2.png";
import expertImgSlider3 from "@/public/images/expert_slider_img_3.png";
import expertImgSlider4 from "@/public/images/expert_slider_img_4.png";
import expertImgSlider5 from "@/public/images/expert_slider_img_5.png";
import expertImgSlider6 from "@/public/images/expert_slider_img_6.png";

//small people image
import smallPeople1 from "@/public/images/people_small1.png";
import smallPeople2 from "@/public/images/people_small2.png";
import smallPeople3 from "@/public/images/people_small3.png";

//worker portfolio images
import portfolioImg1 from "@/public/images/worker-portfolio-img-1.png";
import portfolioImg2 from "@/public/images/worker-portfolio-img-2.png";
import portfolioImg3 from "@/public/images/worker-portfolio-img-3.png";
import portfolioImg4 from "@/public/images/worker-portfolio-img-4.png";

//blog post img
import blogImg1 from "@/public/images/blog-post-image-1.png";
import blogImg2 from "@/public/images/blog-post-image-2.png";
import blogImg3 from "@/public/images/blog-post-image-3.png";
import blogImg4 from "@/public/images/blog-post-image-4.png";
import blogImg5 from "@/public/images/blog-post-image-5.png";
import blogImg6 from "@/public/images/blog-post-image-6.png";
import React from "react";
import {
  PiBehanceLogo,
  PiBellSimpleRingingThin,
  PiCurrencyCircleDollar,
  PiCurrencyDollarSimpleBold,
  PiDownload,
  PiDownloadSimple,
  PiDribbbleLogo,
  PiFacebookLogo,
  PiFileTextBold,
  PiHandshake,
  PiHeadphonesThin,
  PiInstagramLogo,
  PiListChecks,
  PiLockBold,
  PiMoney,
  PiShieldThin,
  PiStarThin,
  PiThumbsUpBold,
  PiTwitterLogo,
} from "react-icons/pi";

//professional tab name icon
import frame1 from "@/public/images/frame_1.svg";
import frame2 from "@/public/images/frame_2.svg";
import frame3 from "@/public/images/frame_3.svg";
import frame4 from "@/public/images/frame_4.svg";
import frame5 from "@/public/images/frame_5.png";
import frame6 from "@/public/images/frame_6.svg";

//explore category icon
import categoryIcon1 from "@/public/images/category_icon_1.png";
import categoryIcon2 from "@/public/images/category_icon_2.png";
import categoryIcon3 from "@/public/images/category_icon_3.png";
import categoryIcon4 from "@/public/images/category_icon_4.png";
import categoryIcon5 from "@/public/images/category_icon_5.png";
import categoryIcon6 from "@/public/images/category_icon_6.png";

//worker services images
import serviceImage1 from "@/public/images/workers_profile_service_img1.png";
import serviceImage2 from "@/public/images/workers_profile_service_img2.png";
import serviceImage3 from "@/public/images/workers_profile_service_img3.png";
import serviceImage4 from "@/public/images/workers_profile_service_img4.png";

//more services images
import moreServiceImg1 from "@/public/images/view_services_img1.png";
import moreServiceImg2 from "@/public/images/view_services_img2.png";
import moreServiceImg3 from "@/public/images/view_services_img3.png";
import moreServiceImg4 from "@/public/images/view_services_img4.png";
import moreServiceImg5 from "@/public/images/view_services_img5.png";
import moreServiceImg6 from "@/public/images/view_services_img6.png";

//chat poeple image
import img1 from "@/public/images/chat1.png";
import img2 from "@/public/images/chat2.png";
import img3 from "@/public/images/chat3.png";
import img4 from "@/public/images/chat4.png";
import img5 from "@/public/images/chat5.png";
import img6 from "@/public/images/chat6.png";

//dashboard services image
import dashboardServicesImg1 from "@/public/images/dashboard-services-img1.png";
import dashboardServicesImg2 from "@/public/images/dashboard-services-img2.png";
import dashboardServicesImg3 from "@/public/images/dashboard-services-img3.png";
import dashboardServicesImg4 from "@/public/images/dashboard-services-img4.png";

//comment people images
import commentPeople1 from "@/public/images/comment_people_1.png";
import commentPeople2 from "@/public/images/comment_people_2.png";
import commentPeople3 from "@/public/images/comment_people_3.png";

export const headerMenu = [
  // {
  //   id: uuidv4(),
  //   name: "Home",
  //   isSubmenu: true,
  //   submenu: [
  //     {
  //       id: uuidv4(),
  //       name: "Home One",
  //       link: "/",
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "Home Two",
  //       link: "/home-two",
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "Home Three",
  //       link: "/home-three",
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "Home Four",
  //       link: "/home-four",
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   name: "Shop",
  //   isSubmenu: true,
  //   submenu: [
  //     {
  //       id: uuidv4(),
  //       name: "Store",
  //       link: "/shop",
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "Service Details",
  //       link: "/shop/shop-details",
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "Browse Tasks",
  //       link: "/browse-tasks",
  //     },
  //   ],
  // },
  {
    id: uuidv4(),
    name: "Worker",
    isSubmenu: true,
    submenu: [
      {
        id: uuidv4(),
        name: "Find Workers",
        link: "/find-workers",
      },
      {
        id: uuidv4(),
        name: "Worker Profile",
        link: "/worker-profile",
      },
      {
        id: uuidv4(),
        name: "Worker Portfolio",
        link: "/worker-portfolio",
      },
      {
        id: uuidv4(),
        name: "Portfolio Details",
        link: "/worker-portfolio-details",
      },
      {
        id: uuidv4(),
        name: "Hire Worker",
        link: "/hire-me",
      },
      {
        id: uuidv4(),
        name: "Worker Dashboard",
        link: "/dashboard/home",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Pages",
    isSubmenu: true,
    submenu: [
      {
        id: uuidv4(),
        name: "About Us",
        link: "/about-us",
      },
      {
        id: uuidv4(),
        name: "Blog",
        link: "/blog",
      },
      {
        id: uuidv4(),
        name: "Blog Details",
        link: "/blog/blog-details",
      },
      {
        id: uuidv4(),
        name: "Chat",
        link: "/chat",
      },
      {
        id: uuidv4(),
        name: "FAQ",
        link: "/faq",
      },
      {
        id: uuidv4(),
        name: "Contact",
        link: "/contact",
      },
      {
        id: uuidv4(),
        name: "Not Found",
        link: "/not-found",
      },
      {
        id: uuidv4(),
        name: "Privacy Policy",
        link: "/privacy-policy",
      },
      {
        id: uuidv4(),
        name: "Terms & Conditions",
        link: "/terms-conditions",
      },
    ],
  },
];

export const homeOneHeroSlider = [
  {
    id: uuidv4(),
    title: "Design & Technology",
    desc: `View the full range of
design and technology
resources, created by
teachers for teachers.`,
    img: homeHeorSliderImg1,
    bgColor: "bg-g300",
  },
  {
    id: uuidv4(),
    title: "Computing",
    desc: `View the full range of
design and technology
resources, created by
teachers for teachers.`,
    img: homeHeorSliderImg2,
    bgColor: "bg-b300",
  },
  {
    id: uuidv4(),
    title: "Languages",
    desc: `View the full range of
languages resources,
created by teachers for
teachers`,
    img: homeHeorSliderImg3,
    bgColor: "bg-b900",
  },
  {
    id: uuidv4(),
    title: "Renovation",
    desc: "Expert Renovation Services Available Now.",
    img: homeHeorSliderImg4,
    bgColor: "bg-o300",
  },
];

export const howItWorksOne = [
  {
    id: uuidv4(),
    title: "Tasker Evaluation",
    desc: "Choose a Tasker by price, skills, and reviews.",
  },
  {
    id: uuidv4(),
    title: "Book Now",
    desc: "Schedule a Tasker as early as today",
  },
  {
    id: uuidv4(),
    title: "ChatTip Hub",
    desc: "Chat, pay, tip, and review all in one place.",
  },
];

export const topExperts = [
  {
    id: uuidv4(),
    img: "expertImg1",
    expertName: "Juan Mullins",
    location: "Brooklyn, NY, USA",
    features: ["$50 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Handyman", "Gardening"],
    sliderImg: [
      expertImgSlider2,
      expertImgSlider1,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg2",
    expertName: "Ronald Higgins",
    location: "Brooklyn, NY, USA",
    features: ["$45 - &80/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Plumber", "Handyman"],
    sliderImg: [
      expertImgSlider6,
      expertImgSlider5,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg3",
    expertName: "Leroy Curtis",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: [
      "Gardening",
      "Plumber",
      "Plumber",
      "Handyman",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
    ],
    sliderImg: [
      expertImgSlider3,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg4",
    expertName: "Kenneth Sims",
    location: "Brooklyn, NY, USA",
    features: ["$25 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Plumber", "Cleaning", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider6,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg5",
    expertName: "Sarah Bryan",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &200/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Plumber", "Gardening", "Plumber"],
    sliderImg: [
      expertImgSlider5,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg6",
    expertName: "Todd Meyer",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Gardening", "Photography", "Plumber", "Plumber", "Handyman"],
    sliderImg: [
      expertImgSlider3,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg1",
    expertName: "Jeanette Alexander",
    location: "Brooklyn, NY, USA",
    features: ["$50 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Handyman", "Photography", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg5",
    expertName: "Beatrice Gill",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: [
      "Photography",
      "Gardening",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
      "Plumber",
    ],
    sliderImg: [
      expertImgSlider2,
      expertImgSlider1,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg4",
    expertName: "Marvin Perry",
    location: "Brooklyn, NY, USA",
    features: ["$50 - &150/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Gardening", "Handyman", "Plumber", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider3,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider4,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg2",
    expertName: "Marvin Lamb",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &120/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Photography", "Renovation", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider4,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider5,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg6",
    expertName: "Bradley Pittman",
    location: "Brooklyn, NY, USA",
    features: ["$25 - &120/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Renovation", "Cleaning", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider5,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider6,
    ],
  },
  {
    id: uuidv4(),
    img: "expertImg3",
    expertName: "Alice Ortega",
    location: "Brooklyn, NY, USA",
    features: ["$75 - &100/hr", "TOP INDEPENDENT", "AVAILABLE"],
    services: ["Renovation", "Photography", "Plumber", "Plumber"],
    sliderImg: [
      expertImgSlider6,
      expertImgSlider1,
      expertImgSlider2,
      expertImgSlider3,
      expertImgSlider4,
      expertImgSlider5,
    ],
  },
];

export const testimonialData = [
  {
    id: uuidv4(),
    review:
      "I was amazed at the efficiency of the platform. The handyman arrived promptly and completed the task with skill. I'm a satisfied customer and will definitely use this service again.A reliable service for tech assistance.",
    img: smallPeople1,
    name: "Leslie Alexander",
    profileId: "@iamsedaoi",
  },
  {
    id: uuidv4(),
    review:
      "I was amazed at the efficiency of the platform. The handyman arrived promptly and completed the task with skill.",
    img: smallPeople2,
    name: "Ronald Richards",
    profileId: "@roanld23",
  },
  {
    id: uuidv4(),
    review:
      "I was amazed at the efficiency of the platform. The handyman arrived promptly and completed the task with skill. I'm a satisfied customer and will definitely use this service again.",
    img: smallPeople3,
    name: "Esther Howard",
    profileId: "@estherHowerd",
  },
  {
    id: uuidv4(),
    review:
      "I was amazed at the efficiency of the platform. The handyman arrived promptly and completed the task with skill. I'm a satisfied customer and will definitely use this service again.",
    img: smallPeople2,
    name: "Adele Brown",
    profileId: "@adelebrown",
  },
  {
    id: uuidv4(),
    review:
      "I was amazed at the efficiency of the platform. The handyman arrived promptly and completed the task with skill.",
    img: smallPeople3,
    name: "Ella Curry",
    profileId: "@ellacurry",
  },
  {
    id: uuidv4(),
    review:
      "I was amazed at the efficiency of the platform. The handyman arrived promptly and completed the task with skill. I'm a satisfied customer and will definitely use this service again.A reliable service for tech assistance.",
    img: smallPeople1,
    name: "Georgia Daniels",
    profileId: "@georgia",
  },
];

export const loginReviewData = [
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople1,
    name: "Leslie Alexander",
    profileId: "@iamsedaoi",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople2,
    name: "Ronald Richards",
    profileId: "@roanld23",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople3,
    name: "Esther Howard",
    profileId: "@estherHowerd",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople2,
    name: "Adele Brown",
    profileId: "@adelebrown",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople3,
    name: "Ella Curry",
    profileId: "@ellacurry",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople1,
    name: "Georgia Daniels",
    profileId: "@georgia",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople1,
    name: "Leslie Alexander",
    profileId: "@iamsedaoi",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople2,
    name: "Ronald Richards",
    profileId: "@roanld23",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople3,
    name: "Esther Howard",
    profileId: "@estherHowerd",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople2,
    name: "Adele Brown",
    profileId: "@adelebrown",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople3,
    name: "Ella Curry",
    profileId: "@ellacurry",
  },
  {
    id: uuidv4(),
    review:
      "I am always trying to find such a solution to making marketing videos more efficient. Creating consuming. We found some AI copywriting tools. This is the first time I see a product that can generate video content. Good job team!",
    img: smallPeople1,
    name: "Georgia Daniels",
    profileId: "@georgia",
  },
];

export const blogDetails = [
  {
    id: uuidv4(),
    title: "Insight from the On-Demand Marketplace",
    date: " May 12",
    category: "Tips & Tricks",
    img: blogImg1,
  },
  {
    id: uuidv4(),
    title: "Celebrating Successes in Service",
    date: "May 12",
    category: "Tips & Tricks",
    img: blogImg2,
  },
  {
    id: uuidv4(),
    title: "Get your furniture asembled in no time",
    date: "May 12",
    category: "Tips & Tricks",
    img: blogImg3,
  },
  {
    id: uuidv4(),
    title: " Journey Through Service Experiences",
    date: "May 12",
    category: "Tips & Tricks",
    img: blogImg4,
  },
  {
    id: uuidv4(),
    title: "Stories of Triumph in the On-Demand Era",
    date: "May 12",
    category: "Tips & Tricks",
    img: blogImg5,
  },
  {
    id: uuidv4(),
    title: "Exploring Service Success Stories",
    date: "May 12",
    category: "Tips & Tricks",
    img: blogImg6,
  },
];

export const companyFeatures = [
  {
    id: uuidv4(),
    title: "1M+ customers",
    desc: "Push Status Updates",
    icon: React.createElement(PiBellSimpleRingingThin),
  },
  {
    id: uuidv4(),
    title: "4M+ reviews",
    desc: "Transparent Ratings",
    icon: React.createElement(PiStarThin),
  },
  {
    id: uuidv4(),
    title: "2M+ tasks done",
    desc: "Secure, Payments",
    icon: React.createElement(PiShieldThin),
  },
  {
    id: uuidv4(),
    title: "24/7 Support",
    desc: "Responsive",
    icon: React.createElement(PiHeadphonesThin),
  },
];

export const popularTabNames = [
  {
    id: uuidv4(),
    name: "Photography",
    img: frame1,
  },
  {
    id: uuidv4(),
    name: "Handyman",
    img: frame2,
  },
  {
    id: uuidv4(),
    name: "Babysitting",
    img: frame3,
  },
  {
    id: uuidv4(),
    name: "Renovation",
    img: frame4,
  },
  {
    id: uuidv4(),
    name: "Gardening",
    img: frame5,
  },
  {
    id: uuidv4(),
    name: "Cleaning",
    img: frame6,
  },
];

export const socialLinks = [
  {
    id: uuidv4(),
    name: "Facebook",
    link: "https://www.facebook.com", // default link
    icon: React.createElement(PiFacebookLogo),
  },
  {
    id: uuidv4(),
    name: "Twitter",
    link: "https://twitter.com", // default link
    icon: React.createElement(PiTwitterLogo),
  },
  {
    id: uuidv4(),
    name: "Instagram",
    link: "https://www.instagram.com", // default link
    icon: React.createElement(PiInstagramLogo),
  },
  {
    id: uuidv4(),
    name: "Behance",
    link: "https://www.behance.net", // default link
    icon: React.createElement(PiBehanceLogo),
  },
  {
    id: uuidv4(),
    name: "Dribbble",
    link: "https://dribbble.com", // default link
    icon: React.createElement(PiDribbbleLogo),
  },
];


export const exploreCategory = [
  {
    id: uuidv4(),
    name: "Handyman",
    desc: "Versatile handyman, tackling repairs and tasks with precision and care.",
    icon: categoryIcon1,
    bgColor: "bg-r50 ",
    iconBgColor: "bg-bg5",
  },
  {
    id: uuidv4(),
    name: "Photography",
    desc: "Capture moments beautifully with our expert photography services.",
    icon: categoryIcon2,
    bgColor: "bg-bg2",
    iconBgColor: "bg-[#8CEDF6]",
  },
  {
    id: uuidv4(),
    name: "Babysitting",
    desc: "Trustworthy babysitters for your peace of mind always.",
    icon: categoryIcon3,
    bgColor: "bg-[#FEE6B2]",
    iconBgColor: "bg-bg6",
  },
  {
    id: uuidv4(),
    name: "Renovation",
    desc: "Transform spaces with our expert renovation services today!",
    icon: categoryIcon4,
    bgColor: "bg-[#E9E7F7]",
    iconBgColor: "bg-[#B9AFFF]",
  },
  {
    id: uuidv4(),
    name: "Gardening",
    desc: "Cultivate your green haven with expert gardening services.",
    icon: categoryIcon5,
    bgColor: "bg-bg4",
    iconBgColor: "bg-[#D4EDB3]",
  },
  {
    id: uuidv4(),
    name: "Cleaning",
    desc: "Efficient cleaning solutions for a spotless, refreshed living space.",
    icon: categoryIcon6,
    bgColor: "bg-eb50",
    iconBgColor: "bg-[#9DC4FC]",
  },
];

export const faqData = [
  {
    id: uuidv4(),
    question: "What types of services do you offer?",
    answer:
      "Our cancellation policy varies depending on the service and service provider. Please check the terms before booking.",
  },
  {
    id: uuidv4(),
    question: "What is your payment methods?",
    answer:
      "Our cancellation policy varies depending on the service and service provider. Please check the terms before booking.",
  },
  {
    id: uuidv4(),
    question: "How long does it takes?",
    answer:
      "Our cancellation policy varies depending on the service and service provider. Please check the terms before booking.",
  },
  {
    id: uuidv4(),
    question: "When is your off time?",
    answer:
      "Our cancellation policy varies depending on the service and service provider. Please check the terms before booking.",
  },
];

export const workerServices = [
  {
    id: uuidv4(),
    img: serviceImage1,
    name: "Sparkle Ease Cleaning Solutions",
    startingPrice: "$75 - &100/hr",
  },
  {
    id: uuidv4(),
    img: serviceImage2,
    name: "Home Complete Cleaning Solutions",
    startingPrice: "$50 - &100/hr",
  },
  {
    id: uuidv4(),
    img: serviceImage3,
    name: "Office New Cleaning Solution",
    startingPrice: "$50 - &150/hr",
  },
  {
    id: uuidv4(),
    img: serviceImage4,
    name: "Setup Kitchen Appience Easily",
    startingPrice: "$25 - &100/hr",
  },
];

export const recommendationsData = [
  {
    id: uuidv4(),
    profileImg: "expertImg4",
    name: "Stacey Troutman",
    address: "Brooklyn, NY, USA",
    review:
      "It was a pleasure working with Alice. She was super clear and detailed with the project requirements. I appreciate her wonderful communication, collaboration, and flexibility. Thanks, Alice!",
  },
  {
    id: uuidv4(),
    profileImg: "expertImg3",
    name: "Darrell Steward",
    address: "Brooklyn, NY, USA",
    review:
      "This is our second time collaborating on a project. As always Alice is just amazing to work with. She is super clear with the deliverables, wonderful to communicate with, and a fantastic person to work with! Thanks, Alice!",
  },
  {
    id: uuidv4(),
    profileImg: "expertImg2",
    name: "David Cameroon",
    address: "Brooklyn, NY, USA",
    review:
      "I loved working with Alice on our project! Alice was very responsive and clear with everything. I loved that I got to have creative freedom on this project. We enjoyed working together so much, we're extending to phase 2 of this project!",
  },
];

export const moreProjectData = [
  {
    id: uuidv4(),
    img: moreServiceImg1,
    name: "Cleaning",
  },
  {
    id: uuidv4(),
    img: moreServiceImg2,
    name: "Babysitting",
  },
  {
    id: uuidv4(),
    img: moreServiceImg3,
    name: "Gardening",
  },
  {
    id: uuidv4(),
    img: moreServiceImg4,
    name: "Handyman",
  },
  {
    id: uuidv4(),
    img: moreServiceImg5,
    name: "Plumber",
  },
  {
    id: uuidv4(),
    img: moreServiceImg6,
    name: "Renovation",
  },
];

export const becomeTaskerFeatures = [
  {
    id: uuidv4(),
    icon: React.createElement(PiFileTextBold),
    title: "All on your terms",
    desc: "Find jobs that fit your skills and schedule.",
  },
  {
    id: uuidv4(),
    icon: React.createElement(PiThumbsUpBold),
    title: "Get going for free",
    desc: "Join for free and start earning straight away.",
  },
  {
    id: uuidv4(),
    icon: React.createElement(PiLockBold),
    title: "Payments on lock",
    desc: "Direct bank payments upon task completion assured.",
  },
  {
    id: uuidv4(),
    icon: React.createElement(PiCurrencyDollarSimpleBold),
    title: "Skills can thrill",
    desc: "Design Logos, Declutter Homes, and More!",
  },
];

export const chatList = [
  {
    id: uuidv4(),
    name: "Piter Maio",
    img: img1,
    isNew: true,
    newMessage: "I am a ga..",
    lastMessageTime: "15min",
  },
  {
    id: uuidv4(),
    name: "Leslie Alexander",
    img: img2,
    lastMessageTime: "12min",
    isMyReply: true,
    myReply: "Why...",
  },
  {
    id: uuidv4(),
    name: "Sa Kib",
    img: img3,
    lastMessageTime: "25min",
    isMyReply: true,
    myReply: "Hello...",
  },
  {
    id: uuidv4(),
    name: "Brooklyn Simmons",
    img: img4,
    isNew: true,
    newMessage: "Duis tincid",
    lastMessageTime: "18min",
  },
  {
    id: uuidv4(),
    name: "Leslie Alexander",
    img: img5,
    lastMessageTime: "20mins",
    isMyReply: true,
    myReply: "I am...",
  },
  {
    id: uuidv4(),
    name: "Piter Maio",
    img: img6,
    lastMessageTime: "19mins",
    isMyReply: true,
    myReply: "How are...",
  },
  {
    id: uuidv4(),
    name: "Cody Fisher",
    img: img1,
    lastMessageTime: "13mins",
    isMyReply: true,
    myReply: "Video",
  },
  {
    id: uuidv4(),
    name: "Bessie Cooper",
    img: img2,
    lastMessageTime: "23mins",
    isMyReply: true,
    myReply: "Photo",
  },
  {
    id: uuidv4(),
    name: "Brooklyn Simmons",
    img: img3,
    lastMessageTime: "14mins",
    isMyReply: true,
    myReply: "How...",
  },
  {
    id: uuidv4(),
    name: "Theresa Webb",
    img: img4,
    lastMessageTime: "45mins",
    isMyReply: true,
    myReply: "Friend...",
  },

  {
    id: uuidv4(),
    name: "Piter Maio",
    img: img5,
    isNew: true,
    newMessage: "Hello",
    lastMessageTime: "14mins",
  },
  {
    id: uuidv4(),
    name: "Leslie Alexander",
    img: img6,
    lastMessageTime: "1hour",
    isMyReply: true,
    myReply: "I'm...",
  },
];

export const workerPortfolioData = [
  {
    id: uuidv4(),
    img: portfolioImg1,
    name: "Restaurant Cleaning Services",
  },
  {
    id: uuidv4(),
    img: portfolioImg2,
    name: "Home Cleaning Services",
  },
  {
    id: uuidv4(),
    img: portfolioImg3,
    name: "Office Cleaning Services",
  },
  {
    id: uuidv4(),
    img: portfolioImg4,
    name: "School Cleaning Services",
  },
];

export const dashboardMenu = [
  {
    id: uuidv4(),
    name: "Home",
    link: "/",
  },
  {
    id: uuidv4(),
    name: "Dashboard",
    link: "/dashboard/home",
  },
  {
    id: uuidv4(),
    name: "Products",
    link: "/dashboard/services",
  },
  {
    id: uuidv4(),
    name: "Upload a resource",
    link: "/dashboard/upload-a-resource",
  },
  {
    id: uuidv4(),
    name: "Payout History",
    link: "/dashboard/payout-history",
  },
  {
    id: uuidv4(),
    name: "My Orders",
    link: "/dashboard/my-orders",
  },
  {
    id: uuidv4(),
    name: "Logout",
    link: "/sign-in",
  },
];

export const dashborarNotificationData = [
  {
    id: uuidv4(),
    name: "Notification One",
    time: "7 hours ago",
  },
  {
    id: uuidv4(),
    name: "Notification Two",
    time: "8 hours ago",
  },
  {
    id: uuidv4(),
    name: "Notification Three",
    time: "9 hours ago",
  },
  {
    id: uuidv4(),
    name: "Notification Four",
    time: "10 hours ago",
  },
];

export const dashboardProfileLink = [
  {
    id: uuidv4(),
    name: "Profile",
    link: "/dashboard/profile",
  },
  {
    id: uuidv4(),
    name: "Edit Profile",
    link: "/dashboard/edit-profile",
  },
  {
    id: uuidv4(),
    name: "Settings",
    link: "/dashboard/settings",
  },
];

export const userInformationCard = [
  {
    id: uuidv4(),
    count: "17",
    title: "Order Pending",
    iconBgColor: "bg-r300",
    icon: React.createElement(PiListChecks),
  },
  {
    id: uuidv4(),
    count: "2750",
    title: "Order Completed",
    iconBgColor: "bg-o300",
    icon: React.createElement(PiHandshake),
  },
  {
    id: uuidv4(),
    count: "07",
    title: "Total Earning",
    iconBgColor: "bg-b300",
    icon: React.createElement(PiCurrencyCircleDollar),
  },
  {
    id: uuidv4(),
    count: "1204",
    title: "Balance",
    iconBgColor: "bg-g300",
    icon: React.createElement(PiMoney),
  },
];

export const thisMonthSummeryCard = [
  {
    id: uuidv4(),
    count: "145",
    title: "Order",
    bgColor: "bg-o300",
    icon: React.createElement(PiListChecks),
  },
  {
    id: uuidv4(),
    count: "7500",
    title: "Earning",
    bgColor: "bg-b300",
    icon: React.createElement(PiHandshake),
  },
  {
    id: uuidv4(),
    count: "4205",
    title: "Balance",
    bgColor: "bg-g300",
    icon: React.createElement(PiCurrencyCircleDollar),
  },
  {
    id: uuidv4(),
    count: "740",
    title: "My Orders",
    bgColor: "bg-r300",
    icon: React.createElement(PiDownloadSimple),
  },
];

export const orderInfo = [
  {
    id: uuidv4(),
    name: "Jerome Bell",
    status: "Completed",
    location: "New York",
    price: "26547",
  },
  {
    id: uuidv4(),
    name: "Lola Matthews",
    status: "Inprogress",
    location: "Gokrenon",
    price: "51757",
  },
  {
    id: uuidv4(),
    name: "Jane Wallace",
    status: "Completed",
    location: "Uvodowar",
    price: "44137",
  },
  {
    id: uuidv4(),
    name: "Maria Waters",
    status: "Pending",
    location: "Noizus",
    price: "12876",
  },
  {
    id: uuidv4(),
    name: "Bertie Dawson",
    status: "Completed",
    location: "Vadajiz",
    price: "37188",
  },
  {
    id: uuidv4(),
    name: "Myra Sullivan",
    status: "Pending",
    location: "Gijsegsuh",
    price: "38603",
  },
];

export const dashboardTodolist = [
  "It is a long established fact ",
  "It is a long established fact ",
  "It is a long established fact ",
  "It is a long established fact ",
];

export const profileServicesData = [
  {
    id: uuidv4(),
    title: "On-Demand Services for Busy Lifestyles",
    img: dashboardServicesImg1,
    startingPrice: "150",
    ratingCount: "946",
    viewCount: "1863",
    inQ: "37",
    completed: "6137",
    cancelled: "103",
  },
  {
    id: uuidv4(),
    title: "On-Demand Services for Every Need",
    img: dashboardServicesImg2,
    startingPrice: "63",
    ratingCount: "501",
    viewCount: "6072",
    inQ: "71",
    completed: "3805",
    cancelled: "212",
  },
  {
    id: uuidv4(),
    title: "Sparkle Ease Cleaning Solutions",
    img: dashboardServicesImg3,
    startingPrice: "66",
    ratingCount: "644",
    viewCount: "4683",
    inQ: "51",
    completed: "4846",
    cancelled: "881",
  },
  {
    id: uuidv4(),
    title: "Celebrating Successes in Service",
    img: dashboardServicesImg4,
    startingPrice: "70",
    ratingCount: "593",
    viewCount: "5849",
    inQ: "67",
    completed: "4020",
    cancelled: "194",
  },
];

export const payoutHistory = [
  {
    id: uuidv4(),
    refId: "EX16 9QT",
    method: "Painting & Renovation",
    date: "29/04/2024",
    amount: "1891",
  },
  {
    id: uuidv4(),
    refId: "WF8 4PR",
    method: "Office Cleaning Services",
    date: "06/09/2024",
    amount: "1635",
  },
  {
    id: uuidv4(),
    refId: "CW12 3NB",
    method: "Home & Other Cleaning",
    date: "23/12/2024",
    amount: "5177",
  },
  {
    id: uuidv4(),
    refId: "NW6 4HA",
    method: "Handyman Services",
    date: "25/02/2024",
    amount: "8814",
  },
  {
    id: uuidv4(),
    refId: "HA5 2HS",
    method: "Photography Services",
    date: "02/07/2024",
    amount: "7735",
  },
  {
    id: uuidv4(),
    refId: "AL5 2TR",
    method: "Plumber Services",
    date: "31/07/2024",
    amount: "3792",
  },
  {
    id: uuidv4(),
    refId: "ME1 1YL",
    method: "Gardening Services",
    date: "07/05/2024",
    amount: "4669",
  },
  {
    id: uuidv4(),
    refId: "NW6 4HA",
    method: "Renovation Services",
    date: "20/06/2024",
    amount: "8244",
  },
];

export const blogCommentData = [
  {
    id: uuidv4(),
    name: "Robert Fox",
    img: commentPeople1,
    date: "October 02",
    comment:
      "I recently used Servibe for a home cleaning service, and I couldn't be happier with the results! The cleaner was professional, thorough, and paid attention to every detail. My house has never looked better! I highly recommend their services to anyone looking for reliable and high-quality cleaning.",
    isReply: true,
    reply: [
      {
        id: uuidv4(),
        name: "David Malan",
        img: commentPeople2,
        date: "October 07",
        comment:
          "I hired a handyman through Servibe to fix a leaky faucet, and he did a fantastic job! He was knowledgeable, efficient, and took the time to explain what he was doing. ",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Marvin McKinney",
    img: commentPeople3,
    date: "October 09",
    comment:
      "I recently used Servibe for a home cleaning service, and I couldn't be happier with the results! The cleaner was professional, thorough, and paid attention to every detail. My house has never looked better! I highly recommend their services to anyone looking for reliable and high-quality cleaning.",
    isReply: false,
  },
];

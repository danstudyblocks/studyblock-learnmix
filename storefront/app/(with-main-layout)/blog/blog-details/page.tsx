"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import {
  PiDribbbleLogo,
  PiFacebookLogo,
  PiInstagramLogo,
} from "react-icons/pi";
import { v4 as uuidv4 } from "uuid";
import blogThumbnail from "@/public/images/blog-details-thumbnail.png";
import blogImg1 from "@/public/images/blog-img-1.png";
import blogImg2 from "@/public/images/blog-img-2.png";
import commentPeople2 from "@/public/images/comment_people_2.png";

import BreadCrumb2 from "@/components/global/BreadCrumb2";
import CommentCard from "@/components/ui/CommentCard";
import { blogCommentData, blogDetails } from "@/data/data";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RecentPosts from "@/components/designEditor/RecentPosts";

function BlogDetailsDynamicPage() {
  const [comments, setComments] = useState(blogCommentData);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const date = "October 5";

  const { title } = useParams();
  const [bodyData, setBodyData] = useState(Object);

  useEffect(() => {
    const blogData = blogDetails.filter(
      (blog) => blog.title.toLocaleLowerCase().replaceAll(" ", "-") === title
    );
    setBodyData(blogData[0]);
  }, []);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    if (!name || !email || !comment) return;
    const newComment = {
      name,
      comment,
      date,
      id: uuidv4(),
      img: commentPeople2,
      isReply: false,
    };

    setComments([...comments, newComment]);

    setName("");
    setEmail("");
    setComment("");
  }
  return (
    <>
      <BreadCrumb2
        pageName="Blog Details"
        isMiddlePage={true}
        middlePageLink="/blog"
        middlePageName="Blog"
      />

      <section className="">
        <div className="container -mt-40 rounded-xl bg-white p-2 sm:p-4 md:rounded-3xl md:px-15 md:pt-15 lg:rounded-[60px]">
          <div className="">
            <Image src={blogThumbnail} alt="" className="rounded-3xl" />
          </div>
          <p className="text pt-10 text-xl font-medium text-gray-800">
            Latest News December 12, {new Date().getFullYear()}
          </p>
          <h2 className="display-4 pb-5 pt-3 font-extrabold">
            {bodyData !== undefined
              ? bodyData.title
              : "Celebrating Successes in Service"}
          </h2>
          <p className="pb-3 text-base text-n200 sm:text-lg">
            In today&apos;s fast-paced world, on-demand services have become an
            integral part of our lives, offering convenience, efficiency, and
            flexibility. In this blog post, we&apos;ll delve into the latest
            trends and innovations on-demand services, technologies to evolving
            consumer preferences.
          </p>
          <p className="text-base text-n200 sm:text-lg">
            Explore how artificial intelligence and automation are
            revolutionizing the on-demand industry, streamlining processes, and
            enhancing user experiences. Explore the expanding range of services
            available on-demand
          </p>

          <h3 className="heading-2 stp-15 pb-5">
            Exploring Service Success Stories
          </h3>

          <p className="pb-3 text-base text-n200 sm:text-lg">
            Discover the expanding range services available on-demand, from
            traditional offerings like transportation and food delivery to niche
            services like pet grooming and fitness coaching.
          </p>

          <div className="flex items-center justify-between gap-6">
            <div className="overflow-hidden rounded-xl">
              <Image src={blogImg1} alt="" />
            </div>
            <div className="overflow-hidden rounded-xl">
              <Image src={blogImg2} alt="" />
            </div>
          </div>

          <p className="pt-3 text-base text-n200 sm:text-lg">
            Learn how on-demand service providers are leveraging data analytics
            and machine learning to offer personalized and customized
            experiences tailored to individual preferences.
          </p>

          <h4 className="heading-3 stp-15 pb-5">
            Celebrating Successes in Service
          </h4>
          <p className="pb-3 text-base text-n200 sm:text-lg">
            Discover the expanding range services available on-demand, from
            traditional offerings like transportation and food delivery to niche
            services like pet grooming and fitness coaching.
          </p>
          <p className="text-base text-n200 sm:text-lg">
            Discover the expanding range services available on-demand, from
            traditional offerings like transportation and food delivery to niche
            services like pet grooming and fitness coaching.
          </p>

          <div className="stp-15">
            <div className="flex items-center justify-between gap-6 border-y border-n30 py-4 max-lg:flex-col max-lg:items-start">
              <div className="flex items-center justify-start gap-4 max-sm:flex-col max-sm:items-start">
                <p className="heading-4">Tags:</p>
                <ul className="flex items-center justify-start gap-3 text-n300 max-lg:flex-wrap">
                  <li className="rounded-xl border border-n40 px-4 py-2">
                    Clean
                  </li>
                  <li className="rounded-xl border border-n40 px-4 py-2">
                    Services
                  </li>
                  <li className="rounded-xl border border-n40 px-4 py-2">
                    Handyman
                  </li>
                  <li className="rounded-xl border border-n40 px-4 py-2">
                    Paint
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-start gap-4">
                <p className="heading-4">Share:</p>
                <ul className="flex items-center justify-start gap-3 text-2xl !leading-none text-white">
                  <li className="rounded-full bg-n900 p-2 duration-500 hover:bg-b300">
                    <Link href="" className="flex items-center justify-center">
                      <PiFacebookLogo />
                    </Link>
                  </li>
                  <li className="rounded-full bg-n900 p-2 duration-500 hover:bg-b300">
                    <Link href="" className="flex items-center justify-center">
                      <PiInstagramLogo />
                    </Link>
                  </li>
                  <li className="rounded-full bg-n900 p-2 duration-500 hover:bg-b300">
                    <Link href="" className="flex items-center justify-center">
                      <PiDribbbleLogo />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="stp-15">
            <p className="heading-5 pb-6">03 Comments:</p>

            {comments.map(({ id, isReply, reply, ...props }) => (
              <div
                key={id}
                className="flex items-start flex-col justify-start gap-3 pt-6 sm:gap-5 sm:pt-8"
              >
                <CommentCard key={id} {...props} />

                {isReply && (
                  <div className="pl-6 sm:pl-24">
                    {reply?.map(({ id, ...props }) => (
                      <CommentCard key={id} {...props} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="stp-15">
              <p className="heading-6">Leave A Comment</p>

              <form
                className="grid grid-cols-12 gap-6 pt-10 font-medium"
                onSubmit={handleSubmit}
              >
                <div className="col-span-12 rounded-xl border border-n30 p-3 sm:col-span-6">
                  <input
                    type="text"
                    className="w-full outline-none placeholder:text-n100"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-12 rounded-xl border border-n30 p-3 sm:col-span-6">
                  <input
                    type="text"
                    className="w-full outline-none placeholder:text-n100"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-12 rounded-xl border border-n30 p-3">
                  <textarea
                    className="min-h-[200px] w-full outline-none placeholder:text-n100"
                    placeholder="Message"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="col-span-4">
                  <button className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8">
                    <span className="relative z-10">Post a Comment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <RecentPosts isBgWhite={true} />
    </>
  );
}

export default BlogDetailsDynamicPage;

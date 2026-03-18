import Link from "next/link";

function LinkButtonTwo({ link, text }: { link: string; text: string }) {
  return (
    <Link
      href={link}
      className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-8 py-3 font-medium !leading-none text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
    >
      <span className="m relative z-10">{text}</span>
    </Link>
  );
}

export default LinkButtonTwo;

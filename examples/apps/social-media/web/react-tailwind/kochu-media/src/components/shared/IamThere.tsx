import { socialLinks } from '@/constants';

const IamThere = () => {
  return (
    <div className=" h-fit md:gap-9 px-10 py-5 overflow-x-hidden overflow-y-auto scroll-smooth hidden lg:block">
      {socialLinks.map((link, index) => (
        <div
          key={index}
          className="w-full h-full flex flex-col premium-box relative group overflow-hidden rounded-xl mt-10"
        >
          <h1 className="text-xl font-semibold text-gray-100 mb-3 transition-colors duration-300 group-hover:text-rose-400">
            {link.title}
          </h1>
          <a
            href={link.href}
            className="w-full h-fit rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-transparent hover:border-rose-400 flex justify-center items-center py-6 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-rose-500"
          >
            <img
              width={80}
              height={80}
              src={link.imageSrc}
              alt={link.alt}
              className="shine-effect transition-transform duration-300 transform group-hover:scale-110"
            />
          </a>
          <div className="shining-border absolute inset-0 rounded-xl pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default IamThere;

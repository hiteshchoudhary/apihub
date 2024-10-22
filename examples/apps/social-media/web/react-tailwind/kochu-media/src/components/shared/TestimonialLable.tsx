const TestimonialLabel = () => {
   return (
      <div className="testimonial-lable">
         <p className="text-lg font-semibold mb-2">
            Thank you for visiting Kochu-Media
         </p>
         <p className="text-sm text-gray-400 pt-2 pb-5">
            If you found my work helpful, consider giving it a star on GitHub.
         </p>
         <a
            className="px-5 py-2 border border-gray-50 rounded-full"
            href="https://github.com/BuddhadebKoner"
            target="_blank">
            ⭐ GitHub
         </a>
         <img
            className="max-w-[40vw] lg:max-w-[10vw] mt-6"
            src="/assets/images/logo.svg"
            alt="kochu-media-logo" />
      </div>
   );
}

export default TestimonialLabel;

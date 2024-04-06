import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollContainerProps {
  fetchData: (isFirstPage: boolean, nextPage: number) => Promise<void>;
  Loader: () => JSX.Element;
  loading: boolean;
  children: ReactNode;
  hasNextPage: boolean;
  initialFetch: boolean;
}
//  TODO: Try getting page from query params
const ScrollContainer = ({
  fetchData,
  Loader,
  loading,
  children,
  hasNextPage,
  initialFetch,
}: ScrollContainerProps) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    console.log("3");
    console.log("useEffect page", page);
    if (hasNextPage || initialFetch) {
      console.log("4");
      fetchData(page === 1, initialFetch ? 1 : page);
    }
  }, [page]);

  useEffect(() => {
    console.log(observerTarget);
    const observer = new IntersectionObserver(
      (entries) => {
        // If the target element is intersecting, increment the page number
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
          console.log("2");
        }
      },
      { threshold: 1 }
    );

    // Start observing the target element
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    // Clean up observer on component unmount
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <div ref={scrollRef}>
      <div className="flex flex-col gap-2">
        {!initialFetch && children}

        {loading && (
          <>
            <Loader />
            <Loader />
            <Loader />
          </>
        )}

        <div ref={observerTarget} className=" " />
      </div>
    </div>
  );
};

export default ScrollContainer;

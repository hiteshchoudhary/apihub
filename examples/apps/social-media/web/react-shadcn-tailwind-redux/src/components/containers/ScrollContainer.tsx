import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollContainerProps {
  fetchData: (isFirstPage: boolean, nextPage: number) => Promise<void>;
  Loader: () => JSX.Element;
  loading: boolean;
  children: ReactNode;
  hasNextPage: boolean;
  initialFetch: boolean;
}

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
    if (hasNextPage || initialFetch) {
      fetchData(page === 1, initialFetch ? 1 : page);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the target element is intersecting, increment the page number
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
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

        <div ref={observerTarget} className="w-full h-[70px] md:h-0 " />
      </div>
    </div>
  );
};

export default ScrollContainer;

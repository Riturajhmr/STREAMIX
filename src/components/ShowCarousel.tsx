import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TVShow } from "@/lib/tmdb";
import ShowCard from "./ShowCard";
import { cn } from "@/lib/utils";

interface ShowCarouselProps {
  title: string;
  shows: TVShow[];
  isLoading?: boolean;
}

const ShowCarousel = ({ title, shows, isLoading = false }: ShowCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="py-4 md:py-8">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="w-48 h-8 skeleton rounded mb-4" />
          <div className="flex gap-3 md:gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px]"
              >
                <div className="aspect-[2/3] skeleton rounded-lg" />
                <div className="mt-2 w-3/4 h-4 skeleton rounded" />
                <div className="mt-1 w-1/2 h-3 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!shows.length) return null;

  return (
      <section className="py-4 md:py-8 group/carousel">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-6">
          {title}
        </h2>

        <div className="relative -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16">
          <button
            onClick={() => scroll("left")}
            className={cn(
              "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300",
              !canScrollLeft && "!opacity-0 pointer-events-none"
            )}
            aria-label="Scroll left"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </button>

          <button
            onClick={() => scroll("right")}
            className={cn(
              "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300",
              !canScrollRight && "!opacity-0 pointer-events-none"
            )}
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
          >
            {shows.map((show, index) => (
              <ShowCard key={show.id} show={show} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowCarousel;

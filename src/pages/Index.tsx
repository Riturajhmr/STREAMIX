import { useState, useEffect } from "react";
import { getTrending, getPopular, getTopRated, getAiringToday, TVShow } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ShowCarousel from "@/components/ShowCarousel";

const Index = () => {
  const [trending, setTrending] = useState<TVShow[]>([]);
  const [popular, setPopular] = useState<TVShow[]>([]);
  const [topRated, setTopRated] = useState<TVShow[]>([]);
  const [airingToday, setAiringToday] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popularData, topRatedData, airingData] = await Promise.all([
          getTrending(),
          getPopular(),
          getTopRated(),
          getAiringToday(),
        ]);
        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setAiringToday(airingData);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <HeroSection />

      <div className="relative z-10 -mt-24 md:-mt-32 pb-12">
        <ShowCarousel
          title="Trending This Week"
          shows={trending}
          isLoading={isLoading}
        />
        <ShowCarousel
          title="Popular on Streamix"
          shows={popular}
          isLoading={isLoading}
        />
        <ShowCarousel
          title="Top Rated"
          shows={topRated}
          isLoading={isLoading}
        />
        <ShowCarousel
          title="Airing Today"
          shows={airingToday}
          isLoading={isLoading}
        />
      </div>

      <footer className="border-t border-border/50 py-6 md:py-8">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display text-xl sm:text-2xl text-primary">STREAMIX</span>
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-right">
              Powered by TMDB. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

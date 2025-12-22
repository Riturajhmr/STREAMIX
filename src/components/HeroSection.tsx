import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Star, Calendar, Globe } from "lucide-react";
import { getTrending, TVShow, getImageUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const [featuredShow, setFeaturedShow] = useState<TVShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const trending = await getTrending();
        const withBackdrop = trending.filter((show) => show.backdrop_path);
        const randomIndex = Math.floor(Math.random() * Math.min(5, withBackdrop.length));
        setFeaturedShow(withBackdrop[randomIndex] || trending[0]);
      } catch (error) {
        console.error("Error fetching featured show:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (isLoading || !featuredShow) {
    return (
      <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen bg-background">
        <div className="absolute inset-0 skeleton" />
        <div className="absolute bottom-1/4 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 space-y-4">
          <div className="w-48 sm:w-64 h-10 sm:h-12 skeleton rounded-lg" />
          <div className="w-64 sm:w-80 md:w-96 h-16 sm:h-20 skeleton rounded-lg" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:w-32 h-11 sm:h-12 skeleton rounded-lg" />
            <div className="w-full sm:w-32 h-11 sm:h-12 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const year = featuredShow.first_air_date?.split("-")[0] || "N/A";
  const rating = featuredShow.vote_average.toFixed(1);
  const language = featuredShow.original_language?.toUpperCase() || "EN";

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <img
          src={getImageUrl(featuredShow.backdrop_path, "original")}
          alt={featuredShow.name}
          className="w-full h-full object-cover object-top"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-hero-gradient-bottom" />

      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-24 sm:pb-32 md:pb-0">
          <div className="max-w-xl lg:max-w-2xl stagger-children">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide mb-3 md:mb-4 text-foreground drop-shadow-2xl">
              {featuredShow.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 md:mb-6">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/90 rounded-full text-xs sm:text-sm font-medium text-primary-foreground">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                {rating}
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {year}
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                {language}
              </span>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-foreground/90 leading-relaxed mb-6 md:mb-8 line-clamp-2 sm:line-clamp-3">
              {featuredShow.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base rounded-lg w-full sm:w-auto"
                onClick={() => navigate(`/show/${featuredShow.id}`)}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current" />
                Watch Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-secondary/50 backdrop-blur-sm border-border/50 hover:bg-secondary/80 font-semibold px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base rounded-lg w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

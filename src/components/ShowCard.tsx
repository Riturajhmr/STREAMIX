import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { TVShow, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface ShowCardProps {
  show: TVShow;
  index?: number;
}

const ShowCard = ({ show, index = 0 }: ShowCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/show/${show.id}`);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] focus:outline-none animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={cn(
          "relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 ease-out",
          "ring-2 ring-transparent group-hover:ring-primary/50 group-focus:ring-primary/50",
          isHovered && "scale-105 shadow-2xl z-10"
        )}
      >
        {!isLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        <img
          src={getImageUrl(show.poster_path, "w500")}
          alt={show.name}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            isHovered && "scale-110"
          )}
          onLoad={() => setIsLoaded(true)}
        />

        <div
          className={cn(
            "absolute inset-0 bg-card-gradient opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        />

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300",
            isHovered && "opacity-100"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-primary-foreground text-primary-foreground ml-0.5" />
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transform translate-y-full transition-transform duration-300",
            isHovered && "translate-y-0"
          )}
        >
          <h3 className="font-semibold text-sm text-foreground truncate mb-1">
            {show.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-primary text-primary" />
              {show.vote_average.toFixed(1)}
            </span>
            <span>{show.first_air_date?.split("-")[0]}</span>
          </div>
        </div>

        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
            <Star className="w-3 h-3 fill-primary text-primary" />
            {show.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "mt-2 transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100"
        )}
      >
        <h3 className="font-medium text-sm text-foreground truncate">
          {show.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {show.first_air_date?.split("-")[0]}
        </p>
      </div>
    </button>
  );
};

export default ShowCard;

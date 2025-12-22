import { useState } from "react";
import { Play, Clock } from "lucide-react";
import { Episode, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface EpisodeCardProps {
  episode: Episode;
  showName: string;
  isFullScreen?: boolean;
}

const EpisodeCard = ({ episode, showName, isFullScreen = false }: EpisodeCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isFullScreen) {
    return (
      <div className="relative w-full h-screen snap-item flex items-center justify-center bg-background">
        <div className="relative w-full h-full max-w-4xl mx-auto">
          <div className="absolute inset-0">
            {!isLoaded && <div className="w-full h-full skeleton" />}
            <img
              src={getImageUrl(episode.still_path, "original")}
              alt={episode.name}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary mb-2">
                S{episode.season_number} E{episode.episode_number}
              </p>
              <h2 className="text-2xl md:text-4xl font-bold mb-3">
                {episode.name}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {episode.overview || "No description available."}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {episode.runtime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatRuntime(episode.runtime)}
                  </span>
                )}
                {episode.air_date && (
                  <span>{episode.air_date}</span>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm hover:bg-primary hover:scale-110 transition-all duration-300 btn-glow">
              <Play className="w-8 h-8 fill-primary-foreground text-primary-foreground ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative flex-shrink-0 w-40 md:w-56 aspect-video rounded-lg overflow-hidden">
        {!isLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={getImageUrl(episode.still_path, "w500")}
          alt={episode.name}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            isHovered && "scale-105"
          )}
          onLoad={() => setIsLoaded(true)}
        />
        
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}>
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 fill-primary-foreground text-primary-foreground ml-0.5" />
          </div>
        </div>

        {episode.runtime && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
            {formatRuntime(episode.runtime)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-sm text-primary font-medium">
              Episode {episode.episode_number}
            </span>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {episode.name}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
          {episode.overview || "No description available."}
        </p>
        {episode.air_date && (
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(episode.air_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default EpisodeCard;

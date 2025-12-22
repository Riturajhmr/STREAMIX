import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Star, 
  Calendar, 
  Globe, 
  Tv,
  ChevronDown 
} from "lucide-react";
import { 
  getTVShowDetails, 
  getSeasonEpisodes, 
  getSimilarShows,
  TVShowDetails, 
  Episode, 
  TVShow,
  getImageUrl 
} from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import EpisodeCard from "@/components/EpisodeCard";
import ShowCarousel from "@/components/ShowCarousel";
import { cn } from "@/lib/utils";

const ShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVShowDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [similarShows, setSimilarShows] = useState<TVShow[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "fullscreen">("list");

  useEffect(() => {
    if (!id) return;

    const fetchShow = async () => {
      setIsLoading(true);
      try {
        const [showData, similar] = await Promise.all([
          getTVShowDetails(parseInt(id)),
          getSimilarShows(parseInt(id)),
        ]);
        setShow(showData);
        setSimilarShows(similar);
        
        const firstSeason = showData.seasons.find(s => s.season_number > 0);
        if (firstSeason) {
          setSelectedSeason(firstSeason.season_number);
        }
      } catch (error) {
        console.error("Error fetching show:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  useEffect(() => {
    if (!id || !show) return;

    const fetchEpisodes = async () => {
      setIsEpisodesLoading(true);
      try {
        const episodesData = await getSeasonEpisodes(parseInt(id), selectedSeason);
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setIsEpisodesLoading(false);
      }
    };

    fetchEpisodes();
  }, [id, selectedSeason, show]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="relative h-[60vh] skeleton" />
          <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="w-64 h-10 skeleton rounded mb-4" />
            <div className="w-full max-w-2xl h-24 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Show not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const year = show.first_air_date?.split("-")[0] || "N/A";
  const rating = show.vote_average.toFixed(1);
  const language = show.original_language?.toUpperCase() || "EN";
  const genres = show.genres.map(g => g.name).join(", ");
  const seasons = show.seasons.filter(s => s.season_number > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}>
          <img
            src={getImageUrl(show.backdrop_path, "original")}
            alt={show.name}
            className="w-full h-full object-cover object-top"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-hero-gradient-bottom" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-10 p-2 rounded-full bg-secondary/50 backdrop-blur-sm hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 pb-8 md:pb-16">
            <div className="max-w-3xl stagger-children">
              {show.tagline && (
                <p className="text-primary font-medium mb-2 text-sm md:text-base">
                  {show.tagline}
                </p>
              )}

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide mb-4 text-foreground">
                {show.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 rounded-full text-sm font-medium text-primary-foreground">
                  <Star className="w-4 h-4 fill-current" />
                  {rating}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  {year}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  {language}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Tv className="w-4 h-4" />
                  {show.number_of_seasons} Seasons
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{genres}</p>

              <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-6 line-clamp-3">
                {show.overview}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base rounded-lg"
                  onClick={() => setViewMode("fullscreen")}
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Play
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-secondary/50 backdrop-blur-sm border-border/50 hover:bg-secondary/80 font-semibold px-8 h-12 text-base rounded-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  My List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Episodes</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                )}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("fullscreen")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === "fullscreen" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                )}
              >
                Full
              </button>
            </div>

            <Select
              value={selectedSeason.toString()}
              onValueChange={(value) => setSelectedSeason(parseInt(value))}
            >
              <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem
                    key={season.season_number}
                    value={season.season_number.toString()}
                  >
                    Season {season.season_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isEpisodesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="w-40 md:w-56 aspect-video skeleton rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 skeleton rounded" />
                  <div className="w-48 h-6 skeleton rounded" />
                  <div className="w-full h-12 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-2">
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                showName={show.name}
              />
            ))}
          </div>
        ) : (
          <div className="fixed inset-0 z-50 bg-background overflow-y-auto snap-container hide-scrollbar">
            <button
              onClick={() => setViewMode("list")}
              className="fixed top-4 right-4 z-50 p-2 rounded-full bg-secondary/80 backdrop-blur-sm hover:bg-secondary transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                showName={show.name}
                isFullScreen
              />
            ))}
          </div>
        )}
      </section>

      {similarShows.length > 0 && (
        <ShowCarousel title="More Like This" shows={similarShows} />
      )}

      <footer className="border-t border-border/50 py-8 mt-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display text-2xl text-primary">STREAMIX</span>
            <p className="text-sm text-muted-foreground">
              Powered by TMDB. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShowDetails;

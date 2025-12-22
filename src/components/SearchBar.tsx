import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { searchTVShows, TVShow, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchTVShows(query);
        setResults(data.results.slice(0, 8));
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSelect = useCallback(
    (show: TVShow) => {
      navigate(`/show/${show.id}`);
      setQuery("");
      setResults([]);
      onClose();
    },
    [navigate, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative container mx-auto px-4 pt-20 md:pt-28">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search TV shows..."
              className="w-full h-14 md:h-16 pl-12 pr-12 bg-secondary/80 border border-border/50 rounded-xl text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {showResults && results.length > 0 && (
            <div className="mt-4 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden animate-fade-in-up">
              {results.map((show, index) => (
                <button
                  key={show.id}
                  onClick={() => handleSelect(show)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left",
                    index !== results.length - 1 && "border-b border-border/30"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={getImageUrl(show.poster_path, "w92")}
                    alt={show.name}
                    className="w-12 h-16 object-cover rounded-md bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{show.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {show.first_air_date?.split("-")[0] || "N/A"} •{" "}
                      {show.vote_average.toFixed(1)} ★
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && results.length === 0 && query.trim() && !isLoading && (
            <div className="mt-4 p-8 text-center text-muted-foreground">
              No shows found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface BounceCardsProps {
  /**
   * Additional CSS classes for the container
   */
  className?: string
  /**
   * Array of image URLs to display
   */
  images?: string[]
  /**
   * Width of the container in pixels
   */
  containerWidth?: number
  /**
   * Height of the container in pixels
   */
  containerHeight?: number
  /**
   * Text to display on hover
   */
  hoverText?: string
  /**
   * Function to call when a card is clicked
   */
  onCardClick?: (index: number) => void
  /**
   * Array of transform styles for each card
   */
  transformStyles?: string[]
}

/**
 * A component that displays a group of cards with a smooth fade-in animation.
 */
export function BounceCards({
  className = "",
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  hoverText = "Voir plus",
  onCardClick,
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)"
  ]
}: BounceCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Observer pour détecter quand les cartes entrent dans la vue
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Gestionnaire de clic
  const handleCardClick = (index: number) => {
    if (onCardClick) {
      onCardClick(index);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        width: containerWidth,
        height: containerHeight
      }}
    >
      {images.map((src, idx) => {
        // Calculer le style de transformation final
        const baseTransform = transformStyles[idx] !== undefined ? transformStyles[idx] : "none";
        const finalTransform = isVisible 
          ? baseTransform
          : `${baseTransform} translateY(20px)`;
          
        return (
          <div
            key={idx}
            className={cn(
              "absolute w-[300px] aspect-[4/3] rounded-[20px] overflow-hidden cursor-pointer",
              "border-8 border-black dark:border-black/90",
              "shadow-lg dark:shadow-black/20",
              "transition-all duration-700 ease-out"
            )}
            style={{
              transform: finalTransform,
              top: "calc(50% - 150px)",
              left: "calc(50% - 150px)",
              zIndex: hoveredIndex === idx ? 10 : 1,
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${idx * 100}ms`,
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleCardClick(idx)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-300"
              src={src}
              alt={`card-${idx}`}
              loading="eager"
              style={{
                filter: hoveredIndex === idx ? "brightness(0.7)" : "none",
                transition: "filter 0.3s ease",
                transform: hoveredIndex === idx ? "scale(1.05)" : "scale(1)"
              }}
            />
            {hoveredIndex === idx && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-medium animate-fadeIn">
                <div className="bg-black/30 px-4 py-2 rounded-full">
                  {hoverText}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
} 
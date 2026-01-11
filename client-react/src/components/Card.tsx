//The original Flux pattern View (User Interaction) → Action → Dispatcher → Store → View (Re-render)
// Displays a single UNO card
// Props

import { useRef } from "react";
import "./Card.css";

interface Props {
  color: string | null;
  type: string | null;
  value?: number | null;
  back?: boolean;
  onClick?: () => void;
}

export default function Card({ color, type, value, back, onClick }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Optional: If you want to keep the scale effect on hover using JS (otherwise, use :hover in CSS)
  const handleMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.transform = "scale(1.1)";
  };
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "scale(1)";
  };

  function getCardImage() {
    if (back) return "/cards/Back.png";
    if (!color || !type) return "/cards/Deck.png";

    const c = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    const t = type.toLowerCase();

    if (t === "number" && value !== null && value !== undefined) {
      return `/cards/${c}_${value}.png`;
    }
    switch (t) {
      case "skip":
        return `/cards/${c}_Skip.png`;
      case "reverse":
        return `/cards/${c}_Reverse.png`;
      case "drawtwo":
      case "draw2":
        return `/cards/${c}_Draw.png`;
      case "wild":
        return `/cards/Wild.png`;
      case "wilddrawfour":
      case "wild_draw4":
        return `/cards/Wild_DrawFour.png`;
      default:
        return "/cards/Deck.png";
    }
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img
        src={getCardImage()}
        alt={type ?? "card"}
        className="card-image"
      />
    </div>
  );
}

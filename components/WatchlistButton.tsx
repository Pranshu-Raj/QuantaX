"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface WatchlistButtonProps {
  symbol: string;
}

export default function WatchlistButton({ symbol }: WatchlistButtonProps) {
  const handleClick = () => {
    console.log("Toggle watchlist for:", symbol);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="flex items-center gap-2 border-gray-700 hover:bg-gray-800"
    >
      <Star className="h-4 w-4" />
      Add to Watchlist
    </Button>
  );
}


import { useState } from "react";

export function useBoardFilters() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);

  const resetFilters = () => {
    setSearchQuery("");
    setShowOnlySaved(false);
    setShowOnlyMine(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    showOnlySaved,
    setShowOnlySaved,
    showOnlyMine,
    setShowOnlyMine,
    resetFilters,
  };
}

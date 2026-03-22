import { useEffect, useState } from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { useGroupStore } from "../useGroupStore";

const SearchFilterBar = () => {
  const activeTab = useGroupStore((state) => state.activeTab);
  const searchQuery = useGroupStore((state) => state.searchQuery);
  const setSearchQuery = useGroupStore((state) => state.setSearchQuery);
  const filters = useGroupStore((state) => state.filters);
  const setFilters = useGroupStore((state) => state.setFilters);
  const sortBy = useGroupStore((state) => state.sortBy);
  const setSortBy = useGroupStore((state) => state.setSortBy);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setIsFilterOpen(false);
  }, [activeTab]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const activeFilterCount = [
    filters.category !== "all",
    filters.memberCount !== "all",
    filters.activity !== "all",
    activeTab === "discover" && filters.privacy !== "all",
    sortBy !== "recently-active",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder={`${activeTab === "my-groups" ? "Search your groups..." : activeTab === "discover" ? "Discover new groups..." : "Search.."}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700/50 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen((currentValue) => !currentValue)}
          className={`groups-filter-toggle inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
            isFilterOpen || activeFilterCount > 0
              ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
              : "border-slate-700/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
          }`}
          aria-expanded={isFilterOpen}
        >
          <SlidersHorizontalIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isFilterOpen && (
        <div className="groups-filter-panel">
          <button
            type="button"
            onClick={() => {
              setFilters({
                category: "all",
                memberCount: "all",
                activity: "all",
                privacy: "all",
              });
              setSortBy("recently-active");
            }}
            className="groups-filter-reset text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
          >
            Reset filters
          </button>

          <div className="groups-filter-grid">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="groups-filter-select"
            >
              <option value="all">All Categories</option>
              <option value="medicine">Medicine</option>
              <option value="engineering">Engineering</option>
              <option value="law">Law</option>
              <option value="cs">Computer Science</option>
              <option value="general">General</option>
            </select>

            {/* Member Count Filter */}
            <select
              value={filters.memberCount}
              onChange={(e) => handleFilterChange("memberCount", e.target.value)}
              className="groups-filter-select"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (1-10)</option>
              <option value="medium">Medium (11-50)</option>
              <option value="large">Large (50+)</option>
            </select>

            {/* Activity Filter */}
            <select
              value={filters.activity}
              onChange={(e) => handleFilterChange("activity", e.target.value)}
              className="groups-filter-select"
            >
              <option value="all">All Activity</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Privacy Filter */}
            {activeTab === "discover" && (
              <select
                value={filters.privacy}
                onChange={(e) => handleFilterChange("privacy", e.target.value)}
                className="groups-filter-select"
              >
                <option value="all">All Privacy</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="groups-filter-select"
            >
              <option value="recently-active">Recently Active</option>
              <option value="newest">Newest</option>
              <option value="largest">Largest</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;

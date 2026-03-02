import { SearchIcon, XIcon } from "lucide-react";
import { useGroupStore } from "../useGroupStore";

const SearchFilterBar = () => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortBy,
    setSortBy,
  } = useGroupStore();

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Field */}
      <div className="relative">
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
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:text-sm text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-700/50 transition-colors"
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
          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:text-sm text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-700/50 transition-colors"
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
          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:text-sm text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-700/50 transition-colors"
        >
          <option value="all">All Activity</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Privacy Filter */}
        { activeTab === "discover" && (
          <select
            value={filters.privacy}
            onChange={(e) => handleFilterChange("privacy", e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:text-sm text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-700/50 transition-colors"
          >
            <option value="all">All Privacy</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select> )
        }

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:text-sm text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-700/50 transition-colors ml-auto "
        >
          <option value="recently-active">Recently Active</option>
          <option value="newest">Newest</option>
          <option value="largest">Largest</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;

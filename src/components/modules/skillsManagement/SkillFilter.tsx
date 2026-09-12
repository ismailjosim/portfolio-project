import ClearFiltersButton from '../../shared/ClearFiltersButton';
import RefreshButton from '../../shared/RefreshButton';
import SearchFilter from '../../shared/SearchFilter';

const SkillFilter = () => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      <div className="flex-1 sm:max-w-xs">
        <SearchFilter paramName="searchTerm" placeholder="Search skills..." />
      </div>
      <div className="flex items-center gap-2 justify-end">
        <ClearFiltersButton />
        <RefreshButton />
      </div>
    </div>
  );
};

export default SkillFilter;

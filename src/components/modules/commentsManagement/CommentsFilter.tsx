'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import ClearFiltersButton from '../../shared/ClearFiltersButton';
import RefreshButton from '../../shared/RefreshButton';
import SearchFilter from '../../shared/SearchFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const ALL = 'all';

const CommentsFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get('status') || ALL;

  const changeStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === ALL) {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 sm:max-w-md">
        <div className="flex-1">
          <SearchFilter paramName="searchTerm" placeholder="Search comments..." />
        </div>

        <Select value={currentStatus} onValueChange={changeStatus} disabled={isPending}>
          <SelectTrigger className="w-full sm:w-36 h-10">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <ClearFiltersButton />
        <RefreshButton />
      </div>
    </div>
  );
};

export default CommentsFilter;

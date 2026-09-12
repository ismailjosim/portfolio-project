'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Input } from '../ui/input';

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

const SearchFilter = ({
  placeholder = 'Search...',
  paramName = 'searchTerm',
}: SearchFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlParamValue = searchParams.get(paramName) || '';
  const [prevUrlValue, setPrevUrlValue] = useState(urlParamValue);
  const [value, setValue] = useState(urlParamValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize internal state during rendering when URL parameter changes externally
  if (urlParamValue !== prevUrlValue) {
    setPrevUrlValue(urlParamValue);
    setValue(urlParamValue);
  }

  // Clean up any pending debounce timeout when the URL parameter changes externally
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [urlParamValue]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateUrl = (newVal: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newVal.trim()) {
      params.set(paramName, newVal.trim());
      params.set('page', '1');
    } else {
      params.delete(paramName);
      params.delete('page');
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : window.location.pathname);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateUrl(newVal);
    }, 400);
  };

  const handleClear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setValue('');
    updateUrl('');
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-9 pr-8"
        value={value}
        onChange={handleChange}
        disabled={isPending}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;

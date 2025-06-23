
// components/news/NewsFilters.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface NewsFiltersProps {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

const categories = [
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'general', label: 'General' },
  { value: 'science', label: 'Science' },
  { value: 'health', label: 'Health' },
  { value: 'sports', label: 'Sports' },
  { value: 'entertainment', label: 'Entertainment' },
];

const stockQueries = [
  { value: 'NSE BSE stock market India', label: 'Stock Market' },
  { value: 'NIFTY SENSEX India', label: 'NIFTY & SENSEX' },
  { value: 'Indian IPO stocks', label: 'IPOs' },
  { value: 'cryptocurrency India', label: 'Crypto' },
  { value: 'mutual funds India', label: 'Mutual Funds' },
];

export const NewsFilters = ({ onCategoryChange, onSearch, onRefresh, loading }: NewsFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select onValueChange={onCategoryChange} defaultValue="business">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            placeholder="Search for specific news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" variant="outline">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        <Button onClick={onRefresh} disabled={loading} variant="outline" size="icon">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Quick searches:</span>
        {stockQueries.map((query) => (
          <Button
            key={query.value}
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery(query.value);
              onSearch(query.value);
            }}
          >
            {query.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
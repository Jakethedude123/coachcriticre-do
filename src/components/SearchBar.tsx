import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push('/search-results');
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        className="w-full p-4 pr-12 text-lg rounded-lg border-2 border-blue-400 shadow-lg focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        placeholder="Search for coaches by name, specialty, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="button-primary absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"
      >
        <FaSearch />
      </button>
    </div>
  );
} 
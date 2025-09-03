import { Search } from 'lucide-react';

export default function SearchInput({ searchTerm, onSearchChange }) {
  return (
    <div className='flex w-56 items-center gap-2 rounded-md border border-gray-300 px-2 py-1 text-xs transition-colors duration-200'>
      <Search className='size-3.5 text-gray-400 ' />

      <input
        name='search'
        type='text'
        placeholder='Search here...'
        value={searchTerm}
        onChange={e => onSearchChange?.(e.target.value)}
        className='outline-none'
      />
    </div>
  );
}

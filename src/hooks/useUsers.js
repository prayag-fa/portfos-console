import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { fetchUsers } from '@/lib/services/userService';

export const useUsers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);
  const [size, setSize] = useState(Number(searchParams.get('size')) || 20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const updateURL = (newPage, newSize) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('size', newSize.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const loadUsers = async (nextPage = page, nextSize = size) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers({ page: nextPage, size: nextSize });
      const items = Array.isArray(data?.content) ? data.content : [];
      setUsers(items);
      setTotalElements(Number(data?.totalElements || 0));
      setTotalPages(Number(data?.totalPages || 0));
      setPage(Number(data?.page ?? nextPage));
      setSize(Number(data?.size ?? nextSize));

      // Update URL without triggering a re-render
      updateURL(nextPage, nextSize);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(page, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  return {
    users,
    loading,
    error,
    page,
    size,
    totalElements,
    totalPages,
    setPage,
    setSize,
    refetch: loadUsers
  };
};

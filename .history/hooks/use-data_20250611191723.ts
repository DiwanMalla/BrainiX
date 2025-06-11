import useSWR from 'swr'
import { fetcher } from '@/lib/utils'

export function useUser() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    user: data,
    isLoading,
    isError: error,
  }
}

export function useCourses(params?: Record<string, any>) {
  const queryString = params ? new URLSearchParams(params).toString() : ''
  const { data, error, isLoading } = useSWR(
    `/api/courses${queryString ? `?${queryString}` : ''}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  return {
    courses: data?.courses ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    isError: error,
  }
}

export function useWishlist() {
  const { data, error, isLoading, mutate } = useSWR('/api/wishlist', fetcher)

  return {
    wishlist: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR('/api/cart', fetcher)

  return {
    cart: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

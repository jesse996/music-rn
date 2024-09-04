import { get_playlist_filters, show_playlist } from '@/adapter/qq'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

export const useCollList = (params: { offset: number; filterId: string }) => {
  const { filterId, offset } = params

  return useQuery({
    queryKey: ['qq_coll_list', params],
    queryFn: () => show_playlist(offset, filterId),
  })
}

export const useFilter = () => {
  return useSuspenseQuery({
    queryKey: ['qq_filter'],
    queryFn: () => get_playlist_filters(),
  })
}

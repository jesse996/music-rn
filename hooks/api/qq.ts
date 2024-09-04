import {
  bootstrap_track,
  get_playlist_filters,
  lyric,
  qq_get_playlist,
  show_playlist,
} from '@/adapter/qq'
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

export const usePlaylist = (params: { collId: string }) => {
  return useSuspenseQuery({
    queryKey: ['qq_play_list', params],
    queryFn: () => qq_get_playlist(params.collId),
  })
}

export const useSongDetail = (params: { id: string | null }) => {
  return useQuery({
    queryKey: ['qq_song_detail', params],
    queryFn: async () => {
      return {
        songPlayInfo: await bootstrap_track(params.id!),
        lyric: (await lyric(params.id!)).lyric,
      }
    },
    enabled: !!params.id,
  })
}

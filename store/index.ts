import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ITrack } from '@/types'

interface MusicState {
  songList: ITrack[]
  currentSongId: string | null

  setSongList: (tracks: ITrack[]) => void
  setCurrentSongId: (id: string | null) => void
}

export const useMusicStore = create<MusicState>()(
  immer((set) => ({
    songList: [],
    currentSongId: null,

    setSongList: (tracks: ITrack[]) => {
      set((state) => {
        state.songList = tracks
      })
    },
    setCurrentSongId: (id: string | null) => {
      set((state) => {
        state.currentSongId = id
      })
    },
  }))
)

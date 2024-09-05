import { useSongDetail } from '@/hooks/api/qq';
import { useMusicStore } from '@/store';
import { useEffect, useState } from 'react';
import { Spinner, View, Text, XStack, Image, Button } from 'tamagui';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showToastable } from 'react-native-toastable';
export default function AudioPlayer() {
  const pathname = usePathname()
  const [currSound, setCurrSound] = useState<Audio.Sound>();
  const [currStatus, setCurrStatus] = useState<AVPlaybackStatus>()

  const songList = useMusicStore((store) => store.songList);
  const currentSongId = useMusicStore((store) => store.currentSongId);
  const setCurrentSongId = useMusicStore((store) => store.setCurrentSongId);

  const currentSong = songList.find((item) => item.id === currentSongId);
  // console.log('currentSong:', currentSong);

  const { data: songDetail, isLoading } = useSongDetail({
    id: currentSongId,
  });

  const onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void = async (status) => {
    // if (!status.isLoaded) {
    //   if (status.error) {
    //     console.log(`FATAL PLAYER ERROR: ${status.error}`);
    //   }
    // } else {
    //   if (status.isPlaying) {

    //   }


    // }
    setCurrStatus(status)
  }


  async function playSound(url: string) {
    console.log('Loading Sound');
    Audio.setAudioModeAsync({
      staysActiveInBackground: true
    })
    const { sound } = await Audio.Sound.createAsync({ uri: url });

    setCurrSound(sound);

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    console.log('in useEffect,songDetail:', songDetail?.songPlayInfo);

    if (currSound) {
      currSound.unloadAsync()
    }
    if (songDetail?.songPlayInfo) {
      playSound(songDetail.songPlayInfo?.url);
    } else {
      showToastable({ message: "暂无版权", status: 'danger' })
      onEnded();
    }
    return () => {
      currSound?.unloadAsync();
    }
  }, [songDetail]);


  const onEnded = () => {
    currSound?.unloadAsync()

    const curr = songList.find((item) => item.id === currentSongId);
    if (!curr) {
      showToastable({ message: "当前歌曲不存在", status: 'danger' })
      return;
    }

    const index = songList.findIndex((item) => item.id === currentSongId);

    if (index === songList.length - 1) {
      setCurrentSongId(songList[0].id);
    } else {
      setCurrentSongId(songList[index + 1].id);
    }
  };

  if (isLoading) {
    return <Spinner />
  }

  if (!currentSongId || !songDetail) {
    currSound?.unloadAsync()
    return null;
  }


  return (
    <View position='absolute' left={0} right={0} bottom={pathname === '/' ? '$8' : '0'}>
      <XStack backgroundColor={'white'} justifyContent='space-between' alignItems='center' px="$4" py="$2" >
        <Image source={{ uri: currentSong?.img_url, width: 50, height: 50 }}></Image>
        <Text>{currentSong?.title}</Text>
        <Ionicons name={currStatus?.isLoaded && currStatus.isPlaying ? 'pause' : 'play'} size={24} color="black" onPress={async () => {
          // sound?.pauseAsync()
          if (currStatus?.isLoaded && currStatus.isPlaying) {
            await currSound?.pauseAsync();
          } else {
            await currSound?.playAsync();
          }
        }} />
      </XStack>
    </View>
  );
}

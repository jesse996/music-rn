import { IPlayList } from "@/adapter/qq";
import { usePlaylist } from "@/hooks/api/qq";
import { useMusicStore } from "@/store";
import { IInfo } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList } from "react-native";
import { View, Text, ScrollView, Spinner, Button, Card, H2, Paragraph, XStack, Image, SizableText, YStack, ListItem } from "tamagui";

export default function Playlist() {
  const { id } = useLocalSearchParams()
  const { data: { tracks, info } } = usePlaylist({ collId: id as string })

  const setSongList = useMusicStore((store) => store.setSongList);
  const setCurrentSongId = useMusicStore((store) => store.setCurrentSongId);

  // useEffect(() => {
  //   setSongList(tracks);
  // }, [tracks, setSongList]);

  return <View>
    <FlatList
      data={tracks}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ListItem
          title={item.title}
          subTitle={item.artist}
          icon={<Image source={{ uri: item.img_url, width: 50, height: 50 }}></Image>}
          iconAfter={<SizableText size={'$1'}>{item.album}</SizableText>}
          onPress={() => {
            setCurrentSongId(item.id)
            setSongList(tracks);
          }}
        />
      )
      }
      ListEmptyComponent={
        < View >
          <Text style={{ textAlign: 'center', marginTop: 10 }}>暂无数据</Text>
        </View >
      }
      ListHeaderComponent={<SongCard info={info} />}
      // style={{ paddingBottom: 50 }}
      ListFooterComponent={
        <View height={50} ><SizableText textAlign="center" mt='$3'>到底啦~</SizableText></View>
      }
    />
  </View >
}

const SongCard = (props: { info: IInfo }) => {
  const info = props.info


  return <Card elevate w={'100%'} size={'$5'} bordered {...props} >
    <Card.Header padded>
      <H2>{info.title}</H2>
      <Paragraph theme="alt2">{info.source_url}</Paragraph>
    </Card.Header>
    <Card.Background fullscreen={false}>
      <Image
        objectFit="cover"
        alignSelf="center"
        source={{
          width: 100,
          height: 200,
          uri: info.cover_img_url
        }}
        width="100%"
      />
    </Card.Background>
  </Card>

}
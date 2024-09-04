import { IPlayList } from "@/adapter/qq";
import { usePlaylist } from "@/hooks/api/qq";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import { View, Text, ScrollView, Spinner, Button, Card, H2, Paragraph, XStack, Image, SizableText, YStack, ListItem } from "tamagui";

export default function Playlist() {
  const { id } = useLocalSearchParams()
  const { data, isLoading } = usePlaylist({ collId: id as string })

  if (isLoading) return <Spinner />

  return <View>

    <FlatList
      data={data?.tracks}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (


        <ListItem
          title={item.title}
          subTitle={item.artist}
          icon={<Image source={{ uri: item.img_url, width: 50, height: 50 }}></Image>}
          iconAfter={<SizableText size={'$1'}>{item.album}</SizableText>}
        />


      )
      }
      ListEmptyComponent={
        < View >
          <Text style={{ textAlign: 'center', marginTop: 10 }}>暂无数据</Text>
        </View >
      }

      ListHeaderComponent={<SongCard data={data!} />}

    />
  </View >
}

const SongCard = (props: { data: IPlayList }) => {
  const data = props.data
  return <Card elevate w={'100%'} size={'$5'} bordered {...props} >
    <Card.Header padded>
      <H2>{data.info.title}</H2>
      <Paragraph theme="alt2">{data.info.source_url}</Paragraph>
    </Card.Header>
    <Card.Background fullscreen={false}>
      <Image
        objectFit="cover"
        alignSelf="center"
        source={{
          width: 100,
          height: 200,
          uri: data.info.cover_img_url
        }}
        width="100%"
      />
    </Card.Background>
  </Card>

}
import { FlatList, StyleSheet, Text, View } from 'react-native';

// import Button from '@/components/Button';
import { useCollList, useFilter } from '@/hooks/api/qq';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, H5, Separator, SizableText, Tabs, TabsContentProps, XStack, YStack, ZStack, ScrollView, Spinner, Image } from 'tamagui';
import { useInfiniteQuery } from '@tanstack/react-query';
import { show_playlist } from '@/adapter/qq';
import { Link } from 'expo-router';
const PlaceholderImage = require('@/assets/images/background-image.png');

export default function HomeScreen() {
  const [filterId, setFilterId] = useState('');
  // const { data, isLoading } = useCollList({ offset: 0, filterId })
  const { data: { recommend, all } } = useFilter()

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["collList", filterId],
    queryFn: ({ pageParam }) =>
      show_playlist(pageParam, filterId),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => pages.flat().length,
  });

  // if (isLoading) return <Text>loading</Text>

  return (
    <SafeAreaView>
      {/* 分类1 */}
      <Tabs
        defaultValue="recommend"
        orientation="horizontal"
        flexDirection="column"
        // width='100%'
        borderRadius="$4"
        borderWidth="$0.25"
        borderColor="$borderColor"
      >
        <Tabs.List
          disablePassBorderRadius="bottom"
        >
          {/* <ScrollView horizontal > */}

          <Tabs.Tab value={'recommend'} px='$3.5'>
            <SizableText >推荐</SizableText>
          </Tabs.Tab>
          {all.map((filter, index) => (
            <Tabs.Tab value={filter.category} key={index} flex={1} px='$1' >
              <SizableText >{filter.category}</SizableText>
            </Tabs.Tab>
          ))}

          {/* </ScrollView> */}
        </Tabs.List>
        <Separator />

        <TabsContent value="recommend" >
          <ScrollView horizontal gap='$2'>
            {recommend.map((item, index) => (
              <Button key={index} onPress={() => setFilterId(item.id)} mr={'$1.5'}>
                {item.name}
              </Button>
            ))}
          </ScrollView>
        </TabsContent>

        {all.map(({ category, filters }, index) => (
          <TabsContent key={index} value={category} >
            <ScrollView horizontal >

              {filters.map((item, index) => (
                <Button key={index} onPress={() => setFilterId(item.id)} mr={'$1.5'}>
                  {item.name}
                </Button>
              ))}
            </ScrollView>
          </TabsContent>

        ))}

      </Tabs>
      {isLoading ? <Spinner /> : null}

      <FlatList
        data={data?.pages.flat()}
        numColumns={2}
        style={{ marginBottom: 50 }}
        onEndReached={() => fetchNextPage()}

        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/playlist/[id]', params: { id: item.id } }} asChild>
            <XStack
              padding="$2"
              flex={1}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              borderBottomWidth="$0.25"
              borderColor="$borderColor"
            >
              <YStack >
                <Image source={{ uri: item.cover_img_url }} style={{ width: '100%', height: 100 }} />
                <SizableText fontFamily="$body">{item.title}</SizableText>
              </YStack>
            </XStack>
          </Link>
        )}
        ListEmptyComponent={
          <View >
            {(!isLoading) && <Text style={{ textAlign: 'center', marginTop: 10 }}>暂无数据</Text>}
          </View>
        }
        ListFooterComponent={
          <View style={{ height: 100, }}>
            {isFetchingNextPage && <Spinner />}
          </View>
        }
      />
    </SafeAreaView >
  );
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}
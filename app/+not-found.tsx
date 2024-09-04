import { Link, Stack, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SizableText } from 'tamagui';



export default function NotFoundScreen() {
  const pathname = usePathname()
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <SizableText >This screen doesn't exist.  {JSON.stringify(pathname)}</SizableText>
        <Link href="/" style={styles.link}>
          <SizableText >Go to home screen!</SizableText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

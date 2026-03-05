import { View, Text, StyleSheet } from 'react-native';

export default function ReadingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Readings</Text>
      <Text style={styles.sub}>Palm reading and tarot feeds will live here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#031B2A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#EFE5C9',
    fontSize: 34,
    fontWeight: '700',
  },
  sub: {
    marginTop: 10,
    color: '#9BB3BC',
    fontSize: 16,
    textAlign: 'center',
  },
});

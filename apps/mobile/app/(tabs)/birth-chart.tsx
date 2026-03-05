import { View, Text, StyleSheet } from 'react-native';

export default function BirthChartScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Birth Chart</Text>
      <Text style={styles.sub}>Your chart wheel and planetary positions will appear here.</Text>
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

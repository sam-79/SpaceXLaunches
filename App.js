import { StyleSheet, Text, View, StatusBar } from 'react-native';
import SpaceXLaunchList from './src/SpaceXLaunchList';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";


const client = new ApolloClient({
  uri: "https://api.spacex.land/graphql/",
  cache: new InMemoryCache()
});

export default function App() {
  
  return (
    
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <StatusBar StatusBarStyle={"auto"} />
        <Text style={styles.title}>SpaceX Launches</Text>
        <SpaceXLaunchList />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection:'column',
    marginBottom:10,
  },
  title: {
    fontSize: 30,
    padding: 10,
    backgroundColor: "#4D77FF",
    color: "#fff",
  },
});



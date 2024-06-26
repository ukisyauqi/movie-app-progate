import React, { useCallback, useState } from 'react'
import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Movie } from '../types/app'
import MovieItem from '../components/movies/MovieItem'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/app'

type FavoriteScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Favorite'
>

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const navigation = useNavigation<FavoriteScreenNavigationProp>()

  const fetchFavoriteMovies = async (): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        setFavoriteMovies(favMovieList)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteMovies()
    }, []),
  )

  const renderItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      size={styles.movieItem}
      coverType="poster"
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
    />
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      <FlatList
        data={favoriteMovies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorite movies found.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  movieItem: {
    width: Dimensions.get('window').width / 3 - 12,
    height: 200,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
})

export default Favorite

import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, Movie } from '../types/app'
import { API_ACCESS_TOKEN } from '@env'
import MovieItem from '../components/movies/MovieItem'

type MoviesByGenreScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MoviesByGenre'
>

const MoviesByGenreScreen = ({
  route,
  navigation,
}: MoviesByGenreScreenProps): JSX.Element => {
  const { genreId } = route.params
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    fetchMoviesByGenre(genreId)
  }, [genreId])

  const fetchMoviesByGenre = async (genreId: number) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`,
        options,
      )
      const data = await response.json()
      setMovies(data.results)
    } catch (error) {
      console.error(error)
    }
  }

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      size={styles.movieItem}
      coverType="poster"
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
    />
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Berdasarkan Genre</Text>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        style={styles.movieList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  movieList: {
    paddingTop: 16,
  },
  movieItem: {
    width: 110,
    height: 200,
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
})

export default MoviesByGenreScreen

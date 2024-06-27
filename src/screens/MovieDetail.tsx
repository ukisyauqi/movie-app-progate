/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ACCESS_TOKEN } from '@env'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Movie } from '../types/app'
import MovieList from '../components/movies/MovieList'
import AsyncStorage from '@react-native-async-storage/async-storage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params

  const [movie, setMovie] = useState<Movie>()
  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  const fetchData = (): void => {
    // Gantilah dengan akses token Anda
    if (API_ACCESS_TOKEN.length == null) {
      throw new Error('ENV not found')
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(`https://api.themoviedb.org/3/movie/${id}`, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      console.log(initialData)

      let favMovieList: Movie[] = []

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie]
      } else {
        favMovieList = [movie]
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(true)
    } catch (error) {
      console.log(error)
    }
  }

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      console.log(initialData)

      if (initialData !== null) {
        let favMovieList: Movie[] = JSON.parse(initialData)
        favMovieList = favMovieList.filter((movie) => movie.id !== id)

        await AsyncStorage.setItem(
          '@FavoriteList',
          JSON.stringify(favMovieList),
        )
        setIsFavorite(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIsFavorite = async (id: number): Promise<boolean> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        return favMovieList.some((movie) => movie.id === id)
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }

  useEffect(() => {
    fetchData()
    checkIsFavorite(id).then((isFav) => setIsFavorite(isFav))
  }, [id])

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {movie && (
        <>
          <ImageBackground
            resizeMode="cover"
            style={styles.backgroundImage}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
          >
            <LinearGradient
              colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
              locations={[0.6, 0.8]}
              style={styles.gradientStyle}
            >
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <View style={styles.wrapper}>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={16} color="yellow" />
                  <Text style={styles.rating}>
                    {movie.vote_average.toFixed(1)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={
                    isFavorite
                      ? () => removeFavorite(movie.id)
                      : () => addFavorite(movie)
                  }
                >
                  <FontAwesome
                    name={isFavorite ? 'heart' : 'heart-o'}
                    size={24}
                    color="red"
                    style={styles.heartIcon}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>

          <Text
            style={{
              padding: 20,
            }}
          >
            {movie.overview}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700' }}>Original Language</Text>
              <Text>{movie.original_language}</Text>
              <Text style={{ fontWeight: '700', marginTop: 8 }}>
                Release Date
              </Text>
              <Text>{movie.release_date.toString()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700' }}>Popularity</Text>
              <Text>{movie.popularity.toFixed(2)}</Text>
              <Text style={{ fontWeight: '700', marginTop: 8 }}>
                Vote Count
              </Text>
              <Text>{movie.vote_count}</Text>
            </View>
          </View>

          <MovieList
            title={'Recomendation'}
            path={`movie/${movie.id}/recommendations`}
            coverType={'poster'}
            key={movie.title}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    marginRight: 4,
    width: '100%',
    height: 300,
  },
  movieTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
  },
  heartIcon: {
    marginRight: 8,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
})

export default MovieDetail

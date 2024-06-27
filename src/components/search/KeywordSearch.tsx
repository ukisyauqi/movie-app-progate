import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../types/app'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { API_ACCESS_TOKEN } from '@env'
import MovieItem from '../movies/MovieItem'

type KeywordSearchNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MovieDetail'
>

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [movies, setMovies] = useState<any[]>([])
  const navigation = useNavigation<KeywordSearchNavigationProp>()

  const fetchMovies = async (searchKeyword: string) => {
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

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}`,
        options,
      )
      const data = await response.json()
      setMovies(data.results)
      console.log(data.results)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = () => {
    console.log(keyword)
    fetchMovies(keyword)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = ({ item }: { item: any }) => (
    <MovieItem
      movie={item}
      size={styles.movieItem}
      coverType="poster"
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
    />
  )

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by keyword..."
        value={keyword}
        onChangeText={setKeyword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No movies found.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#8978A4',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  movieItem: {
    width: 100,
    height: 200,
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
})

export default KeywordSearch

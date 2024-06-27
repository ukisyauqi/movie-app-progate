import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/app'
import { API_ACCESS_TOKEN } from '@env'

type Genre = {
  id: number
  name: string
}

type CategorySearchNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MoviesByGenre'
>

const CategorySearch = (): JSX.Element => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const navigation = useNavigation<CategorySearchNavigationProp>()

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    if (!API_ACCESS_TOKEN) {
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
        'https://api.themoviedb.org/3/genre/movie/list?language=en',
        options,
      )
      const data = await response.json()
      setGenres(data.genres)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGenreSelect = (id: number) => {
    setSelectedGenre(id)
  }

  const handleSubmit = () => {
    if (selectedGenre !== null) {
      navigation.navigate('MoviesByGenre', { genreId: selectedGenre })
    }
  }

  const renderGenreItem = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.genreItem,
        selectedGenre === item.id && styles.selectedGenreItem,
      ]}
      onPress={() => handleGenreSelect(item.id)}
    >
      <Text
        style={[
          styles.genreText,
          selectedGenre === item.id && styles.selectedGenreText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Genre</Text>
      <FlatList
        data={genres}
        renderItem={renderGenreItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.genreList}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
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
  genreList: {
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  genreItem: {
    backgroundColor: '#C0B4D5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  selectedGenreItem: {
    backgroundColor: '#A3A1D5',
  },
  genreText: {
    color: '#525252',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedGenreText: {
    color: '#FFFFFF',
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
})

export default CategorySearch

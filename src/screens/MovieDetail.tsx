import React from 'react'
import { View, Text, Button } from 'react-native'

const MovieDetail = ({ navigation }: any): any => {
  const fetchData = (): void => {
    // Gantilah dengan akses token Anda
    const ACCESS_TOKEN =
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3M2MxMTg4YTgyNDBlMmY2MWVhZWZjYzBkZDA2YjE0NiIsIm5iZiI6MTcxOTM4MjU1Ni40Nzg2NjMsInN1YiI6IjYwYTQ4MzVlY2I3NWQxMDA1NjlhZDgwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iEm1m8zxR2QXy1f9oAdg8Xwpq5ICq9JAZcTwFZSC2qs'

    const url =
      'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Movie Detail Page</Text>
      <Button
        title="Fetch Data"
        onPress={() => {
          fetchData()
        }}
      />
    </View>
  )
}

export default MovieDetail

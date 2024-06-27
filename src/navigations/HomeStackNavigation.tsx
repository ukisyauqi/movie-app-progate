import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MovieDetail from '../screens/MovieDetail'
import Home from '../screens/Home'

const Stack = createNativeStackNavigator()
export default function HomeStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeStack" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="MovieDetail" component={MovieDetail} />
      </Stack.Navigator>
  )
}

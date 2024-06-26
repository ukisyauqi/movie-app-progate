import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MovieDetail from '../screens/MovieDetail'
import Home from '../screens/Home'
import { RootStackParamList } from '../types/app'

const Stack = createNativeStackNavigator<RootStackParamList>()
export default function HomeStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MovieDetail" component={MovieDetail} />
    </Stack.Navigator>
  )
}

import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import User from '../components/User'

const HomeScreen = () => {
  const nav = useNavigation()
  const { userId, setUserId } = useContext(UserType)
  const [users, setUsers] = useState([])

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons
            onPress={() => nav.navigate('Chats')}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => nav.navigate('Friends')}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    })
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.userId
        setUserId(userId)

        const response = await axios.get(
          `https://chat-app-api-exv9.onrender.com/users/${userId}`
        )
        setUsers(response.data)
      } catch (err) {
        console.log('Error retrieving users ', err)
      }
    }
    fetchUsers()
  }, [])

  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.map((user) => {
          console.log(user.image)
          return <User key={user._id} user={user} />
        })}
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})

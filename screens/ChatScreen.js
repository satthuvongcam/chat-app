import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'
import UserChat from '../components/UserChat'

const ChatScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([])
  const { userId, setUserId } = useContext(UserType)
  const nav = useNavigation()

  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `https://chat-app-api-exv9.onrender.com/accepted-friends/${userId}`
        )
        const data = await response.json()
        if (response.ok) {
          setAcceptedFriends(data)
        }
      } catch (err) {
        console.log('Err show the accepted friends ', err)
      }
    }
    acceptedFriendsList()
  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((friend) => (
          <UserChat key={friend._id} friend={friend} />
        ))}
      </Pressable>
    </ScrollView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})

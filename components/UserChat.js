import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext'

const UserChat = ({ friend }) => {
  const nav = useNavigation()
  const { userId, setUserId } = useContext(UserType)
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8000/messages/${userId}/${friend._id}`
      )
      const data = await response.json()
      console.log(data)

      if (response.ok) {
        setMessages(data)
      } else {
        console.log('Error showing messages ', response.status.message)
      }
    } catch (err) {
      console.log('Error fetching messages ', err)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [messages])

  const getLastMessage = () => {
    const userMessage = messages.filter(
      (message) => message.messageType === 'text'
    )

    const n = userMessage.length

    return userMessage[n - 1]
  }

  const lastMessage = getLastMessage()
  console.log('lastMessage: ', lastMessage)

  const formatTime = (time) => {
    const options = { hour: 'numeric', minute: 'numeric' }
    return new Date(time).toLocaleString('en-US', options)
  }

  return (
    <Pressable
      onPress={() =>
        nav.navigate('Messages', {
          recepientId: friend._id,
        })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 0.7,
        borderColor: '#D0D0D0',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'cover' }}
        source={{ uri: friend?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{friend?.name}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: 'gray', fontWeight: '500' }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: '400', color: '#585858' }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  )
}

export default UserChat

const styles = StyleSheet.create({})

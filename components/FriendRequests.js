import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

const FriendRequests = ({
  friendRequest,
  friendRequests,
  setFriendRequests,
}) => {
  const { userId, setUserId } = useContext(UserType)
  const nav = useNavigation()

  const handleAcceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        'https://chat-app-api-exv9.onrender.com/friend-request/accept',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      )
      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        )
        nav.navigate('Chats')
      }
    } catch (err) {
      console.log('Error accept in the friend request ', err)
    }
  }

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: friendRequest.image }}
      />
      <Text
        style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, flex: 1 }}
      >
        {friendRequest?.name} send you a friend request
      </Text>
      <Pressable
        onPress={() => handleAcceptRequest(friendRequest._id)}
        style={{ backgroundColor: '#0066b2', padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>Accept</Text>
      </Pressable>
    </Pressable>
  )
}

export default FriendRequests

const styles = StyleSheet.create({})

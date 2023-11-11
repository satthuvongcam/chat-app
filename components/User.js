import { Pressable, StyleSheet, Image, View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'

const User = ({ user }) => {
  const { userId, setUserId } = useContext(UserType)
  const [requestSent, setRequestSent] = useState(false)
  const [friendRequests, setFriendRequests] = useState([])
  const [userFriends, setUserFriends] = useState([])

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `https://chat-app-api-exv9.onrender.com/friend-requests/sent/${userId}`
        )

        const data = await response.json()

        if (response.ok) {
          setFriendRequests(data)
        } else {
          console.log('Error retrieving friend requests ', response.status)
        }
      } catch (err) {
        console.log('Error retrieving friend requests ', err)
      }
    }
    fetchFriendRequests()
  }, [])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `https://chat-app-api-exv9.onrender.com/friends/${userId}`
        )

        const data = await response.json()

        if (response.ok) {
          setUserFriends(data)
        } else {
          console.log('Error retrieving friends ', response.status)
        }
      } catch (err) {
        console.log('Error retrieving friends ', err)
      }
    }
    fetchFriends()
  }, [])

  const handleSendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(
        'https://chat-app-api-exv9.onrender.com/friend-request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUserId, selectedUserId }),
        }
      )
      if (response.ok) {
        setRequestSent(true)
      }
    } catch (err) {
      console.log('Error', err)
    }
  }

  return (
    <Pressable style={styles.userContainer}>
      <View>
        <Image style={styles.userImage} source={{ uri: user.image }} />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{user?.name}</Text>
        <Text style={{ marginTop: 4, color: 'gray' }}>{user?.email}</Text>
      </View>

      {userFriends.includes(user._id) ? (
        <Pressable
          style={{
            backgroundColor: '#82CD47',
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white' }}>Friends</Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some(
          (friendRequest) => friendRequest._id === user._id
        ) ? (
        <Pressable
          style={{
            backgroundColor: 'gray',
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => handleSendFriendRequest(userId, user._id)}
          style={styles.addFriendBtn}
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 13 }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  )
}

export default User

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  addFriendBtn: {
    backgroundColor: '#567189',
    padding: 10,
    borderRadius: 6,
    width: 105,
  },
})

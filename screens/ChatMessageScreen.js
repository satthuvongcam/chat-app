import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
} from 'react-native'
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import EmojiSelector from 'react-native-emoji-selector'
import { UserType } from '../UserContext'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import {
  Ionicons,
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from '@expo/vector-icons'

const ChatMessageScreen = () => {
  const [isShowEmojiSelector, setIsShowEmojiSelector] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedMessages, setSelectedMessages] = useState([])
  const [message, setMessage] = useState('')
  const [recepientData, setRecepientData] = useState()
  const { userId, setUserId, messages, setMessages } = useContext(UserType)
  const route = useRoute()
  const { recepientId } = route.params
  const nav = useNavigation()

  const scrollViewRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }

  const handleContentSizeChange = () => {
    scrollToBottom()
  }

  const handleShowEmojiSelector = () => {
    setIsShowEmojiSelector(!isShowEmojiSelector)
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://chat-app-api-exv9.onrender.com/messages/${userId}/${recepientId}`
      )
      const data = await response.json()

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
  }, [])

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `https://chat-app-api-exv9.onrender.com/user/${recepientId}`
        )
        const data = await response.json()
        setRecepientData(data)
      } catch (err) {
        console.log('Error retrieving details ', err)
      }
    }
    fetchRecepientData()
  }, [])

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData()
      formData.append('senderId', userId)
      formData.append('recepientId', recepientId)

      // if the message type id image or a normal text
      if (messageType === 'image') {
        formData.append('messageType', 'image')
        formData.append('imageFile', {
          uri: imageUri,
          name: 'image.jpg',
          type: 'image/jpeg',
        })
      } else {
        formData.append('messageType', 'text')
        formData.append('messageText', message)
      }

      const response = await fetch(
        'https://chat-app-api-exv9.onrender.com/messages',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (response.ok) {
        setMessage('')
        setSelectedImage('')

        fetchMessages()
      }
    } catch (err) {
      console.log('Error sending message ', err)
    }
  }

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons
            onPress={() => nav.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: 'cover',
                }}
                source={{ uri: recepientData?.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold' }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="md-arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => handleDeleteMessages(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    })
  }, [recepientData, selectedMessages])

  const formatTime = (time) => {
    const options = { hour: 'numeric', minute: 'numeric' }
    return new Date(time).toLocaleString('en-US', options)
  }

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      handleSend('image', result.uri)
    }
  }

  const handleSelectMessage = async (message) => {
    // check if the message is already selected
    try {
      const isSelected = selectedMessages.includes(message._id)

      if (isSelected) {
        setSelectedMessages((prev) => prev.filter((id) => id !== message._id))
      } else {
        setSelectedMessages((prev) => [...prev, message._id])
      }
    } catch (err) {
      console.log('Error selecting messages ', err)
    }
  }

  const handleDeleteMessages = async (messageIds) => {
    try {
      const response = await fetch(
        'https://chat-app-api-exv9.onrender.com/deleteMessages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: messageIds }),
        }
      )

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        )

        fetchMessages()
      } else {
        console.log('error deleting messages', response.status)
      }
    } catch (error) {
      console.log('error deleting messages', error)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((messageItem) => {
          if (messageItem.messageType === 'text') {
            const isSelected = selectedMessages.includes(messageItem._id)
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(messageItem)}
                key={messageItem._id}
                style={[
                  messageItem?.senderId?._id === userId
                    ? {
                        alignSelf: 'flex-end',
                        backgroundColor: '#DCF8C6',
                        padding: 8,
                        maxWidth: '60%',
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: 'flex-start',
                        backgroundColor: 'white',
                        padding: 8,
                        borderRadius: 7,
                        margin: 10,
                        maxWidth: '60%',
                      },

                  isSelected && { width: '100%', backgroundColor: '#F0FFFF' },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? 'right' : 'left',
                  }}
                >
                  {messageItem?.message}
                </Text>
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 10,
                    color: 'gray',
                    marginTop: 5,
                  }}
                >
                  {formatTime(messageItem.timeStamp)}
                </Text>
              </Pressable>
            )
          }
          if (messageItem.messageType === 'image') {
            const filename = messageItem.imageUrl.split('/').pop()
            const sourceImage = `https://chat-app-api-exv9.onrender.com/files/${filename}`
            return (
              <Pressable
                key={messageItem._id}
                style={[
                  messageItem?.senderId?._id === userId
                    ? {
                        alignSelf: 'flex-end',
                        padding: 8,
                        maxWidth: '60%',
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: 'flex-start',
                        backgroundColor: 'white',
                        padding: 8,
                        borderRadius: 7,
                        margin: 10,
                        maxWidth: '60%',
                      },
                ]}
              >
                <View>
                  <Image
                    source={{
                      uri: sourceImage,
                    }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: 'right',
                      fontSize: 10,
                      color: 'white',
                      position: 'absolute',
                      right: 10,
                      bottom: 7,
                      marginTop: 5,
                    }}
                  >
                    {formatTime(messageItem?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            )
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: isShowEmojiSelector ? 0 : 8,
        }}
      >
        <Entypo
          onPress={handleShowEmojiSelector}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your Message..."
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo
            onPress={handlePickImage}
            name="camera"
            size={24}
            color="gray"
          />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={() => handleSend('test')}
          style={{
            backgroundColor: '#007bff',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
        </Pressable>
      </View>

      {isShowEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji)
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  )
}

export default ChatMessageScreen

const styles = StyleSheet.create({})

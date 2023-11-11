import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('')
  const nav = useNavigation()

  const handleRegister = async () => {
    try {
      const user = {
        name: name,
        email: email,
        password: password,
        image: image,
      }

      // send a POST request to the backend API to register the user
      const response = await axios.post(
        'https://chat-app-api-exv9.onrender.com/register',
        user
      )
      console.log(response)
      Alert.alert(
        'Registration successful',
        'You have been registered succesfully'
      )
      setName('')
      setEmail('')
      setPassword('')
      setImage('')
    } catch (err) {
      Alert.alert('Registration Error', 'An error occurred while registering')
      console.log('Registration failed ', err)
    }
  }

  return (
    <View style={styles.registerContainer}>
      <KeyboardAvoidingView>
        <View style={styles.registerForm}>
          <Text style={styles.registerFormHeader}>Sign Up</Text>
          <Text style={styles.registerFormSubHeader}>
            Sign Up to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={styles.formLabel}>Name</Text>
            <TextInput
              style={[styles.formInput, { fontSize: name ? 18 : 18 }]}
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={[styles.formInput, { fontSize: email ? 18 : 18 }]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View>
            <Text style={styles.formLabel}>Password</Text>
            <TextInput
              style={[styles.formInput, { fontSize: password ? 18 : 18 }]}
              secureTextEntry={true}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View>
            <Text style={styles.formLabel}>Image</Text>
            <TextInput
              style={[styles.formInput, { fontSize: image ? 18 : 18 }]}
              placeholder="Enter your image"
              value={image}
              onChangeText={(text) => setImage(text)}
            />
          </View>
          <Pressable onPress={handleRegister} style={styles.formBtn}>
            <Text style={styles.formBtnText}>Register</Text>
          </Pressable>
          <Pressable onPress={() => nav.goBack()} style={{ marginTop: 15 }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
              }}
            >
              Already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  registerForm: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerFormHeader: {
    color: '#4A55A2',
    fontSize: 17,
    fontWeight: '600',
  },
  registerFormSubHeader: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 15,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  formInput: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
  },
  formBtn: {
    width: 200,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 6,
  },
  formBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

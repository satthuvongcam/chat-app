import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigation()

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        if (token) {
          nav.replace('Home')
        } else {
        }
      } catch (err) {
        console.log('Error ', err)
      }
    }
    checkLoginStatus()
  }, [])

  const handleLogin = async () => {
    const user = {
      email: email,
      password: password,
    }

    try {
      const response = await axios.post(
        'https://chat-app-api-exv9.onrender.com/login',
        user
      )
      const token = response.data.token
      await AsyncStorage.setItem('authToken', token)
      nav.replace('Home')
    } catch (error) {
      Alert.alert('Login Error', 'Email or password incorrect')
      console.log('Login Error ', error)
    }
  }

  return (
    <View style={styles.loginContainer}>
      <KeyboardAvoidingView>
        <View style={styles.loginForm}>
          <Text style={styles.loginFormHeader}>Sign In</Text>
          <Text style={styles.loginFormSubHeader}>Sign In to Your Account</Text>
        </View>

        <View style={{ marginTop: 50 }}>
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
          <Pressable onPress={handleLogin} style={styles.formBtn}>
            <Text style={styles.formBtnText}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => nav.navigate('Register')}
            style={{ marginTop: 15 }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
              }}
            >
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  loginForm: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFormHeader: {
    color: '#4A55A2',
    fontSize: 17,
    fontWeight: '600',
  },
  loginFormSubHeader: {
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

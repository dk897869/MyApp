import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity,loadProducts } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProduct({ navigation, route }) {
  const { loadProducts } = route.params; // Passing loadProducts to refresh product list

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(''); // Image URL or path for simplicity

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert('Validation Error', 'Please enter both name and price');
      return;
    }

    // Check for duplicacy
    const storedProducts = await AsyncStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : [];

    if (products.some(product => product.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert('Error', 'Product already exists');
      return;
    }

    const newProduct = { name, price, image };
    products.push(newProduct);

    try {
      await AsyncStorage.setItem('products', JSON.stringify(products));
      Alert.alert('Success', 'Product added successfully');
      loadProducts(); // Reload product list
      navigation.goBack(); // Go back to Home
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      <Button title="Add Product" onPress={handleAddProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
});

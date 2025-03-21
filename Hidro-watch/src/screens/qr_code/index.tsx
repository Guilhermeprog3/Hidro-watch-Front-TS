import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useObject } from '../../hooks/Objectcontext';

export default function QRCodeScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const { postUserObject } = useObject();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const qrData = JSON.parse(data);

      if (!qrData.Tittle || !qrData.Location) {
        throw new Error('Dados do QR Code inválidos');
      }

      postUserObject({ Tittle: qrData.Tittle, Location: qrData.Location })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.log('Erro ao criar objeto:', error);
        });
    } catch (error) {
      console.log('Erro ao processar QR Code:', error);
      Alert.alert(
        'Erro',
        'Dados do QR Code inválidos. Certifique-se de que o QR Code contém informações válidas.',
        [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.headerTitle}>VOLTAR</Text>
        </TouchableOpacity>
      </View>

      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>Encontre um código QR</Text>
          <View style={styles.scanArea} />
        </View>
      </CameraView>

      <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
        <Ionicons name="images" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 25,
  },
});
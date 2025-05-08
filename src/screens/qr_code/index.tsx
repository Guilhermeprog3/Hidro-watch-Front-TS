import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useObject } from '../../hooks/Objectcontext';

export default function QRCodeScanner() {
  const [facing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState<ImagePicker.PermissionStatus | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const navigation = useNavigation();
  const { postUserObject } = useObject();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);
    })();
  }, []);

  const pickImage = async () => {
    if (galleryPermission !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);
      if (status !== 'granted') return;
    }

    setIsProcessingImage(true);
    
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        Alert.alert(
          'Leitura de QR Code',
          'Para ler QR Codes de imagens, você precisará implementar uma solução específica ou usar uma API externa.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Erro ao acessar galeria:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para acessar a câmera</Text>
        <Button onPress={requestCameraPermission} title="Conceder permissão" />
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
          setScanned(false);
        });
    } catch (error) {
      console.log('Erro ao processar QR Code:', error);
      Alert.alert(
        'Erro',
        'Dados do QR Code inválidos. Certifique-se de que o QR Code contém informações válidas.',
        [{ text: 'OK', onPress: () => setScanned(false) }],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.headerTitle}>VOLTAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overlay}>
          <Text style={styles.instructionText}>Encontre um código QR</Text>
          <View style={styles.scanArea} />
        </View>
      </CameraView>

      {isProcessingImage ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.galleryButton} 
          onPress={pickImage}
          disabled={isProcessingImage}
        >
          <Ionicons name="images" size={30} color="white" />
        </TouchableOpacity>
      )}
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
    zIndex: 1,
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 25,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
});
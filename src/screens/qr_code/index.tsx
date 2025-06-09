import * as ImagePicker from 'expo-image-picker';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera'; 
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

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; 
    setScanned(true);

    try {
      const qrData = JSON.parse(data);

      if (typeof qrData.title !== 'string' || typeof qrData.location !== 'string') {
        throw new Error('Dados do QR Code com formato inválido');
      }


      postUserObject({ title: qrData.title, location: qrData.location })
        .then(() => {
          Alert.alert('Sucesso', 'Objeto adicionado com sucesso!');
          navigation.goBack();
        })
        .catch((error) => {
          console.log('Erro ao criar objeto:', error);
          Alert.alert('Erro na API', 'Não foi possível adicionar o objeto. Verifique sua conexão e tente novamente.');
          setScanned(false);
        });
    } catch (error) {
      console.log('Erro ao processar QR Code:', error);
      Alert.alert(
        'QR Code Inválido',
        'Os dados do QR Code lido não estão no formato esperado. Por favor, tente novamente com um código válido.',
        [{ text: 'OK', onPress: () => setScanned(false) }],
        { cancelable: false }
      );
    }
  };

  const pickImage = async () => {
    if (galleryPermission !== 'granted') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria.');
        return;
      }
    }

    setIsProcessingImage(true);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const imageUri = result.assets[0].uri;
        
        const scannedCodes = await Camera.scanFromURLAsync(imageUri);
        
        if (scannedCodes.length > 0 && scannedCodes[0].data) {
          handleBarCodeScanned({ data: scannedCodes[0].data });
        } else {
          Alert.alert('Nenhum QR Code Encontrado', 'Não foi possível identificar um QR Code na imagem selecionada.');
        }
      }
    } catch (error) {
      console.log('Erro ao escanear imagem da galeria:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar a imagem.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>Precisamos da sua permissão para acessar a câmera</Text>
        <Button onPress={requestCameraPermission} title="Conceder permissão" />
      </View>
    );
  }

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
          <Text style={styles.instructionText}>Aponte para o código QR</Text>
          <View style={styles.scanArea} />
        </View>
      </CameraView>

      <View style={styles.footer}>
        {isProcessingImage ? (
            <View style={styles.loadingIndicator}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Processando...</Text>
            </View>
        ) : (
          <TouchableOpacity 
            style={styles.galleryButton} 
            onPress={pickImage}
            disabled={scanned}
          >
            <Ionicons name="images" size={30} color="white" />
            <Text style={styles.galleryButtonText}>Galeria</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    headerTitle: {
      color: 'white',
      fontSize: 16,
      marginLeft: 8,
      fontWeight: 'bold',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
      color: 'white',
      fontSize: 16,
    },
    camera: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    instructionText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      position: 'absolute',
      top: '25%',
      textAlign: 'center',
    },
    scanArea: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#009640',
      borderRadius: 20,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    galleryButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    galleryButtonText: {
      color: 'white',
      marginTop: 4,
      fontSize: 14,
    },
    loadingIndicator: {
      alignItems: 'center',
    },
    loadingText: {
      color: 'white',
      marginTop: 10,
      fontSize: 16,
    },
  });
import React, { createContext, PropsWithChildren, useContext, useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal, Pressable, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useObject } from '../../hooks/Objectcontext';

interface ModalConfig {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
}

export default function QRCodeScanner() {
  const [facing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState<ImagePicker.PermissionStatus | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const navigation = useNavigation();
  const { postUserDevice } = useObject();

  const scanAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      scanAnimation.setValue(0);
      Animated.loop(
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };
    startAnimation();
  }, [scanAnimation]);

  const animatedStyle = {
    transform: [
      {
        translateY: scanAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 248],
        }),
      },
    ],
  };

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

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

      if (typeof qrData.deviceId !== 'string' && typeof qrData.deviceId !== 'number') {
        throw new Error("Formato do QR Code inválido. 'deviceId' não encontrado.");
      }

      const deviceId = String(qrData.deviceId);

      postUserDevice(deviceId)
        .then(() => {
          setModalConfig({
            visible: true,
            type: 'success',
            title: 'Sucesso!',
            message: 'Você foi conectado ao dispositivo com sucesso.',
            onConfirm: () => {
              setModalConfig({ ...modalConfig, visible: false });
              navigation.goBack();
            },
          });
        })
        .catch((error) => {
          setModalConfig({
            visible: true,
            type: 'error',
            title: 'Erro na Associação',
            message: 'Não foi possível se conectar ao dispositivo. Ele pode não existir ou você já pode estar conectado.',
            onConfirm: () => {
              setModalConfig({ ...modalConfig, visible: false });
              setScanned(false);
            },
          });
        });
    } catch (error) {
      setModalConfig({
        visible: true,
        type: 'error',
        title: 'QR Code Inválido',
        message: 'O código lido não parece ser um QR Code válido do nosso sistema. Tente novamente.',
        onConfirm: () => {
          setModalConfig({ ...modalConfig, visible: false });
          setScanned(false);
        },
      });
    }
  };

  const pickImage = async () => {
    if (galleryPermission !== 'granted') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status);
      if (status !== 'granted') {
        setModalConfig({
          visible: true,
          type: 'info',
          title: 'Permissão Necessária',
          message: 'Para selecionar uma imagem, precisamos da sua permissão para acessar a galeria.',
          onConfirm: () => setModalConfig({ ...modalConfig, visible: false }),
        });
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
          setModalConfig({
            visible: true,
            type: 'info',
            title: 'Nada Encontrado',
            message: 'Não foi possível identificar um QR Code na imagem selecionada.',
            onConfirm: () => setModalConfig({ ...modalConfig, visible: false }),
          });
        }
      }
    } catch (error) {
      setModalConfig({
        visible: true,
        type: 'error',
        title: 'Erro no Processamento',
        message: 'Ocorreu um erro inesperado ao processar a imagem. Tente novamente.',
        onConfirm: () => setModalConfig({ ...modalConfig, visible: false }),
      });
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
        <Ionicons name="camera-outline" size={60} color="white" />
        <Text style={styles.message}>Precisamos da sua permissão para usar a câmera</Text>
        <Button onPress={requestCameraPermission} title="Conceder Permissão" color="#009640" />
      </View>
    );
  }

  const modalIconName = modalConfig.type === 'success' ? 'checkmark-circle-outline' : modalConfig.type === 'error' ? 'close-circle-outline' : 'information-circle-outline';
  const modalColor = modalConfig.type === 'success' ? '#009640' : modalConfig.type === 'error' ? '#ff3b30' : '#007aff';

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.headerTitle}>VOLTAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instructionText}>Aponte para o código QR</Text>
        <View style={styles.scanAreaWrapper}>
          <View style={styles.scanArea} />
          <Animated.View style={[styles.scanLine, animatedStyle, scanned && { display: 'none' }]} />
        </View>
      </View>

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalConfig.visible}
        onRequestClose={modalConfig.onConfirm}
      >
        <Pressable style={styles.modalOverlay} onPress={modalConfig.onConfirm}>
            <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
              <Ionicons name={modalIconName as any} size={60} color={modalColor} />
              <Text style={styles.modalTitle}>{modalConfig.title}</Text>
              <Text style={styles.modalMessage}>{modalConfig.message}</Text>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: modalColor }]}
                onPress={modalConfig.onConfirm}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </Pressable>
        </Pressable>
      </Modal>
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
    paddingHorizontal: 20,
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
    paddingVertical: 20,
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
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
  scanAreaWrapper: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#009640',
    borderRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#009640',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
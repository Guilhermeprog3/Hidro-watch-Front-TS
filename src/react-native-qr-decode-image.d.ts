declare module 'react-native-qr-decode-image' {
    const decodeImage: (imageUri: string) => Promise<string>;
    export default decodeImage;
  }
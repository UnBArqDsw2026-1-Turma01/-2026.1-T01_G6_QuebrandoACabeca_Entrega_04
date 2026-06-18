import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { validateImageFile } from '../utils/validators';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // readAsDataURL devolve "data:image/png;base64,XXXX" — o backend espera só o base64 puro.
      const base64 = result.split(',')[1] ?? '';
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function useImageUpload() {
  const { selectedImageBase64, setSelectedImageBase64 } = useGameContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  // Mantém a ref em sincronia e libera a object URL anterior — evita memory leak.
  useEffect(() => {
    previewUrlRef.current = previewUrl;
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [previewUrl]);

  const selectFile = useCallback(
    async (file: File) => {
      setError(null);

      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error ?? 'Imagem inválida.');
        return;
      }

      setIsProcessing(true);
      try {
        const base64 = await fileToBase64(file);
        setSelectedImageBase64(base64);

        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }
        setPreviewUrl(URL.createObjectURL(file));
      } catch {
        setError('Não foi possível processar a imagem. Tente outro arquivo.');
      } finally {
        setIsProcessing(false);
      }
    },
    [setSelectedImageBase64],
  );

  const clearImage = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    setPreviewUrl(null);
    setSelectedImageBase64(null);
    setError(null);
  }, [setSelectedImageBase64]);

  return {
    selectedImageBase64,
    previewUrl,
    error,
    isProcessing,
    hasImage: selectedImageBase64 !== null,
    selectFile,
    clearImage,
  };
}
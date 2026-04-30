import * as Sharing from "expo-sharing";
import { RefObject } from "react";
import { Platform, View } from "react-native";
import { captureRef } from "react-native-view-shot";

const html2canvas = Platform.OS === "web" ? require("html2canvas") : null;

type UseImageCaptureOptions = {
  captureRef: RefObject<View | null>;
  elementId: string;
  fileName: string;
  onError?: (message: string) => void;
};

export function useImageCapture({
  captureRef: ref,
  elementId,
  fileName,
  onError,
}: UseImageCaptureOptions) {
  const download = async () => {
    if (!ref.current) return;

    try {
      if (Platform.OS === "web") {
        // @ts-ignore - DOM interaction
        const element = document.getElementById(elementId);
        if (element) {
          const canvas = await html2canvas(element, {
            background: "#0e0e0e",
            logging: false,
            useCORS: true,
          });
          const link = document.createElement("a");
          link.download = `${fileName}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      } else {
        const uri = await captureRef(ref, { format: "png", quality: 1 });
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      onError?.("Ocorreu um erro ao gerar a imagem.");
    }
  };

  const copy = async (): Promise<boolean> => {
    if (Platform.OS !== "web") return false;

    try {
      // @ts-ignore - DOM interaction
      const element = document.getElementById(elementId);
      if (!element) return false;

      const canvas = await html2canvas(element, {
        background: "#0e0e0e",
        logging: false,
        useCORS: true,
      });

      return new Promise((resolve) => {
        canvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            try {
              const item = new ClipboardItem({ "image/png": blob });
              await navigator.clipboard.write([item]);
              resolve(true);
            } catch {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }, "image/png");
      });
    } catch {
      return false;
    }
  };

  return { download, copy };
}

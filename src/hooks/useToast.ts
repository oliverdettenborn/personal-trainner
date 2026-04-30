import { useCallback, useRef, useState } from "react";

export type ToastType = "success" | "error";

export type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
};

export function useToast(duration = 3000) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, type: ToastType = "success") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast({ visible: true, message, type });
      timeoutRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, duration);
    },
    [duration],
  );

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, show, hide };
}

import { useState } from "react";

type ConfirmConfig = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

const INITIAL: ConfirmConfig = {
  visible: false,
  title: "",
  message: "",
  onConfirm: () => {},
};

export function useConfirmModal() {
  const [config, setConfig] = useState<ConfirmConfig>(INITIAL);

  const show = (title: string, message: string, onConfirm: () => void) => {
    setConfig({ visible: true, title, message, onConfirm });
  };

  const hide = () => setConfig((prev) => ({ ...prev, visible: false }));

  return { config, show, hide };
}

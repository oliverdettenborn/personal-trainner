import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { useThemeColor } from '../../../hooks/useThemeColor';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Text } from '../../atoms/Text';

export type SetPasswordFormProps = {
  onSubmit: (password: string) => Promise<void>;
};

export function SetPasswordForm({ onSubmit }: SetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gold = useThemeColor({}, 'gold');
  const text = useThemeColor({}, 'text');
  const text3 = useThemeColor({}, 'text3');
  const danger = useThemeColor({}, 'danger');

  const handleSubmit = async () => {
    if (!password || !confirm) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(password);
    } catch {
      setError('Não foi possível salvar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={[styles.title, { color: gold }]}>
        DEFINA SUA <Text style={{ color: text }}>SENHA</Text>
      </Text>

      <Text style={[styles.subtitle, { color: text3 }]}>
        Crie uma senha para acessar o app nas próximas vezes.
      </Text>

      {error && <Text style={[styles.error, { color: danger }]}>{error}</Text>}

      <Input
        label="Nova senha"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        containerStyle={styles.field}
      />
      <Input
        label="Confirmar senha"
        placeholder="Repita a senha"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        autoComplete="new-password"
        containerStyle={styles.field}
      />

      <Button
        title="Salvar senha"
        variant="gold"
        loading={loading}
        onPress={handleSubmit}
        style={styles.button}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { textAlign: 'center', fontSize: 13, marginBottom: 28 },
  error: { marginBottom: 12, textAlign: 'center', fontSize: 14 },
  field: { marginBottom: 12 },
  button: { marginTop: 4 },
});

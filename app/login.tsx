import { Button } from "@atoms/Button";
import { Input } from "@atoms/Input";
import { Text } from "@atoms/Text";
import { useThemeColor } from "@hooks/useThemeColor";
import { signIn } from "@services/authService";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bg = useThemeColor({}, "background");
  const gold = useThemeColor({}, "gold");
  const text = useThemeColor({}, "text");
  const text3 = useThemeColor({}, "text3");
  const danger = useThemeColor({}, "danger");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: gold }]}>
          ÁREA DO <Text style={{ color: text }}>TREINADOR</Text>
        </Text>

        {error && (
          <Text style={[styles.error, { color: danger }]}>{error}</Text>
        )}

        <Input
          label="Email"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          containerStyle={styles.field}
        />
        <Input
          label="Senha"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          containerStyle={styles.field}
        />

        <Button
          title="Entrar"
          variant="gold"
          loading={loading}
          onPress={handleSubmit}
          style={styles.button}
        />

        <Text style={[styles.info, { color: text3 }]}>
          Acesso restrito. Entre em contato com o administrador para obter sua
          conta.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 32,
    textAlign: "center",
  },
  error: { marginBottom: 12, textAlign: "center", fontSize: 14 },
  field: { marginBottom: 12 },
  button: { marginTop: 4 },
  info: { textAlign: "center", fontSize: 12, marginTop: 24 },
});

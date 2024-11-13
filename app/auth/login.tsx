import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Href, Link, router } from 'expo-router';
import { WaveBackground } from '@/components';
import { Button } from '@/components';
import { Input } from '@/components';
import { Mail, Lock } from 'lucide-react-native';
import { Colors } from '@/constants';
import { useSession } from '@/context';
import { useState } from 'react';

type FormErrors = {
  email: string;
  password: string;
};

export default function Login() {
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      email: '',
      password: '',
    };
    
    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Ingrese un email válido';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    try {
      if (!validateForm()) {
        return;
      }
  
      setLoading(true);
      
      await signIn(form.email, form.password);
      router.replace('/(tabs)');
      
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message?.includes('credentials')) {
        setErrors({
          email: 'Credenciales inválidas',
          password: 'Credenciales inválidas',
        });
      } else {
        setErrors({
          email: error.message || 'Ocurrió un error al iniciar sesión',
          password: 'Intente nuevamente más tarde',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof form) => (text: string) => {
    setForm(prev => ({ ...prev, [field]: text }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <WaveBackground />
      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={handleInputChange('email')}
            error={errors.email}
            icon={<Mail size={20} color={errors.email ? Colors.red_40 : Colors.white_40} />}
          />
          
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={form.password}
            onChangeText={handleInputChange('password')}
            error={errors.password}
            icon={<Lock size={20} color={errors.password ? Colors.red_40 : Colors.white_40} />}
          />

          <Link href={"/auth/forgot-password" as Href} asChild>
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </Link>

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href={"/auth/register" as Href} asChild>
            <Button
              title="Crear cuenta"
              variant="secondary"
            />
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.white_90,
    marginBottom: 8,
    fontFamily: 'Inter_Bold',
  },
  form: {
    gap: 4,
    marginTop: 32,
  },
  forgotPassword: {
    color: Colors.white_60,
    marginBottom: 20,
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Inter_Regular',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.white_30,
  },
  dividerText: {
    color: Colors.white_50,
    paddingHorizontal: 10,
    fontFamily: 'Inter_Regular',
  },
  buttons: {
    gap: 12,
    marginTop: 32,
  },
});
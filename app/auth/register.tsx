import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useSession } from '@/context';
import { Input, Button } from '@/components';
import { WaveBackground } from '@/components';
import { Mail, User, Lock, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Colors } from '@/constants';

type FormErrors = {
    name: string;
    email: string;
    dni: string;
    password: string;
};

export default function Register() {
    const { signUp } = useSession();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        dni: '',
    });

    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        password: '',
        dni: '',
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: FormErrors = {
            name: '',
            email: '',
            password: '',
            dni: '',
        };

        // Validación del nombre
        if (!form.name.trim()) {
            newErrors.name = 'Tu nombre es requerido';
            isValid = false;
        } else if (form.name.length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
            isValid = false;
        }

        // Validación del email
        if (!form.email.trim()) {
            newErrors.email = 'El email es requerido';
            isValid = false;
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Ingresa un email válido';
            isValid = false;
        }

        // Validación del DNI
        if (!form.dni.trim()) {
            newErrors.dni = 'El DNI es requerido';
            isValid = false;
        } else if (!/^\d{8}$/.test(form.dni)) {
            newErrors.dni = 'El DNI debe tener 8 dígitos';
            isValid = false;
        }

        // Validación de la contraseña
        if (!form.password) {
            newErrors.password = 'La contraseña es requerida';
            isValid = false;
        } else if (form.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        } else if (!/(?=.*[A-Z])/.test(form.password)) {
            newErrors.password = 'Incluye al menos una mayúscula';
            isValid = false;
        } else if (!/(?=.*\d)/.test(form.password)) {
            newErrors.password = 'Incluye al menos un número';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        try {
            console.log('1. Iniciando validación del formulario');
            if (!validateForm()) {
                console.log('Validación fallida');
                return;
            }

            console.log('2. Formulario válido, comenzando registro');
            setLoading(true);

            const registerData = {
                name: form.name,
                email: form.email,
                password: form.password,
                dni: form.dni,
            };

            console.log('3. Datos a enviar:', { ...registerData, password: '***' });

            await signUp(registerData);
            console.log('4. Registro exitoso');

            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Error en el registro:', error);
            console.error('Error completo:', JSON.stringify(error, null, 2));

            if (error.message?.includes('email ya está registrado')) {
                setErrors(prev => ({
                    ...prev,
                    email: 'Este email ya está registrado'
                }));
            } else if (error.message?.includes('DNI ya está registrado')) {
                setErrors(prev => ({
                    ...prev,
                    dni: 'Este DNI ya está registrado'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    email: error.message || 'Ocurrió un error al crear tu cuenta'
                }));
            }
        } finally {
            console.log('5. Finalizando proceso de registro');
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
                <Text style={styles.title}>¡Únete al cambio!</Text>

                <View style={styles.form}>
                    <Input
                        label="Nombre completo"
                        placeholder="¿Cómo te llamas?"
                        value={form.name}
                        onChangeText={handleInputChange('name')}
                        error={errors.name}
                        icon={<User size={20} color={errors.name ? Colors.red_40 : Colors.white_60} />}
                    />

                    <Input
                        label="Correo electrónico"
                        placeholder="tu@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={handleInputChange('email')}
                        error={errors.email}
                        icon={<Mail size={20} color={errors.email ? Colors.red_40 : Colors.white_60} />}
                    />

                    <Input
                        label="DNI"
                        placeholder="Documento de identidad"
                        keyboardType="numeric"
                        maxLength={8}
                        value={form.dni}
                        onChangeText={handleInputChange('dni')}
                        error={errors.dni}
                        icon={<ShieldCheck size={20} color={errors.dni ? Colors.red_40 : Colors.white_60} />}
                    />

                    <Input
                        label="Contraseña"
                        placeholder="Mínimo 8 caracteres"
                        secureTextEntry
                        value={form.password}
                        onChangeText={handleInputChange('password')}
                        error={errors.password}
                        icon={<Lock size={20} color={errors.password ? Colors.red_40 : Colors.white_60} />}
                    />

                    <Button
                        title="Crear cuenta"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>O</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Link href="/auth/login" asChild>
                        <Button
                            title="Ya tengo una cuenta"
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
        backgroundColor: Colors.white_10,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontFamily: 'Inter_Bold',
        color: Colors.white_90,
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_Regular',
        color: Colors.white_70,
        marginBottom: 32,
        lineHeight: 24,
    },
    form: {
        gap: 4,
    },
    button: {
        marginTop: 10,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
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
});
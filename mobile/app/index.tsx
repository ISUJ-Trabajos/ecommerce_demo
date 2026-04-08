import { Redirect } from 'expo-router';

/**
 * Punto de entrada de la app.
 * Redirige a la pantalla de login. Si el usuario tiene sesión activa,
 * el guard en (app)/_layout.tsx lo enviará al catálogo.
 */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}

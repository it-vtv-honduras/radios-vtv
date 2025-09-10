import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const login = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      console.log("Debe de llenar los campos");
      return { authenticated: false };
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const user_data = {
      email: user.email,
      uid: user.uid,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user_data));
    }
    console.log("Inicio de sesión exitoso");
    if (typeof window !== "undefined") {
      localStorage.setItem("init_login", "true");
    }
    return { authenticated: true };
  } catch (error: any) {
    handleAuthError(error);
    return { authenticated: false };
  }
};

const forgotPassword = async (email: string) => {
  try {
    if (!email) {
      console.log("Por favor, ingresa tu correo electrónico.");
      return;
    }
    await sendPasswordResetEmail(auth, email);
    console.log("Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.");
  } catch (error: any) {
    console.log("Error al enviar el correo de recuperación:", error.message);
  }
};

const checkActiveSession = () => {
  return new Promise<{
    email: string; uid: string | null 
}>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const user_data = {
          email: user.email,
          uid: user.uid,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user_data));
          localStorage.setItem("init_login", "true");
        }
        resolve({ email: user.email ?? "", uid: user.uid ?? null });
      } else {
        console.log("No hay sesión activa.");
        resolve({ email: "", uid: null });
      }
    });
  });
};

const logout = async () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("init_login");
    }
    await signOut(auth);
    console.log("Sesión cerrada. Nos vemos pronto!");
    return { success: true };
  } catch (error: any) {
    console.log("Error al cerrar sesión:", error.message);
    return { success: false, error: error.message };
  }
};

const handleAuthError = (error: any) => {
  let errorMessage = "Error inesperado.";
  if (error.code === "auth/invalid-credential") {
    errorMessage = "Credenciales incorrectas.";
  } else if (error.code === "auth/user-not-found") {
    errorMessage = "Usuario no encontrado.";
  } else if (error.code === "auth/invalid-email") {
    errorMessage = "Correo electrónico no válido.";
  }
  console.log("Error de Autenticación:", errorMessage);
};

export { login, logout, forgotPassword, checkActiveSession };
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import { auth } from '@/lib/api';
import { LoginRequest, JwtResponse } from '@/types';

export const useAuthentication = () => {
  const router = useRouter();
  const { setUserType, setUser } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const loginData: LoginRequest = {
        email,
        senha: password // Note que a API espera 'senha' e não 'password'
      };

      const response: JwtResponse = await auth.login(loginData);
      
      // Salva os dados nos cookies
      Cookies.set('auth_token', response.token);
      Cookies.set('user_type', response.tipo);
      
      // Salva os dados do usuário
      const userData = {
        id: response.id,
        nome: response.nome,
        email: response.email,
        tipo: response.tipo
      };
      
      // Atualiza o contexto
      const userType = response.tipo === 'ADMIN' ? 'admin' : 'cliente';
      setUserType(userType);
      setUser(userData);

      // Redireciona baseado no tipo de usuário
      if (userType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/cliente/home');
      }

      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    // Remove os cookies
    Cookies.remove('auth_token');
    Cookies.remove('user_type');
    
    // Limpa o contexto
    setUserType(null);
    setUser(null);
    
    // Remove o token do localStorage tambem
    localStorage.removeItem('token');
    
    // Redireciona para login
    router.push('/login');
  };

  return { login, logout };
};

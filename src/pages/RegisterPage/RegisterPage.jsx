import { useState } from 'react';
import { supabase } from '../../helper/supabase';
import { useNavigate } from 'react-router-dom';
import './styleResgister.css'  

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('normal'); 
    const navigate = useNavigate();

    const handleRegister = async () => {
        console.log('Iniciando registro...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            console.error('Erro ao registrar:', error.message);
            return;
        }

        console.log('Usuário registrado:', data);

        if (data.user) {
            const { error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: data.user.id, role }]);

            if (insertError) {
                console.error('Erro ao inserir perfil:', insertError.message);
                return;
            }

            console.log('Perfil inserido com sucesso');
            navigate('/');
        }
    };

    return (
        <div className="register-container">
            <h1>Registrar</h1>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Senha" 
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={handleRegister}>Registrar</button>
        </div>
    );
};

export default RegisterPage;

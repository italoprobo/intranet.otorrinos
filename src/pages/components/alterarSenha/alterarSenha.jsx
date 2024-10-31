import { useEffect, useState } from "react";
import { supabase } from '../../../helper/supabase';
import { useNavigate } from 'react-router-dom';
import './stylealterarSenha.css';
import TopBar from "../topbar";

export function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/login");
            }
        }

        checkSession();
    }, [navigate]);

    async function handleResetPassword(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password,  
        });

        if (error) {
            console.error("Erro ao alterar a senha:", error.message);
            alert("Ocorreu um erro ao tentar alterar a senha. Por favor, tente novamente.");
        } else {
            alert("Senha alterada com sucesso!");
            navigate("/");
        }
    }

    return (
        <div className="reset-password-container">
            <TopBar />
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleResetPassword}>
                <div className="form-group">
                    <label htmlFor="password">Nova Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Salvar Nova Senha</button>
            </form>
        </div>
    );
}

export default ResetPassword;

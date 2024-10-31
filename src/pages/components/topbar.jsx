import { useEffect, useState } from "react";
import "./styleTopBar.css";
import { supabase } from '../../helper/supabase';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './../../assets/logooto.png';

export function TopBar() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        async function getUserData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setUserName(user.email.split('@')[0]);

                // Fetch user role
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error("Erro ao buscar role do usuário:", error);
                } else {
                    setUserRole(data.role);
                }
            }
        }

        getUserData();
    }, []);

    async function signOutUser() {
        const { error } = await supabase.auth.signOut();
        navigate("/login");
    }

    async function handlePasswordReset() {
        const { data, error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: 'http://localhost:5173/reset-password'
        });

        if (error) {
            console.error("Erro ao enviar o email de recuperação de senha:", error.message);
        } else {
            alert("Um email para alterar sua senha foi enviado.");
        }
    }

    function handleEditData() {
        navigate('/alterar-dados'); 
    }

    function handleProfile(){
        navigate('/profile')
    }

    function handleAddNotice() {
        navigate('/add-notice');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-green fixed-top" id="TopBarGeral">
            <div className="navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav w-100" id="TopBar">
                    <div className="esquerda">
                        <div className="otorrinos">
                            <Link to='/'>
                                <img src={logo} alt="Otorrinos" className="logo-img"/>
                            </Link>
                        </div>
                    </div>
                    <div className="direita">
                        <div className="dropdown">
                            <button 
                                className="btn btn-secondary dropdown-toggle" 
                                type="button" 
                                id="dropdownMenuButton" 
                                data-toggle="dropdown" 
                                aria-haspopup="true" 
                                aria-expanded="false">
                                Olá, {userName}
                            </button>
                            <div className="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenuButton">
                                <button className="dropdown-item" onClick={handleProfile}>Perfil</button>
                                {userRole === 'admin' && (
                                    <button className="dropdown-item" onClick={handleAddNotice}>Adicionar Aviso</button>
                                )}
                                {userRole === 'admin' && (
                                    <button className="dropdown-item" onClick={handleAddNotice}>Adicionar Profissional</button>
                                )}
                                {userRole === 'admin' && (
                                    <button className="dropdown-item" onClick={handleAddNotice}>Adicionar Convênio</button>
                                )}
                                <button className="dropdown-item" onClick={signOutUser}>Sair</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TopBar;

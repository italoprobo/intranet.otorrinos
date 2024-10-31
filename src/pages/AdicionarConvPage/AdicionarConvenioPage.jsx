import { useState, useEffect } from "react";
import { supabase } from '../../helper/supabase';
import { useNavigate } from 'react-router-dom';
import TopBar from "../components/topbar";
import './styleAddConvenios.css';

const AddConveniosPage = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [link, setLink] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [regra_auth, setRegraAuth] = useState('');
    const [regra_fatu, setRegraFatu] = useState('');
    const [video_link, setVideoLink] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); 

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('User:', user);

            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                console.log('Role Data:', data);

                if (error) {
                    console.error("Erro ao buscar role do usuário:", error);
                    setErrorMessage("Erro ao buscar role do usuário.");
                } else {
                    setUserRole(data.role);
                }
            } else {
                navigate('/login');
            }
        };

        fetchUserRole();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('convenios')
            .insert([{ nome, link, usuario, senha, regra_auth, regra_fatu, video_link }]);

        if (error) {
            console.error("Erro ao adicionar convênio:", error);
            setErrorMessage("Erro ao adicionar convênio: " + error.message);
        } else {
            console.log("Convênio adicionado com sucesso:", data);
            navigate('/listar-convenios');
        }
    };

    if (userRole === null) {
        return <div>Carregando...</div>;
    }

    if (userRole !== 'admin') {
        return <div>Acesso negado.</div>;
    }

    return (
        <div className="mainAdd">
            <TopBar />
            <div className="add-container">
                <h1>Adicionar Convênio</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input 
                            type="text" 
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Link do site:</label>
                        <input 
                            type="text" 
                            value={link} 
                            onChange={(e) => setLink(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Usuário:</label>
                        <input 
                            type="text" 
                            value={usuario} 
                            onChange={(e) => setUsuario(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha:</label>
                        <input 
                            type="text" 
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Regras de Autenticação:</label>
                        <textarea 
                            value={regra_auth} 
                            onChange={(e) => setRegraAuth(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Regras de Faturamento:</label>
                        <textarea 
                            value={regra_fatu} 
                            onChange={(e) => setRegraFatu(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Link do Vídeo:</label>
                        <input 
                            type="text" 
                            value={video_link} 
                            onChange={(e) => setVideoLink(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Adicionar</button>
                </form>
            </div>
        </div>
    );
};

export default AddConveniosPage;

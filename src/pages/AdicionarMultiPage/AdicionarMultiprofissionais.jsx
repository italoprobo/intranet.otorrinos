import { useState, useEffect } from "react";
import { supabase } from '../../helper/supabase';
import { useNavigate } from 'react-router-dom';
import TopBar from "../components/topbar";
import './styleAddMultiprofissionais.css';

const AddMultiprofissionaisPage = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [crm, setCRM] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [detalhes, setDetalhes] = useState('');
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
        const { error } = await supabase
            .from('medicos')
            .insert([{ nome, crm, especialidade, detalhes }]);

        if (error) {
            console.error("Erro ao adicionar médico:", error);
            setErrorMessage("Erro ao adicionar médico: " + error.message);
        } else {
            navigate('/listar-multiprofissionais');
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
                <h1>Adicionar Multiprofissional</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>} {}
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
                        <label>CRM:</label>
                        <input 
                            type="text" 
                            value={crm} 
                            onChange={(e) => setCRM(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Especialidade:</label>
                        <input 
                            type="text" 
                            value={especialidade} 
                            onChange={(e) => setEspecialidade(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Detalhes:</label>
                        <textarea 
                            value={detalhes} 
                            onChange={(e) => setDetalhes(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Adicionar</button>
                </form>
            </div>
        </div>
    );
};

export default AddMultiprofissionaisPage;

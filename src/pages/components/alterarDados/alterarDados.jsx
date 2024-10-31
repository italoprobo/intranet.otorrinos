import { useEffect, useState } from "react";
import { supabase } from '../../../helper/supabase';
import { useNavigate } from 'react-router-dom';
import './stylealterarDados.css';
import TopBar from "../topbar";

export function EditData() {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email);
                setNome(user.user_metadata.nome || '');
            }
        }

        getUserData();
    }, []);

    async function handleSaveChanges(event) {
        event.preventDefault();

        const { data, error } = await supabase.auth.updateUser({
            email: email,  // email 
            data: { nome: nome },  // metadados com o nome
        });

        if (error) {
            console.error("Erro ao alterar dados:", error.message);
            alert("Ocorreu um erro ao tentar alterar os dados. Por favor, tente novamente.");
        } else {
            alert("Dados alterados com sucesso!");
            navigate("/");
        }
    }

    return (
        <div className="edit-data-container">
            <TopBar />
            <h2>Alterar Dados</h2>
            <form onSubmit={handleSaveChanges}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
}

export default EditData;

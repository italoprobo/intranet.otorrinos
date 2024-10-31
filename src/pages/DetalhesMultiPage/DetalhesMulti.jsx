import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '../../helper/supabase';
import TopBar from "../components/topbar";
import './styleDetalhesMulti.css';

const DetalhesMulti = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medico, setMedico] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editData, setEditData] = useState({
        nome: "",
        crm: "",
        especialidade: "",
        detalhes: ""
    });

    useEffect(() => {
        const fetchMedico = async () => {
            const { data, error } = await supabase
                .from('medicos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Erro ao buscar médico: ", error);
            } else {
                setMedico(data);
                setEditData(data);
            }
        };

        fetchMedico();
    }, [id]);

    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleSave = async (field) => {
        const { error } = await supabase
            .from('medicos')
            .update({ [field]: editData[field] })
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar médico: ", error);
        } else {
            setMedico({ ...medico, [field]: editData[field] });
            setEditField(null);
        }
    };

    const handleDelete = async () => {
        const { error } = await supabase
            .from('medicos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Erro ao deletar médico: ", error);
        } else {
            navigate('/listar-multiprofissionais');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    if (!medico) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="mainDetalhes">
            <TopBar />
            <div className="detalhes-container">
                <h1>Detalhes do Médico</h1>
                <div className="detalhe-item">
                    <span>Nome: </span>
                    {editField === "nome" ? (
                        <input
                            type="text"
                            name="nome"
                            value={editData.nome}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{medico.nome}</span>
                    )}
                    <button onClick={editField === "nome" ? () => handleSave("nome") : () => handleEdit("nome")} className="edit-btn">
                        {editField === "nome" ? "Salvar" : "✎"}
                    </button>
                </div>
                <div className="detalhe-item">
                    <span>CRM: </span>
                    {editField === "crm" ? (
                        <input
                            type="text"
                            name="crm"
                            value={editData.crm}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{medico.crm}</span>
                    )}
                    <button onClick={editField === "crm" ? () => handleSave("crm") : () => handleEdit("crm")} className="edit-btn">
                        {editField === "crm" ? "Salvar" : "✎"}
                    </button>
                </div>
                <div className="detalhe-item">
                    <span>Especialidade: </span>
                    {editField === "especialidade" ? (
                        <input
                            type="text"
                            name="especialidade"
                            value={editData.especialidade}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{medico.especialidade}</span>
                    )}
                    <button onClick={editField === "especialidade" ? () => handleSave("especialidade") : () => handleEdit("especialidade")} className="edit-btn">
                        {editField === "especialidade" ? "Salvar" : "✎"}
                    </button>
                </div>
                <div className="detalhe-item">
                    <span>Detalhes: </span>
                    {editField === "detalhes" ? (
                        <input
                            type="text"
                            name="detalhes"
                            value={editData.detalhes}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{medico.detalhes}</span>
                    )}
                    <button onClick={editField === "detalhes" ? () => handleSave("detalhes") : () => handleEdit("detalhes")} className="edit-btn">
                        {editField === "detalhes" ? "Salvar" : "✎"}
                    </button>
                </div>
                <button onClick={handleDelete} className="delete-btn">Apagar</button>
            </div>
        </div>
    );
}

export default DetalhesMulti;

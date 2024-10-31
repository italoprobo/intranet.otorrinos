import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '../../helper/supabase';
import TopBar from "../components/topbar";
import './styleDetalhesConvenio.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Função para garantir que a URL comece com http:// ou https://
const formatURL = (url) => {
    if (!url) return url;
    if (!/^https?:\/\//i.test(url)) {
        return `http://${url}`;
    }
    return url;
};

const DetalhesConvenio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [convenio, setConvenio] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editData, setEditData] = useState({
        nome: "",
        link: "",
        usuario: "",
        senha: "",
        regra_auth: "",
        regra_fatu: "",
        video_link: ""  // Novo campo para o link do vídeo do YouTube
    });

    useEffect(() => {
        const fetchConvenios = async () => {
            const { data, error } = await supabase
            .from('convenios')
            .select('*')
            .eq('id', id)
            .single();

            if (error) {
                console.error("Erro ao buscar convênio: ", error);
            } else {
                setConvenio(data);
                setEditData(data);
            }
        };

        fetchConvenios();
    }, [id]);

    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleSave = async (field) => {
        const { error } = await supabase
        .from('convenios')
        .update({ [field]: editData[field] })
        .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar convênio: ", error);
        } else {
            setConvenio({ ...convenio, [field]: editData[field] });
            setEditField(null);
        }
    };

    const handleDelete = async () => {
        const { error } = await supabase
        .from('convenios')
        .delete()
        .eq('id', id);

        if (error) {
            console.error("Erro ao deletar convênio: ", error);
        } else {
            navigate('/listar-convenios');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    if (!convenio) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="mainDetalhesConv">
            <TopBar />
            <div className="detalhes-header">
                {editField === 'nome' ? (
                    <input
                        type="text"
                        name="nome"
                        value={editData.nome}
                        onChange={handleChange}
                        onBlur={() => handleSave('nome')}
                        autoFocus
                        className="edit-input"
                    />
                ) : (
                    <h1 onClick={() => handleEdit('nome')}>{convenio.nome}</h1>
                )}
            </div>
            <div className="detalhes-container-conv">
                <div className="info-block">
                    <h3>LINK</h3>
                    {editField === 'link' ? (
                        <input
                            type="text"
                            name="link"
                            value={editData.link}
                            onChange={handleChange}
                            onBlur={() => handleSave('link')}
                            autoFocus
                            className="edit-input"
                        />
                    ) : (
                        <div className="link-container">
                            <p onClick={() => handleEdit('link')}>{convenio.link}</p>
                            <a href={formatURL(convenio.link)} target="_blank" rel="noopener noreferrer">
                                →
                            </a>
                        </div>
                    )}
                    <h3>LOGIN</h3>
                    {editField === 'usuario' ? (
                        <input
                            type="text"
                            name="usuario"
                            value={editData.usuario}
                            onChange={handleChange}
                            onBlur={() => handleSave('usuario')}
                            autoFocus
                            className="edit-input"
                        />
                    ) : (
                        <p onClick={() => handleEdit('usuario')}>{convenio.usuario}</p>
                    )}
                    <h3>SENHA</h3>
                    {editField === 'senha' ? (
                        <input
                            type="text"
                            name="senha"
                            value={editData.senha}
                            onChange={handleChange}
                            onBlur={() => handleSave('senha')}
                            autoFocus
                            className="edit-input"
                        />
                    ) : (
                        <p onClick={() => handleEdit('senha')}>{convenio.senha}</p>
                    )}
                    <h3>VÍDEO</h3>
                    {editField === 'video_link' ? (
                        <input
                            type="text"
                            name="video_link"
                            value={editData.video_link}
                            onChange={handleChange}
                            onBlur={() => handleSave('video_link')}
                            autoFocus
                            className="edit-input"
                        />
                    ) : (
                        <div className="link-container">
                            <p onClick={() => handleEdit('video_link')}>{convenio.video_link}</p>
                            <a href={formatURL(convenio.video_link)} target="_blank" rel="noopener noreferrer">
                                →
                            </a>
                        </div>
                    )}
                </div>
                <div className="info-block">
                    <h3>REGRAS DE AUTENTICAÇÃO</h3>
                    {editField === 'regra_auth' ? (
                        <textarea
                            name="regra_auth"
                            value={editData.regra_auth}
                            onChange={handleChange}
                            onBlur={() => handleSave('regra_auth')}
                            autoFocus
                            className="edit-textarea"
                        />
                    ) : (
                        <p className="p-grande" onClick={() => handleEdit('regra_auth')}>{convenio.regra_auth}</p>
                    )}
                </div>
                <div className="info-block">
                    <h3>REGRAS DE FATURAMENTO</h3>
                    {editField === 'regra_fatu' ? (
                        <input
                            type="text"
                            name="regra_fatu"
                            value={editData.regra_fatu}
                            onChange={handleChange}
                            onBlur={() => handleSave('regra_fatu')}
                            autoFocus
                            className="edit-input"
                        />
                    ) : (
                        <p className="p-grande" onClick={() => handleEdit('regra_fatu')}>{convenio.regra_fatu}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetalhesConvenio;

import { useEffect, useState } from "react";
import { supabase } from '../../helper/supabase';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./styleHome.css";
import TopBar from "../components/topbar";
import excluirIcon from "../../img/excluir.svg";  
import editarIcon from "../../img/editar.svg";  
import editarIcon2 from "../../img/editar2.svg";  
import detalhesIcon from "../../img/detalhes.svg"; 

export function HomePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [medicos, setMedicos] = useState([]);
    const [convenios, setConvenios] = useState([])
    const [avisos, setAvisos] = useState([]);  
    const [userRole, setUserRole] = useState(null);
    const [selectedAviso, setSelectedAviso] = useState(null);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [visualizadores, setVisualizadores] = useState([]);  
    const [selectedMedico, setSelectedMedico] = useState(null); 
    const [editingMedico, setEditingMedico] = useState(null);   
    const [formData, setFormData] = useState({ nome: '', conselho: '', crm: '', especialidade: '' });
    const [isAscending, setIsAscending] = useState(true);

    useEffect(() => {
        fetchMedicos();
        fetchAvisos();  
        fetchConvenios();
    }, []);

    const fetchMedicos = async () => {
        const { data, error } = await supabase
            .from('medicos')
            .select('*');

        if (error) {
            console.error("Erro ao buscar médicos: ", error);
        } else {
            setMedicos(data);
        }
    };

    const fetchAvisos = async () => {
        const { data, error } = await supabase
            .from('avisos')  
            .select('*')
            .order('data', { ascending: false }); 

        if (error) {
            console.error("Erro ao buscar avisos: ", error);
        } else {
            setAvisos(data);
        }
    };

    const fetchConvenios = async () => {
        const { data, error } = await supabase
            .from('convenios')
            .select('*');

        if (error) {
            console.error("Erro ao buscar convênios: ", error);
        } else {
            setConvenios(data)
        }
    }

    const fetchVisualizadores = async (avisoId) => {
        const { data: avisosVistos, error } = await supabase
            .from('avisos_vistos')
            .select('user_id')
            .eq('aviso_id', avisoId);
    
        if (error) {
            console.error("Erro ao buscar visualizadores: ", error);
            return;
        }
    
        if (avisosVistos.length > 0) {
            const userIds = avisosVistos.map(v => v.user_id);
    
            const { data: users, error: usersError } = await supabase
                .from('auth.users')  
                .select('email')
                .in('id', userIds);
    
            if (usersError) {
                console.error("Erro ao buscar emails dos usuários: ", usersError);
                return;
            }
    
            const nomes = users.map(user => {
                const nome = user.email.split('@')[0];  
                return nome;
            });
    
            setVisualizadores(nomes);
        } else {
            setVisualizadores([]); 
        }
    };

    const handleSortByName = () => {
        const sortedMedicos = [...medicos].sort((a, b) => {
            if (isAscending) {
                return a.nome.localeCompare(b.nome);
            } else {
                return b.nome.localeCompare(a.nome);
            }
        });
        setMedicos(sortedMedicos);
        setIsAscending(!isAscending); // crescente e decrescente
    };
    
    const handleDeleteMedico = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja deletar este médico?");
        if (!confirmDelete) {
            return; 
        }
    
        const { error } = await supabase
            .from('medicos')
            .delete()
            .eq('id', id);
    
        if (error) {
            console.error("Erro ao excluir médico:", error);
        } else {
            fetchMedicos(); 
        }
    };

    const handleEditClickMedico = (medico) => {
        setEditingMedico(medico); 
        setFormData({ ...medico }); 
    };

    const handleDetailClickMedico = (medico) => {
        setSelectedMedico(medico); 
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateMedico = async () => {
        const { error } = await supabase
            .from('medicos')
            .update({ ...formData })
            .eq('id', editingMedico.id);

        if (error) console.error("Erro ao atualizar médico:", error);
        else {
            fetchMedicos();
            setEditingMedico(null); 
        }
    };
    
    
    const handleDeleteConvenio = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja deletar este convênio?");
        if (!confirmDelete) {
            return; 
        }

        const { error } = await supabase
            .from('convenios')
            .delete()
            .eq('id', id);
    
        if (error) {
            console.error("Erro ao excluir convênio:", error);
        } else {
            fetchConvenios(); 
        }
    };

    const toggleNested = (event) => {
        const target = event.currentTarget;
        target.classList.toggle('caret-down');
        const nested = target.nextElementSibling;
        if (nested) {
            nested.classList.toggle('active');
        }
    };

    const handleAvisoClick = (aviso) => {
        setSelectedAviso(aviso);
        setIsCheckboxChecked(false);  
    };

    const handleClosePopup = async () => {
        if (isCheckboxChecked) {
            const { error } = await supabase
                .from('avisos_vistos')
                .insert([
                    { aviso_id: selectedAviso.id, user_id: user.id } 
                ]);
    
            if (error) {
                console.error("Erro ao registrar visualização do aviso: ", error);
                alert("Erro ao registrar visualização.");
                return;
            }
    
            setSelectedAviso(null);
        } else {
            alert("Você deve marcar a caixa para confirmar que visualizou o aviso.");
        }
    };
    

    async function signOutUser() {
        const { error } = await supabase.auth.signOut();
        navigate("/login");
    }

    useEffect(() => {
        async function getUserData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
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
            setLoading(false);
        }

        getUserData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="tudo">
            <Helmet>
                <title>Otorrinos - Home</title>
            </Helmet>
            {Object.keys(user).length !== 0 ? (
                <>
                    <TopBar />
                    <div className="mainHome">
                        <div className="cardHome">
                            
                        <div className="outer">
                                <ul className="ul">
                                    <li>
                                        <h6 className="caret" onClick={toggleNested}>Profissionais Cadastrados</h6>
                                        <ul className="nested">
                                            <div className="card-pad">
                                                <div className="card-detalhes">
                                                    <table>
                                                        <thead>
                                                            <th onClick={handleSortByName} style={{ cursor: 'pointer' }}>
                                                                    Nome {isAscending ? '▲' : '▼'}
                                                            </th>
                                                            <th>Conselho</th>
                                                            <th>Numero no conselho</th>
                                                            <th>Especialidade</th>
                                                            <th>Ações</th>
                                                        </thead>
                                                        <tbody>
                                                            {medicos.map((medico) => (
                                                                <tr key={medico.id}>
                                                                        <td>{medico.nome}</td>
                                                                        <td>{medico.conselho}</td>
                                                                        <td>{medico.crm}</td>
                                                                        <td>{medico.especialidade}</td>
                                                                        <td>
                                                                            <div className="div-acoes">
                                                                                <div className="div-img">
                                                                                    <img className="clicavel" src={detalhesIcon} alt="Detalhes" width="24" height="24" onClick={() => handleDetailClickMedico(medico)}/>
                                                                                    <img className="clicavel" src={editarIcon2} alt="Editar" width="24" height="24" onClick={() => handleEditClickMedico(medico)}/>
                                                                                    <img className="clicavel" src={excluirIcon} alt="Excluir" width="24" height="24" onClick={() => handleDeleteMedico(medico.id)} />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                </tr>                                                                   
                                                            ))}
                                                        </tbody>
                                                    </table>                                                  
                                                </div>
                                            </div>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            {/* Detalhes */}
                            {selectedMedico && (
                                <div className="popup-overlay">
                                    <div className="popup">
                                        <h2>Detalhes do Médico</h2>
                                        <p>Nome: {selectedMedico.nome}</p>
                                        <p>Conselho: {selectedMedico.conselho}</p>
                                        <p>CRM: {selectedMedico.crm}</p>
                                        <p>Especialidade: {selectedMedico.especialidade}</p>
                                        <button onClick={() => setSelectedMedico(null)}>Fechar</button>
                                    </div>
                                </div>
                            )}

                             {/* Edição */}
                            {editingMedico && (
                                <div className="popup-overlay">
                                    <div className="popup">
                                        <h2>Editar Médico</h2>
                                        <form>
                                            <label>
                                                Nome:
                                                <input type="text" name="nome" value={formData.nome} onChange={handleFormChange} />
                                            </label>
                                            <label>
                                                Conselho:
                                                <input type="text" name="conselho" value={formData.conselho} onChange={handleFormChange} />
                                            </label>
                                            <label>
                                                CRM:
                                                <input type="text" name="crm" value={formData.crm} onChange={handleFormChange} />
                                            </label>
                                            <label>
                                                Especialidade:
                                                <input type="text" name="especialidade" value={formData.especialidade} onChange={handleFormChange} />
                                            </label>
                                            <button type="button" onClick={handleUpdateMedico}>Salvar</button>
                                            <button type="button" onClick={() => setEditingMedico(null)}>Cancelar</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                            <div className="outer1">
                                    <ul className="ul">
                                        <li>
                                            <h6 className="caret" onClick={toggleNested}>Convênios</h6>
                                            <ul className="nested">
                                                    <div className="card-pad">
                                                        <div className="card-detalhes">
                                                        <table>
                                                            <thead>
                                                                <th>Nome</th>
                                                                <th>Link</th>
                                                                <th>Usuario</th>
                                                                <th>Senha</th>
                                                                <th>Ações</th>
                                                            </thead>
                                                            <tbody>
                                                                {convenios.map((convenio) => (
                                                                    <tr key={convenio.id}>
                                                                        <td>{convenio.nome}</td>
                                                                        <td>
                                                                            <a href={convenio.link} target="_blank" rel="noopener noreferrer">
                                                                                {convenio.link}
                                                                            </a>
                                                                        </td>
                                                                        <td>{convenio.usuario}</td>
                                                                        <td>{convenio.senha}</td>
                                                                        <td>
                                                                            <div className="div-acoes">
                                                                                <div className="div-img">
                                                                                    <img className="clicavel" src={detalhesIcon} alt="Detalhes" width="24" height="24" />
                                                                                    <img className="clicavel" src={editarIcon2} alt="Editar" width="24" height="24" />
                                                                                    <img className="clicavel" src={excluirIcon} alt="Excluir" width="24" height="24" onClick={() => handleDeleteConvenio(convenio.id)}/>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>                                                                   
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        </div>
                                                    </div>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="avisos">
                                <div className="cardavisos">
                                    olá
                                </div>
                            </div>
                        </div>

                    {selectedAviso && (
                        <div className="popup-overlay">
                            <div className="popup">
                                <h2>{selectedAviso.titulo}</h2>
                                <p>{new Date(selectedAviso.data).toLocaleDateString()}</p>
                                <p>{selectedAviso.detalhes}</p>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={isCheckboxChecked} 
                                        onChange={() => setIsCheckboxChecked(!isCheckboxChecked)} 
                                    />
                                    Marque para confirmar que visualizou o aviso
                                </label>
                                <button onClick={handleClosePopup}>Fechar</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center">
                    <h1>Você não está logado</h1>
                    <button className="btn btn-success" onClick={() => navigate("/login")} id="botaoEntrar">Entrar</button>
                </div>
            )}
        </div>
    );
}

export default HomePage;

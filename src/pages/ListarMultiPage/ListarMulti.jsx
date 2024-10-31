import { useEffect, useState } from "react";
import { supabase } from '../../helper/supabase';
import { Helmet } from "react-helmet";
import "./styleListarMultiprofissionais.css";
import TopBar from "../components/topbar";
import { useNavigate } from "react-router-dom";

export function ListarMultiprofissionaisPage() {
    const [loading, setLoading] = useState(true);
    const [medicos, setMedicos] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa
    const navigate = useNavigate();

    useEffect(() => {
        fetchMedicos();
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
        setLoading(false);
    };

    const handleItemClick = (id) => {
        navigate(`/medicos/${id}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Atualiza o termo de pesquisa com o valor digitado
    };

    // Filtrar médicos com base no termo de pesquisa
    const filteredMedicos = medicos.filter((medico) =>
        medico.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return (
        <div>
            <Helmet>
                <title>Listar Multiprofissionais</title>
            </Helmet>
            <TopBar />
            <div className="main-listar">
                <h1 className="h1-listar">Lista de Multiprofissionais</h1>

                {/* Campo de pesquisa */}
                <input
                    type="text"
                    placeholder="Pesquisar por nome..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />

                <ul className="ul-listar">
                    {filteredMedicos.map((medico) => (
                        <li
                            className="li-listar"
                            key={medico.id}
                            onClick={() => handleItemClick(medico.id)}
                        >
                            {medico.nome}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ListarMultiprofissionaisPage;

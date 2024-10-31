import { useEffect, useState } from "react";
import { supabase } from "../../helper/supabase";
import { Helmet } from "react-helmet";
import TopBar from "../components/topbar";
import { useNavigate } from "react-router-dom";
import "./styleListarConvenio.css";

export function ListarConvenioPage () {
    const [loading, setLoading] = useState(true);
    const [convenio, setConvenio] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConvenios();
    }, []);

    const fetchConvenios = async () => {
        const { data, error } = await supabase
        .from('convenios')
        .select('*');

        if (error) {
            console.error("Erro ao buscar convênio: ", error);    
        } else {
            setConvenio(data);            
        }
        setLoading(false)
    };
    
    const handleItemClick = (id) => {
        navigate(`/convenios/${id}`);
        
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return(
        <div>
            <Helmet>
                Listar Convênios
            </Helmet>
            <TopBar></TopBar>
            <div className="main-listar">

            <h1 className="h1-listar">Lista de Convênios</h1>
            <ul className="ul-listar">
                {convenio.map((convenio) => (
                    <li
                    className="li-listar"
                    key={convenio.id}
                    onClick={() => handleItemClick(convenio.id)}
                    >
                        {convenio.nome}
                    </li>
                ))}
            </ul>
            </div>
        </div>
    )
}

export default ListarConvenioPage;
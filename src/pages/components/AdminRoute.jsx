import React, { useEffect, useState } from 'react';
import { supabase } from '../../helper/supabase';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    console.error("Erro ao buscar role do usuário:", error);
                }
            }
            setLoading(false);
        };

        checkAdmin();
    }, []);

    if (loading) return <div>Carregando...</div>;

    return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;

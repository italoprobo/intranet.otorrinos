import { useEffect, useState } from "react";
import { supabase } from '../../helper/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { Link, useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Helmet } from "react-helmet";
import LogoOtorrinos from "../../img/logo_otorrinos.jpg";

import "./styleLogin.css";

export function LoginPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user);

        const fetchRole = async () => {
            if (session?.user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    setRole(data.role);
                }
            }
        };

        fetchRole();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            switch (event) {
                case "SIGNED_IN":
                    setUser(session?.user);
                    fetchRole();
                    navigate("/");
                    break;
                case "SIGNED_OUT":
                    setUser(null);
                    setRole(null);
                    break;
                default:
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <div id="login">
            <Helmet>
                <title>Otorrinos - Login</title>
            </Helmet>
            <div className="otorrinos">
                <img src={LogoOtorrinos} alt="Logo Otorrinos" />
            </div>
            <div className="cardLogin">
                <div className="insidelogin">
                    <Auth
                        supabaseClient={supabase}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: '',
                                    email_input_placeholder: 'Digite seu e-mail',
                                    password_input_placeholder: 'Digite sua senha',
                                    password_label: '',
                                    button_label: 'Entrar',
                                    loading_button_label: 'Entrando ...',
                                    link_text: 'Entrar',
                                }
                            },
                        }}
                        appearance={{
                            theme: ThemeSupa,
                            className: {
                                button: 'botaoLogin',
                            },
                            variables: {
                                default: {
                                    colors: {
                                        brand: 'green',
                                        brandAccent: 'tomato',
                                    },
                                },
                            },
                        }}
                        providers={[]}
                        showLinks={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

import './styleProfilePage.css'
import { Helmet } from "react-helmet"; 
import TopBar from "../components/topbar";
import { useState, useEffect } from 'react';
import { supabase } from '../../helper/supabase';

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [birthday, setBirthday] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [profileImageFile, setProfileImageFile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('profiles')
                .select('birthday, profile_image_url')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Erro ao buscar perfil:', error);
            } else {
                setUserData(user);
                setBirthday(data.birthday);
                setProfileImageUrl(data.profile_image_url);
            }
        }
        fetchProfile();
    }, []);

    const handleImageUpload = async () => {
        if (profileImageFile) {
            const fileName = `${userData.id}-${profileImageFile.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('profile-image')
                .upload(fileName, profileImageFile);
    
            if (uploadError) {
                console.error('Erro ao fazer upload da imagem:', uploadError);
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('profile-image')
                    .getPublicUrl(fileName);
    
                const imageUrl = publicUrlData?.publicUrl;
                console.log('Public URL gerado:', imageUrl);
    
                if (imageUrl) {
                    setProfileImageUrl(imageUrl);
    
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({ profile_image_url: imageUrl })
                        .eq('id', userData.id);
    
                    if (updateError) {
                        console.error('Erro ao atualizar o URL da imagem no perfil:', updateError);
                    } else {
                        console.log('URL da imagem atualizado com sucesso no perfil:', imageUrl);
                    }
                } else {
                    console.error('Erro: URL público não foi gerado.');
                }
            }
        }
    }

    const handleSaveProfile = async () => {
        const { error } = await supabase
            .from('profiles')
            .update({ birthday })
            .eq('id', userData.id);

        if (error) {
            console.error('Erro ao salvar perfil:', error);
        } else {
            alert('Perfil atualizado com sucesso!');
        }
    };


    return(
        <div className='main'>
            <Helmet>
                <title>Otorrinos - Perfil</title>
            </Helmet>
            <TopBar></TopBar>
            <div className="content-main">
            <h1>Perfil</h1>
            <div>
                <label>Data de Aniversário</label>
                <input 
                    type="date" 
                    value={birthday} 
                    onChange={(e) => setBirthday(e.target.value)} 
                />
            </div>
            <div>
                <label>Imagem de Perfil</label>
                {profileImageUrl && <img src={profileImageUrl} alt="Profile" width={100} />}
                <input type="file" onChange={(e) => setProfileImageFile(e.target.files[0])} />
                <button onClick={handleImageUpload}>Upload Imagem</button>
            </div>
            <button onClick={handleSaveProfile}>Salvar Perfil</button>
        </div>          
        </div>
    )
};

export default ProfilePage;

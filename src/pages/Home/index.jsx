import React, { useState } from 'react';
import AccountService from '../../services/AccountService'
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [errorTimeout, setErrorTimeout] = useState(null);
    const [account, setAccount] = useState('');

    const handleSearch = () => {
        const id = account || 0;
        AccountService.getAccount(id)
        .then((response) => {
            const accountId = response.data.id;
            navigate(`/transfers/${accountId}`);
        })
        .catch((error) => {
            setShowError(true);

            // Configurar um timer para ocultar a mensagem de erro após 5 segundos
            const timeout = setTimeout(() => {
                setShowError(false);
                setErrorTimeout(null);
            }, 5000);
          
            // Armazenar a referência do timer no estado
            setErrorTimeout(timeout);
        });
    }
    
    return (
        <div className="vh-100 row align-items-center justify-content-center">
            {showError && (
                <Alert variant="danger" 
                    onClose={() => 
                    setShowError(false)}
                    dismissible
                >
                    Conta digitada não existente!
                </Alert>
            )}
            <div className='col-3 text-start rounded p-5 bg-secondary'>
                <label 
                    htmlFor="account" 
                    className="form-label text-white"
                >
                    Digite o número da conta:
                </label>
                <input 
                  type="number"
                  id="account" 
                  name="account" 
                  className="form-control" 
                  onChange={(evento) => setAccount(evento.target.valueAsNumber)} 
                />
                <div className="d-flex justify-content-center mt-4">
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleSearch}
                    >
                        Pesquisar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
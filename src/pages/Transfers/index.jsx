import React, { useEffect, useState } from 'react';
import TransferService from '../../services/TransferService';
import moment from 'moment';
import Pagination from 'react-bootstrap/Pagination';
import { useParams } from 'react-router-dom';

function Transfers() {
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [transferencias, setTransferencias] = useState([]);
  const [transferStartDate, setTransferStartDate] = useState('');
  const [transferEndDate, setTransferEndDate] = useState('');
  const [transactionOperatorName, setTransactionOperatorName] = useState('');

  useEffect(() => {
    retrieveTransfers();
  }, [page]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'transferStartDate') {
      setTransferStartDate(value);
    } else if (name === 'transferEndDate') {
      if (value < transferStartDate) {
        setTransferEndDate(transferStartDate);
      } else {
        setTransferEndDate(value);
      }
    } else {
      setTransactionOperatorName(value);
    }
  };

  const handleSearch = () => {
    setPage(0);
    retrieveTransfers();
  };

  const retrieveTransfers = () => {
    let params = `page=${page}`;
    const data = {
      account: id,
      transferStartDate: transferStartDate || '',
      transferEndDate: transferEndDate || '',
      transactionOperatorName: transactionOperatorName || '',
    };

    TransferService.getTransfer(params, data)
      .then((response) => {
        setTransferencias(response.data.content);
        setTotalPages(response.data.totalPages);
      });
  };

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage);
  };

  return (
    <div className="container text-start">
      <div className="row mt-5">
        <div className="col me-5">
          <label htmlFor="transferStartDate" className="form-label">Data de Início</label>
          <input 
            type="date" 
            id="transferStartDate" 
            name="transferStartDate" 
            className="form-control" 
            onChange={handleChange}
            value={transferStartDate} 
          /> 
        </div>
        <div className="col me-5">
          <label htmlFor="transferEndDate" className="form-label">Data de Fim</label>
          <input 
            type="date" 
            id="transferEndDate" 
            name="transferEndDate" 
            className="form-control" 
            onChange={handleChange}
            value={transferEndDate} 
          />
        </div>
        <div className="col">
          <label htmlFor="transactionOperatorName" className="form-label">Nome operador transação</label>
          <input 
            type="text" 
            id="transactionOperatorName" 
            name="transactionOperatorName" 
            className="form-control" 
            onChange={handleChange}
            value={transactionOperatorName} 
          /> 
        </div>
      </div>
      <div className="d-flex justify-content-end my-5" >
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleSearch}
        >
          Pesquisar
        </button>
      </div>

      <div>
        <div className="border justify-content-start py-2">
          <span className="px-2">Saldo total: R$ {}</span>
          <span className="px-5">Saldo no período: R$ {}</span>
        </div>
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Valencia</th>
              <th scope="col">Tipo</th>
              <th scope="col">Nome do operador transacionado</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {transferencias.map((transferencia, index) => (
              <tr key={transferencia.id}>
                <td>{moment(transferencia.transferDate).format("DD/MM/YYYY")}</td>
                <td>R$ {transferencia.value}</td>
                <td>{transferencia.typeTransfer}</td>
                <td>{transferencia.transactionOperatorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border container">
          <Pagination className="justify-content-center mb-0">
            <Pagination.First 
              onClick={() => handlePageChange(0)} 
              disabled={page === 0}
              linkStyle={{border: 'none', margin: '0 0.5em' }}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              linkStyle={{border: 'none', margin: '0 0.5em' }}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                linkStyle={{border: 'none', margin: '0 0.5em' }}
                key={index}
                active={index === page}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
              linkStyle={{border: 'none', margin: '0 0.5em' }}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={page === totalPages - 1}
              linkStyle={{border: 'none', margin: '0 0.5em' }}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Transfers;

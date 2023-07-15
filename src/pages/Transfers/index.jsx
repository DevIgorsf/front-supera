import React, { Component } from 'react';
import TransferService from '../../services/TransferService';
import moment from 'moment';
import Pagination from 'react-bootstrap/Pagination';


class Transfers extends Component {
    constructor(props) {
      super(props);
      this.state = {
        page: 0,
        totalPages: 0,
        transferencias: []
      };
      this.handlePageChange = this.handlePageChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    handleSearch() {
        this.setState(
          {
            page: 0
          },
          () => {
            const { transferStartDate, transferEndDate, transactionOperatorName } = this.state;

            // Crie um objeto com os parâmetros de busca
            const data = {
                transferStartDate: transferStartDate ?? "",
                transferEndDate: transferEndDate ?? "",
                transactionOperatorName: transactionOperatorName ?? ""
            };
            console.log(data);
            TransferService.getTransferSearch(data).then((response) => {
              console.log("passou aqui");
              console.log(response.data);
                this.setState({
                  transferencias: response.data.content,
                  totalPages: response.data.totalPages,
                  page: response.data.number
                });
                console.log(response.data);
            });
          }
        );
      }
  
    componentDidMount() {
      this.retrieveTransfers();
    }
  
    retrieveTransfers() {
      const { page } = this.state;
      let params = "";
      params= "page=" + page;
  
      console.log(params);
      TransferService.getTransfer(params).then((response) => {
        this.setState({
          transferencias: response.data.content,
          totalPages: response.data.totalPages,
          page: response.data.number
        });
        console.log(response.data.content);
      });
    }
  
    handlePageChange(selectedPage) {
      this.setState(
        {
          page: selectedPage
        },
        () => {
          this.retrieveTransfers();
        }
      );
    }
  
    render() {
      const { transferencias, totalPages, page } = this.state;
      return (
        <div className="container text-start">
          <div className="row mt-5">
            <div className="col me-5">
              <label htmlFor="transferStartDate" className="form-label">Data de Início</label>
              <input type="date" id="transferStartDate" name="transferStartDate" className="form-control" onChange={this.handleChange} /> 
            </div>
            <div className="col me-5">
              <label htmlFor="transferEndDate" className="form-label">Data de Fim</label>
              <input type="date" id="transferEndDate" name="transferEndDate" className="form-control" onChange={this.handleChange} />
            </div>
            <div className="col">
              <label htmlFor="transactionOperatorName" className="form-label">Nome operador transação</label>
              <input type="text" id="transactionOperatorName" name="transactionOperatorName" className="form-control" onChange={this.handleChange} /> 
            </div>
          </div>
          <div className="d-flex justify-content-end my-5" >
            <button type="button" className="btn btn-secondary" onClick={this.handleSearch}>Pesquisar</button>
          </div>
  
          <div>
            <table className="table border mb-0">
              <thead>
                <tr>
                  <td className="col">Saldo total: R$</td>
                  <td className="col">Saldo no período: R$</td>
                </tr>
              </thead>
            </table>
            <table className="table table-bordered mb-0">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Nome Operador</th>
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
                        onClick={() => this.handlePageChange(0)} 
                        disabled={page === 0}
                        linkStyle={{border: 'none', margin: '0 0.5em' }}/>
                    <Pagination.Prev 
                        onClick={() => this.handlePageChange(page - 1)}
                        disabled={page === 0}
                        linkStyle={{border: 'none', margin: '0 0.5em' }}/>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                        linkStyle={{border: 'none', margin: '0 0.5em' }}
                        key={index}
                        active={index === page}
                        onClick={() => this.handlePageChange(index)}
                        >
                        {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next 
                        onClick={() => this.handlePageChange(page + 1)}
                        disabled={page === totalPages - 1}
                        linkStyle={{border: 'none', margin: '0 0.5em' }}/>
                    <Pagination.Last 
                        onClick={() => this.handlePageChange(totalPages - 1)}
                        disabled={page === totalPages - 1}
                        linkStyle={{border: 'none', margin: '0 0.5em' }}/>
                </Pagination>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default Transfers;
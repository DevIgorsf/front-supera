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
      const { name, value } = event.target;

      if (name === 'transferStartDate') {
        // Atualize o estado da data de início
        this.setState({ transferStartDate: value });
      } else if (name === 'transferEndDate') {
        // Verifique se a nova data de fim é anterior à data de início
        if (value < this.state.transferStartDate) {
          // Se for anterior, defina a data de fim como a data de início
          this.setState({ transferEndDate: this.state.transferStartDate });
        } else {
          // Caso contrário, atualize o estado da data de fim
          this.setState({ transferEndDate: value });
        }
      } else {
        this.setState({ transactionOperatorName: value });
      }
    }
  
    componentDidMount() {
      this.retrieveTransfers();
    }

    handleSearch() {
      this.setState(
        {
          page: 0
        },
        () => {
          this.retrieveTransfers();
        }
      );
    }
  
    retrieveTransfers() {
      const { page } = this.state;
      let params = "";
      params= "page=" + page;
      const { transferStartDate, transferEndDate, transactionOperatorName } = this.state;

      const data = {
          transferStartDate: transferStartDate ?? "",
          transferEndDate: transferEndDate ?? "",
          transactionOperatorName: transactionOperatorName ?? ""
      };
      TransferService.getTransfer(params, data).then((response) => {
          this.setState({
            transferencias: response.data.content,
            totalPages: response.data.totalPages,
            page: response.data.number
          });
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
              <input 
                type="date" 
                id="transferStartDate" 
                name="transferStartDate" 
                className="form-control" 
                onChange={this.handleChange}
                value={this.state.transferStartDate} /> 
            </div>
            <div className="col me-5">
              <label htmlFor="transferEndDate" className="form-label">Data de Fim</label>
              <input 
                type="date" 
                id="transferEndDate" 
                name="transferEndDate" 
                className="form-control" 
                onChange={this.handleChange}
                value={this.state.transferEndDate} />
            </div>
            <div className="col">
              <label htmlFor="transactionOperatorName" className="form-label">Nome operador transação</label>
              <input 
                type="text" 
                id="transactionOperatorName" 
                name="transactionOperatorName" 
                className="form-control" 
                onChange={this.handleChange} /> 
            </div>
          </div>
          <div className="d-flex justify-content-end my-5" >
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={this.handleSearch}>
                Pesquisar
            </button>
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
import React from 'react';
import PropTypes from 'prop-types';
import Modal from "react-modal";
import { Orders } from '../../services';
import "./order.css";


export class OrderModal extends React.Component {

  static propTypes = {
    accessToken: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    orderId: PropTypes.number,
    error_message: PropTypes.array
  };

  static customStyles = {
    overlay: {
      zIndex: '10'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      width: '400px',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '10'
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: '',
      show_guide: false,
      guide_url: ''
    };

    this.order_service = new Orders(this.props.accessToken);
  }

  componentDidUpdate = (oldProps) => {
    if (oldProps.orderId !== this.props.orderId) {

      // asure access token
      this.order_service.access_token = this.props.accessToken;

      // rety while it is not generated
      let interval = setInterval(async () => {
        // animation
        this.setState({ loading: this.state.loading.length >= 3 ? '' : `${this.state.loading}.` });

        // try document
        await this.loadDocument();

        // clear interval when ready
        if (!this.props.isOpen) clearInterval(interval);
        if (this.state.show_guide) clearInterval(interval);
      }, 1000);
    }
  }

  loadDocument = async () => {
    let json_data, extra_info;

    json_data = await this.order_service.get(this.props.orderId);
    // validate data
    if (json_data.order !== undefined && json_data.order.extra_info !== undefined) {
      if (json_data.order.extra_info !== '') {

        // get document
        extra_info = JSON.parse(json_data.order.extra_info);
        if (extra_info.dispatch_guide !== undefined) {

          // change state
          this.setState({
            show_guide: true,
            guide_url: extra_info.dispatch_guide.url
          });
          return;
        }
      }
    }
  }

  modal_message = () => {
    let render;
    let error_style;
    if (this.props.error_message.length > 0) {
      render = this.props.error_message.map(error => (
        <tr key={error.barcode}>
          <td>{error.barcode}</td>
          <td>{error.name}</td>
          <td>{error.max_replenishment}</td>
          
        </tr>));
      error_style = {
        flex: 1,
        flexDirection: '',
        fontSize: '12px',
        textAlign: 'center',
        messageTable:{}

      }
      return (
        <div style={error_style}>
          <legend>Fallo al generar guia</legend>
          <p>Los siguientes productos superan el stock disponible en bodega: </p>
          <table className="messageTable" border='1' frame='void' rules='rows'>
            <thead>
              <tr>
                <th>Codigo de barra</th>
                <th>Nombre</th>
                <th>Max. a reponer</th>
              </tr>
            </thead>
            <tbody>
              {render}
            </tbody>
          </table>
        
        </div>
        
      );
    }
    else {
      return this.state.show_guide ?
        <div><a target="__blank" href={this.state.guide_url} >Descargar guía</a></div> :
        <div>Esperando documento {this.state.loading}</div>;
    }
  }


  render = () => {
    return (
      <Modal
        isOpen={this.props.isOpen}
        ariaHideApp={false}
        style={OrderModal.customStyles}
        contentLabel="Example Modal"
      >
        <button className="order-modal-close" onClick={() => {
          this.setState({ show_guide: false, guide_url: '' });
          this.props.onClose();
        }}>X</button>
        {this.modal_message()}
      </Modal>
    );
  }
}

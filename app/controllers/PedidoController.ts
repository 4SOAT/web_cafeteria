import * as HttpStatus from 'http-status';
import ClienteRepository from "../gateways/ClienteRepository";
import PedidoRepository from '../gateways/PedidoRepository';
import ResponseAPI from '../adapters/ResponseAPI';
//import MysqlDataBase from '../../../external/MysqlDataBase';
import { IDataBase } from "../interfaces/IDataBase";
import { PedidoCasoDeUso } from '../cases/pedidoCasodeUso';
import ProdutoRepository from '../gateways/ProdutoRepository';
import BadRequestError from '../application/exception/BadRequestError';

class PedidoController {
    
    public repository: PedidoRepository;
    public clienteRepository: ClienteRepository;
    public produtoRepository: ProdutoRepository;

    /**
     *
     */
    constructor(readonly dbconnection: IDataBase) {
        this.clienteRepository = new ClienteRepository(dbconnection);
        this.produtoRepository = new ProdutoRepository(dbconnection);
        this.repository = new PedidoRepository(dbconnection);
    }

    /**
     *
     * @param request
     * @param response
     */
    public all = async (request, response) => {
        try {
            let data = await PedidoCasoDeUso.getAllPedidos(request.query,this.repository);
            response.status(HttpStatus.OK).json(ResponseAPI.list(data));
        } catch(err) {
            if (err instanceof BadRequestError) {
                response.status(HttpStatus.BAD_REQUEST).json(ResponseAPI.error(err.message));
            } else if (err instanceof Error) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseAPI.error(err.message)); 
            } 
        }
    }

    /**
     *
     * @param request
     * @param response
     */
    public store = async (request, response) => {
        
        try {
            const orderResultId = PedidoCasoDeUso.adicionarProdutoPedido(
                request,
                this.clienteRepository,
                this.produtoRepository,
                this.repository
            )
            response.status(HttpStatus.OK).json(ResponseAPI.data(orderResultId));
        } catch(err) {
            if (err instanceof BadRequestError) {
                response.status(HttpStatus.BAD_REQUEST).json(ResponseAPI.error(err.message));
            } else if (err instanceof Error) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseAPI.error(err.message)); 
            } 
        }
    }

    /**
     *
     * @param request
     * @param response
     */
    public update = async (request, response) => {
        try {
            let order = await PedidoCasoDeUso.encontrarPedidoPorId(request.params.id, this.repository);
            order.setStatus(request.body.status);
            let data = await PedidoCasoDeUso.atualizarPedido(order, request.params.id,this.repository);
            response.status(HttpStatus.OK).json(ResponseAPI.data(data));
        } catch (err) {
            if (err instanceof BadRequestError) {
                response.status(HttpStatus.BAD_REQUEST).json(ResponseAPI.error(err.message));
            } else if (err instanceof Error) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseAPI.error(err.message)); 
            } 
        }
    }

    /**
     *
     * @param request
     * @param response
     */
    public show = async (request, response) => {
        try {
            if (typeof request.params.id == 'undefined' || request.params.id == "") {
                throw new BadRequestError("ID do registro é requerido.");
            }
            let data = await PedidoCasoDeUso.encontrarPedidoPorId(request.params.id,this.repository);
            response.status(HttpStatus.OK).json(ResponseAPI.data(data));
        } catch (err) {
            if (err instanceof BadRequestError) {
                response.status(HttpStatus.BAD_REQUEST).json(ResponseAPI.error(err.message));
            } else if (err instanceof Error) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseAPI.error(err.message)); 
            } 
        }
    }

    /**
     *
     * @param request
     * @param response
     */
    public delete = async (request, response) => {
        try {
            if (typeof request.params.id == 'undefined' || request.params.id == "") {
                throw new BadRequestError("ID do registro é requerido.");
            }
            await PedidoCasoDeUso.deletePedido(request.params.id,this.repository);
            response.status(HttpStatus.NO_CONTENT).json({});
        } catch (err) {
            if (err instanceof BadRequestError) {
                response.status(HttpStatus.BAD_REQUEST).json(ResponseAPI.error(err.message));
            } else if (err instanceof Error) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ResponseAPI.error(err.message)); 
            } 
        }
    }

}

export default PedidoController;

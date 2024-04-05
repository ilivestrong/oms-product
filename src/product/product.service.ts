import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateProductRequest, ListProductsRequest, Product as ProductProto, ListProductsResponse,
    UpdateProductRequest, DeleteProductRequest, DeleteProductResponse, DecrementQtyRequest,
    DecrementQtyResponse
} from 'src/protos/product';
import { Repository, In } from 'typeorm';
import { status } from '@grpc/grpc-js';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    private logger = new Logger(ProductService.name);
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async getProduct(productId: string): Promise<ProductProto> {
        const product = await this.productRepository.findOne({ where: { id: productId, is_active: true } })
        if (!product) {
            const e = makeError(status.NOT_FOUND, `Product with id:{${productId}} not found.`)
            this.logger.log(e)
            throw new RpcException(e)
        }
        return toProductProto(product)
    }

    async listProducts({ productIds }: ListProductsRequest): Promise<ListProductsResponse> {
        let products: Product[];
        let response: ProductProto[] = [];

        if (productIds && productIds.length > 0) {
            products = await this.productRepository.find({ where: { id: In([...productIds]), is_active: true } });
        } else {
            products = await this.productRepository.find({ where: { is_active: true } });
        }

        if (!products || products.length == 0) {
            const e = makeError(status.NOT_FOUND, `no products found.`)
            this.logger.log(e)
            throw new RpcException(e)
        }
        products.forEach((p) => response.push(toProductProto(p)))
        return { products: response }
    }

    async createProduct(req: CreateProductRequest): Promise<ProductProto> {
        try {
            let product = this.productRepository.create(req);
            product.available_qty = req.availableQty
            product.is_active = true

            const saved = await this.productRepository.save(product);
            return toProductProto(saved)
        } catch (error: any) {

            const e = makeError(status.INTERNAL, `failed to create product`)
            this.logger.log(error)
            throw new RpcException(e)
        }
    }

    async updateProduct(req: UpdateProductRequest): Promise<ProductProto> {
        try {
            let product = await this.getProduct(req.productId);
            if (!product) {
                throw new RpcException(makeError(status.NOT_FOUND, `product not found: ${req.productId}`))
            }

            let p: Product = {
                id: req.productId,
                name: req.name,
                description: req.description,
                price: req.price,
                available_qty: req.availableQty,
                is_active: product.isActive
            }

            await this.productRepository.save(p)
            return toProductProto(p);
        } catch (error: any) {
            const e = makeError(status.INTERNAL, `failed to update product`)
            this.logger.log(e)
            throw new RpcException(e)
        }
    }

    async deleteProduct({ productId }: DeleteProductRequest): Promise<DeleteProductResponse> {
        try {
            let product = await this.getProduct(productId);
            if (!product) {
                throw new RpcException(makeError(status.NOT_FOUND, `product not found: ${productId}`))
            }

            let p: Product = {
                id: productId,
                name: product.name,
                description: product.description,
                price: product.price,
                available_qty: product.availableQty,
                is_active: false,
            }

            await this.productRepository.save(p)
            return {
                productId,
                message: `product deleted(marked inactive)`
            }
        } catch (error: any) {
            if (error.getError().code != status.NOT_FOUND) {
                const e = makeError(status.INTERNAL, `failed to delete product`)
                this.logger.log(e)
                throw new RpcException(e)
            }
            throw new RpcException({ code: error.code, message: error.message })
        }
    }

    async decrementQty({ productId, offset }: DecrementQtyRequest): Promise<DecrementQtyResponse> {
        try {
            let product = await this.getProduct(productId);
            if (!product) {
                throw new RpcException(makeError(status.NOT_FOUND, `product not found: ${productId}`))
            }

            let p: Product = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                available_qty: product.availableQty - offset,
                is_active: product.isActive
            }

            await this.productRepository.save(p)
            return {
                productId,
                message: `product quantity decremented by ${offset}`
            }
        } catch (error: any) {
            if (error.getError().code != status.NOT_FOUND) {
                const e = makeError(status.INTERNAL, `failed to decrement product quantity`)
                this.logger.log(e)
                throw new RpcException(e)
            }
            throw new RpcException(error.getError())
        }
    }
}

function toProductProto({ id, name, description, price, available_qty, is_active }) {
    return {
        id,
        name,
        description,
        price,
        availableQty: available_qty,
        isActive: is_active,
    }
}

function makeError(code: status, message: string) {
    return { code, message }
}
import { Controller, Logger, UseFilters } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
    CreateProductRequest, DecrementQtyRequest, DecrementQtyResponse, DeleteProductRequest, DeleteProductResponse,
    GetProductRequest, ListProductsRequest, ListProductsResponse, Product,
    ProductServiceController, ProductServiceControllerMethods,
    UpdateProductRequest
} from 'src/protos/product';
import { ProductService } from './product.service';

@Controller('product')
@ProductServiceControllerMethods()
export class ProductController implements ProductServiceController {
    private readonly logger = new Logger(ProductController.name);

    constructor(
        private productService: ProductService,
    ) { }
    get({productId}: GetProductRequest): Product | Promise<Product> | Observable<Product> {
      return  this.productService.getProduct(productId)
    }
   
    list(request: ListProductsRequest): ListProductsResponse | Promise<ListProductsResponse> | Observable<ListProductsResponse> {
        return this.productService.listProducts(request);
    }
    create(request: CreateProductRequest): Product | Promise<Product> | Observable<Product> {
        this.logger.debug(request)
        return this.productService.createProduct(request)
    }
    update(request: UpdateProductRequest): Product | Promise<Product> | Observable<Product> {
        return this.productService.updateProduct(request)
    }
    delete(request: DeleteProductRequest): Promise<DeleteProductResponse> {
        return this.productService.deleteProduct(request)
    }
    decrementQty(request: DecrementQtyRequest): Promise<DecrementQtyResponse> {
        return this.productService.decrementQty(request)
    }
}

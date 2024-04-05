/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "oms";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  availableQty: number;
  isActive: boolean;
}

export interface GetProductRequest {
  productId: string;
}

export interface ListProductsRequest {
  productIds: string[];
}

export interface ListProductsResponse {
  products: Product[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  availableQty: number;
}

export interface CreateProductResponse {
  product: Product | undefined;
}

export interface UpdateProductRequest {
  productId: string;
  name: string;
  description: string;
  price: number;
  availableQty: number;
}

export interface DeleteProductRequest {
  productId: string;
}

export interface DeleteProductResponse {
  productId: string;
  message: string;
}

export interface DecrementQtyRequest {
  productId: string;
  offset: number;
}

export interface DecrementQtyResponse {
  productId: string;
  message: string;
}

export const OMS_PACKAGE_NAME = "oms";

export interface ProductServiceClient {
  get(request: GetProductRequest): Observable<Product>;

  list(request: ListProductsRequest): Observable<ListProductsResponse>;

  create(request: CreateProductRequest): Observable<Product>;

  update(request: UpdateProductRequest): Observable<Product>;

  delete(request: DeleteProductRequest): Observable<DeleteProductResponse>;

  decrementQty(request: DecrementQtyRequest): Observable<DecrementQtyResponse>;
}

export interface ProductServiceController {
  get(request: GetProductRequest): Promise<Product> | Observable<Product> | Product;

  list(
    request: ListProductsRequest,
  ): Promise<ListProductsResponse> | Observable<ListProductsResponse> | ListProductsResponse;

  create(request: CreateProductRequest): Promise<Product> | Observable<Product> | Product;

  update(request: UpdateProductRequest): Promise<Product> | Observable<Product> | Product;

  delete(
    request: DeleteProductRequest,
  ): Promise<DeleteProductResponse> | Observable<DeleteProductResponse> | DeleteProductResponse;

  decrementQty(
    request: DecrementQtyRequest,
  ): Promise<DecrementQtyResponse> | Observable<DecrementQtyResponse> | DecrementQtyResponse;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "list", "create", "update", "delete", "decrementQty"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";

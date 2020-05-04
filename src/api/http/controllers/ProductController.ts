import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam,
    QueryParams
} from 'routing-controllers';

import ProductFindRequest from '../../../api/request/ProductFindRequest';
import FindResponse from '../../../api/response/FindResponse';
import { Product } from '../../../models/Product';
import { User } from '../../../models/User';
import { ProductService } from '../../../services/ProductService';
import { Product as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class ProductController {
    constructor(
        private productService: ProductService
    ) { }

    @Authorized()
    @Post()
    public async createProduct(
        @CurrentUser() loggedInUser: User,
        @Body() product: Product
    ): Promise<Product> {
        return await this.productService.createProduct(product, loggedInUser);
    }

    @Authorized()
    @Get(Route.ID)
    public async getProduct(@Param('productId') productId: string): Promise<Product> {
        return await this.productService.getProduct(Number(productId));
    }

    @Authorized()
    @Get()
    public async getProducts(@QueryParams() params: ProductFindRequest): Promise<FindResponse<Product>> {
        return await this.productService.getProducts(params);
    }

    @Authorized()
    @Put(Route.ID)
    public async editProduct(
        @Param('productId') productId: string,
        @Body() product: Product
    ): Promise<Product> {
        return await this.productService.editProduct(Number(productId), product);
    }

    @Authorized()
    @Delete(Route.ID)
    public async deleteProduct(@Param('productId') productId: string): Promise<Product> {
        return await this.productService.deactivateProduct(Number(productId));
    }

    @Authorized()
    @Get(Route.POINTS)
    public async getProductPoints(@QueryParam('hqId') hqId: string): Promise<Product[]> {
        return await this.productService.getProductPoints(Number(hqId));
    }
}

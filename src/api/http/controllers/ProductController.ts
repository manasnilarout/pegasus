import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam,
    QueryParams
} from 'routing-controllers';

import ProductFindRequest from '../../../api/request/ProductFindRequest';
import FindResponse from '../../../api/response/FindResponse';
import { PackType } from '../../../models/PackType';
import { Product } from '../../../models/Product';
import { ProductType } from '../../../models/ProductType';
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

    @Authorized()
    @Post(Route.BRAND_TYPE)
    public async createProductBrandType(@Body() productType: ProductType): Promise<ProductType> {
        return await this.productService.createProductBrandType(productType);
    }

    @Authorized()
    @Put(Route.BRAND_TYPE_ID)
    public async editProductBrandType(
        @Param('brandTypeId') brandTypeId: string,
        @Body() productType: ProductType
    ): Promise<ProductType> {
        return await this.productService.editProductBrandType(Number(brandTypeId), productType);
    }

    @Authorized()
    @Delete(Route.BRAND_TYPE_ID)
    public async deleteProductBrandType(@Param('brandTypeId') brandTypeId: string): Promise<ProductType> {
        return await this.productService.deleteProductBrandType(Number(brandTypeId));
    }

    @Authorized()
    @Put(Route.PACK_TYPE_ID)
    public async editProductPackType(
        @Param('packTypeId') packTypeId: string,
        @Body() packType: PackType
    ): Promise<PackType> {
        return await this.productService.editProductPackType(Number(packTypeId), packType);
    }

    @Authorized()
    @Delete(Route.PACK_TYPE_ID)
    public async deleteProductPackType(@Param('packTypeId') packTypeId: string): Promise<PackType> {
        return await this.productService.deleteProductPackType(Number(packTypeId));
    }

    @Authorized()
    @Post(Route.PACK_TYPE)
    public async createProductPackType(@Body() packType: PackType): Promise<PackType> {
        return await this.productService.createProductPackType(packType);
    }

    @Authorized()
    @Get(Route.BRAND_TYPE)
    public async getProductBrandType(@QueryParam('id') id: number): Promise<ProductType | ProductType[]> {
        return await this.productService.getProductBrandType(id);
    }

    @Authorized()
    @Get(Route.PACK_TYPE)
    public async getProductPackType(@QueryParam('id') id: number): Promise<PackType | PackType[]> {
        return await this.productService.getProductPackType(id);
    }
}

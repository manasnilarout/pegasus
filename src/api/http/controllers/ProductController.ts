import {
    Authorized, Body, CurrentUser, Get, JsonController, Param, Post
} from 'routing-controllers';

import { Product } from '../../../models/Product';
import { User } from '../../../models/User';
import { ProductService } from '../../../services/ProductService';
import { Product as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class DeviceController {
    constructor(
        private productService: ProductService
    ) { }

    @Authorized()
    @Post()
    public async createProduct(@CurrentUser() loggedInUser: User, @Body() product: Product)
        : Promise<Product> {
            return await this.productService.createProduct(product, loggedInUser);
    }

    @Authorized()
    @Get(Route.ID)
    public async getProduct(@Param('productId') productId: string): Promise<Product> {
        return await this.productService.getProduct(Number(productId));
    }
}

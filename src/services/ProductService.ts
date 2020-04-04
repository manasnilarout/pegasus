import { validate } from 'class-validator';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppValidationError } from '../errors';
import { ProductErrorCodes as ErrorCodes } from '../errors/codes';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { ProductRepository } from '../repositories/ProductRepository';
import { AppService } from './AppService';

@Service()
export class ProductService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private productRepository: ProductRepository
    ) {
        super();
    }

    public async createProduct(product: Product, loggedInUser: User): Promise<Product> {
        try {
            const errors = await validate(product);

            if (errors && errors.length) {
                throw new AppValidationError(
                    ErrorCodes.productValidationFailed.id,
                    ErrorCodes.productValidationFailed.msg,
                    { product, errors }
                );
            }

            product.createdByUser = loggedInUser;
            return await this.productRepository.save(product);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.productCreationFailed.id,
                ErrorCodes.productCreationFailed.msg,
                { product }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getProduct(productId: number): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({
                relations: ['packType', 'productType'],
                where: {
                    id: productId,
                },
            });

            if (!product) {
                throw new AppBadRequestError(
                    ErrorCodes.productNotFound.id,
                    ErrorCodes.productNotFound.msg,
                    { productId }
                );
            }

            return product;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchProductFailed.id,
                ErrorCodes.fetchProductFailed.msg,
                { productId }
            );
            error.log(this.log);
            throw error;
        }
    }
}

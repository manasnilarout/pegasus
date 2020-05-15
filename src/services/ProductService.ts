import { validate } from 'class-validator';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import ProductFindRequest from '../api/request/ProductFindRequest';
import FindResponse from '../api/response/FindResponse';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError, AppValidationError } from '../errors';
import { ProductErrorCodes as ErrorCodes } from '../errors/codes';
import { PackType } from '../models/PackType';
import { Product, ProductStatus } from '../models/Product';
import { ProductType } from '../models/ProductType';
import { User } from '../models/User';
import { PackTypeRepository } from '../repositories/PackTypeRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductTypeRepository } from '../repositories/ProductTypeRepository';
import { AppService } from './AppService';

@Service()
export class ProductService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private productRepository: ProductRepository,
        @OrmRepository() private productTypeRepository: ProductTypeRepository,
        @OrmRepository() private packTypeRepository: PackTypeRepository
    ) {
        super();
    }

    public async createProduct(product: Product, loggedInUser: User): Promise<Product> {
        try {
            product.productName = `${product.brand} ${product.name} ${product.packSize}`.trim();

            const oldProduct = await this.productRepository.findOne({
                where: {
                    productName: product.productName,
                    status: ProductStatus.ACTIVE,
                },
            });

            if (oldProduct) {
                throw new AppBadRequestError(
                    ErrorCodes.productAlreadyExists.id,
                    ErrorCodes.productAlreadyExists.msg,
                    { productName: product.productName }
                );
            }

            await this.validateProduct(product);
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

    public async getProducts(productFindRequest: ProductFindRequest): Promise<FindResponse<Product>> {
        return await this.fetchAll(this.productRepository, productFindRequest);
    }

    public async editProduct(productId: number, product: Product): Promise<Product> {
        try {
            const existingProduct = await this.productRepository.findOne((productId));

            if (!existingProduct) {
                throw new AppBadRequestError(
                    ErrorCodes.productNotFound.id,
                    ErrorCodes.productNotFound.msg,
                    { productId }
                );
            }

            existingProduct.productName = `${product.brand || existingProduct.brand} ${product.name || existingProduct.name}`.trim();
            await this.validateProduct(product);
            return await this.productRepository.save(product);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.editProductFailed.id,
                ErrorCodes.editProductFailed.msg,
                { productId, product }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async deactivateProduct(productId: number): Promise<Product> {
        try {
            const product = await this.productRepository.findOne(productId);

            if (!product) {
                throw new AppBadRequestError(
                    ErrorCodes.productNotFound.id,
                    ErrorCodes.productNotFound.msg,
                    { productId }
                );
            }

            product.status = ProductStatus.INACTIVE;
            return await this.productRepository.save(product);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.deleteProductFailed.id,
                ErrorCodes.deleteProductFailed.msg,
                { productId }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async createProductBrandType(productType: ProductType): Promise<ProductType> {
        try {
            const old = await this.productTypeRepository.findOne({
                name: productType.name,
            });

            if (old) {
                throw new AppBadRequestError(
                    ErrorCodes.productTypeAlreadyExists.id,
                    ErrorCodes.productTypeAlreadyExists.msg,
                    productType
                );
            }

            return await this.productTypeRepository.save(productType);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.creatingProductTypeFailed.id,
                ErrorCodes.creatingProductTypeFailed.msg,
                { productType }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async createProductPackType(packType: PackType): Promise<PackType> {
        try {
            const old = await this.packTypeRepository.findOne({
                name: packType.name,
            });

            if (old) {
                throw new AppBadRequestError(
                    ErrorCodes.packTypeAlreadyExists.id,
                    ErrorCodes.packTypeAlreadyExists.msg,
                    packType
                );
            }

            return await this.packTypeRepository.save(packType);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.creatingPackTypeFailed.id,
                ErrorCodes.creatingPackTypeFailed.msg,
                { packType }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getProductBrandType(): Promise<ProductType[]> {
        try {
            return await this.productTypeRepository.find();
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingProductTypeFailed.id,
                ErrorCodes.fetchingProductTypeFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getProductPackType(): Promise<PackType[]> {
        try {
            return await this.packTypeRepository.find();
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingPackTypeFailed.id,
                ErrorCodes.fetchingPackTypeFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getProductPoints(hqId: number): Promise<Product[]> {
        try {
            const products = await this.productRepository.getProductPoints(hqId);

            for (const product of products) {
                const hqQrPoint = product.qrPoints.find(qrPoint => qrPoint.hqQrPoints.length > 0);

                if (hqQrPoint && hqQrPoint.hqQrPoints && hqQrPoint.hqQrPoints.length) {
                    product.points = hqQrPoint.hqQrPoints[0].hqQrPoints;
                }

                delete product.qrPoints;
            }

            return products;
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingProductPointsFailed.id,
                ErrorCodes.fetchingProductPointsFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    private async validateProduct(product: Product): Promise<void> {
        const errors = await validate(product);

        if (errors && errors.length) {
            throw new AppValidationError(
                ErrorCodes.productValidationFailed.id,
                ErrorCodes.productValidationFailed.msg,
                { product, errors }
            );
        }
    }
}

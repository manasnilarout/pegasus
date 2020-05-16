import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError } from '../errors';
import { LocationErrorCodes as ErrorCodes } from '../errors/codes';
import { City } from '../models/City';
import { HeadQuarters } from '../models/HeadQuarters';
import { States } from '../models/States';
import { CityRepository } from '../repositories/CityRepository';
import { HeadQuartersRepository } from '../repositories/HeadQuartersRepository';
import { StatesRepository } from '../repositories/StatesRepository';
import { AppService } from './AppService';

@Service()
export class LocationService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private cityRepository: CityRepository,
        @OrmRepository() private statesRepository: StatesRepository,
        @OrmRepository() private headQuartersRepository: HeadQuartersRepository
    ) {
        super();
    }

    public async createCity(city: City): Promise<City> {
        try {
            const old = await this.cityRepository.findOne({
                where: {
                    name: city.name,
                },
            });

            if (old) {
                throw new AppBadRequestError(
                    ErrorCodes.cityAlreadyExists.id,
                    ErrorCodes.cityAlreadyExists.msg,
                    { city }
                );
            }

            return await this.cityRepository.save(city);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.cityCreationFailed.id,
                ErrorCodes.cityCreationFailed.msg,
                { city }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async createState(state: States): Promise<States> {
        try {
            const old = await this.statesRepository.findOne({
                where: {
                    name: state.name,
                },
            });

            if (old) {
                throw new AppBadRequestError(
                    ErrorCodes.stateAlreadyExists.id,
                    ErrorCodes.stateAlreadyExists.msg,
                    { state }
                );
            }

            return await this.statesRepository.save(state);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.stateCreationFailed.id,
                ErrorCodes.stateCreationFailed.msg,
                { state }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async createHQ(headQuarters: HeadQuarters): Promise<HeadQuarters> {
        try {
            const old = await this.headQuartersRepository.findOne({
                where: {
                    name: headQuarters.name,
                },
            });

            if (old) {
                throw new AppBadRequestError(
                    ErrorCodes.headQuartersAlreadyExists.id,
                    ErrorCodes.headQuartersAlreadyExists.msg,
                    { headQuarters }
                );
            }

            return await this.headQuartersRepository.save(headQuarters);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.headQuarterCreationFailed.id,
                ErrorCodes.headQuarterCreationFailed.msg,
                { headQuarters }
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getCities(): Promise<City[]> {
        try {
            return await this.cityRepository.find({
                relations: ['hq', 'hq.state'],
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingCitiesFailed.id,
                ErrorCodes.fetchingCitiesFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getStates(): Promise<States[]> {
        try {
            return await this.statesRepository.find();
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingStatesFailed.id,
                ErrorCodes.fetchingStatesFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async getHqs(): Promise<HeadQuarters[]> {
        try {
            return await this.headQuartersRepository.find({
                relations: ['state'],
            });
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.fetchingHqsFailed.id,
                ErrorCodes.fetchingHqsFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }
}

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { AppBadRequestError } from '../errors';
import { LocationErrorCodes as ErrorCodes } from '../errors/codes';
import { City, CityStatus } from '../models/City';
import { HeadQuarters, HeadQuarterStatus } from '../models/HeadQuarters';
import { States, StateStatus } from '../models/States';
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
                where: {
                    status: CityStatus.ACTIVE,
                },
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
            return await this.statesRepository.find({
                where: {
                    status: StateStatus.ACTIVE,
                }
            });
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
                where: {
                    status: HeadQuarterStatus.ACTIVE,
                },
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

    public async editCity(id: number, city: City): Promise<City> {
        try {
            const old = await this.cityRepository.findOne({
                where: { id, status: CityStatus.ACTIVE },
            });

            if (!old) {
                throw new AppBadRequestError(
                    ErrorCodes.cityNotFound.id,
                    ErrorCodes.cityNotFound.msg,
                    { id }
                );
            }

            Object.assign(old, city);
            return await this.cityRepository.save(old);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.editCityFailed.id,
                ErrorCodes.editCityFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async editState(id: string, state: States): Promise<States> {
        try {
            const old = await this.statesRepository.findOne({
                where: { id, status: StateStatus.ACTIVE },
            });

            if (!old) {
                throw new AppBadRequestError(
                    ErrorCodes.stateNotFound.id,
                    ErrorCodes.stateNotFound.msg,
                    { id }
                );
            }

            Object.assign(old, state);
            return await this.statesRepository.save(old);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.editStateFailed.id,
                ErrorCodes.editStateFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async editHq(id: string, hq: HeadQuarters): Promise<HeadQuarters> {
        try {
            const old = await this.headQuartersRepository.findOne({
                where: { id, status: HeadQuarterStatus.ACTIVE },
            });

            if (!old) {
                throw new AppBadRequestError(
                    ErrorCodes.hqNotFound.id,
                    ErrorCodes.hqNotFound.msg,
                    { id }
                );
            }

            Object.assign(old, hq);
            return await this.headQuartersRepository.save(old);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.editHqFailed.id,
                ErrorCodes.editHqFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async deleteCity(id: string): Promise<City> {
        try {
            const old = await this.cityRepository.findOne({
                where: { id },
            });

            if (!old) {
                throw new AppBadRequestError(
                    ErrorCodes.cityNotFound.id,
                    ErrorCodes.cityNotFound.msg,
                    { id }
                );
            }

            old.status = CityStatus.INACTIVE;
            return await this.cityRepository.save(old);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.deleteCityFailed.id,
                ErrorCodes.deleteCityFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async deleteState(id: string): Promise<States> {
        try {
            const old = await this.statesRepository.findOne({
                where: { id },
            });

            if (!old) {
                throw new AppBadRequestError(
                    ErrorCodes.stateNotFound.id,
                    ErrorCodes.stateNotFound.msg,
                    { id }
                );
            }

            old.status = StateStatus.INACTIVE;
            return await this.statesRepository.save(old);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.deleteStateFailed.id,
                ErrorCodes.deleteStateFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }

    public async deleteHq(id: string): Promise<HeadQuarters> {
        try {
            const old = await this.headQuartersRepository.findOne({
                where: { id },
            });

            if (!old) {
                throw new AppBadRequestError(
                    ErrorCodes.hqNotFound.id,
                    ErrorCodes.hqNotFound.msg,
                    { id }
                );
            }

            old.status = HeadQuarterStatus.INACTIVE;
            return await this.headQuartersRepository.save(old);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.deleteCityFailed.id,
                ErrorCodes.deleteCityFailed.msg
            );
            error.log(this.log);
            throw error;
        }
    }
}

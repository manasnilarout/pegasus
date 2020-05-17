import {
    Authorized, Body, Delete, Get, JsonController, Param, Post, Put
} from 'routing-controllers';

import { City } from '../../../models/City';
import { HeadQuarters } from '../../../models/HeadQuarters';
import { States } from '../../../models/States';
import { LocationService } from '../../../services/LocationService';
import { LOCATION as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class LocationController {
    constructor(
        private locationService: LocationService
    ) { }

    @Authorized()
    @Post(Route.CITY)
    public async createCity(@Body() city: City): Promise<City> {
        return await this.locationService.createCity(city);
    }

    @Authorized()
    @Post(Route.STATE)
    public async createState(@Body() state: States): Promise<States> {
        return await this.locationService.createState(state);
    }

    @Authorized()
    @Post(Route.HQ)
    public async createHQ(@Body() headQuarters: HeadQuarters): Promise<HeadQuarters> {
        return await this.locationService.createHQ(headQuarters);
    }

    @Authorized()
    @Get(Route.CITY)
    public async getCities(): Promise<City[]> {
        return await this.locationService.getCities();
    }

    @Authorized()
    @Get(Route.STATE)
    public async getStates(): Promise<States[]> {
        return await this.locationService.getStates();
    }

    @Authorized()
    @Get(Route.HQ)
    public async getHQs(): Promise<HeadQuarters[]> {
        return await this.locationService.getHqs();
    }

    @Authorized()
    @Put(Route.CITY + Route.ID)
    public async editCity(
        @Param('id') id: string,
        @Body() city: City
    ): Promise<City> {
        return await this.locationService.editCity(Number(id), city);
    }

    @Authorized()
    @Put(Route.STATE + Route.ID)
    public async editState(
        @Param('id') id: string,
        @Body() state: States
    ): Promise<States> {
        return await this.locationService.editState(id, state);
    }

    @Authorized()
    @Put(Route.HQ + Route.ID)
    public async editHQ(
        @Param('id') id: string,
        @Body() hq: HeadQuarters
    ): Promise<HeadQuarters> {
        return await this.locationService.editHq(id, hq);
    }

    @Authorized()
    @Delete(Route.CITY + Route.ID)
    public async deleteCity(@Param('id') id: string): Promise<City> {
        return await this.locationService.deleteCity(id);
    }

    @Authorized()
    @Delete(Route.STATE + Route.ID)
    public async deleteState(@Param('id') id: string): Promise<States> {
        return await this.locationService.deleteState(id);
    }

    @Authorized()
    @Delete(Route.HQ + Route.ID)
    public async deleteHQ(@Param('id') id: string): Promise<HeadQuarters> {
        return await this.locationService.deleteHq(id);
    }
}

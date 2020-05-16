import { Authorized, Body, Get, JsonController, Post } from 'routing-controllers';

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
}

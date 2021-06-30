'use strict';


const TibberFeed = require("tibber-api").TibberFeed;

var inherits = require('util').inherits;
var Service, Characteristic;

var FakeGatoHistoryService;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    FakeGatoHistoryService = require('fakegato-history')(homebridge);
    
    homebridge.registerAccessory('homebridge-tibber', 'tibber-power-consumption', TibberPowerConsumptionAccessory);
};

function TibberPowerConsumptionAccessory(log, config) {    
    this.log = log;
    this.name = config['name'];
    this.options = {
        active: true,
        apiEndpoint: {
            apiKey: config['apiKey'],
            feedUrl: config['feedUrl'],
            queryUrl: config['queryUrl'],
        },
        // Query configuration.
        homeId: config['homeId'],
        timestamp: true,
        power: true,
        accumulatedConsumption: true
    };

    this.powerConsumption = 0;
    this.totalPowerConsumption = 0;
  
    var EvePowerConsumption = function() {
        Characteristic.call(this, 'Consumption', 'E863F10D-079E-48FF-8F27-9C2605A29F52');
        this.setProps({
            format: Characteristic.Formats.UINT16,
            unit: 'watts',
            maxValue: 1000000000,
            minValue: 0,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };
    inherits(EvePowerConsumption, Characteristic);

    var EveTotalPowerConsumption = function() {
        Characteristic.call(this, 'Total Consumption', 'E863F10C-079E-48FF-8F27-9C2605A29F52');
        this.setProps({
            format: Characteristic.Formats.FLOAT, // Deviation from Eve Energy observed type
            unit: 'kilowatthours',
            maxValue: 1000000000,
            minValue: 0,
            minStep: 0.001,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };
    inherits(EveTotalPowerConsumption, Characteristic);

    this.loggingService = new FakeGatoHistoryService("energy", this, { storage: 'fs' });
	
    var PowerMeterService = function(displayName, subtype) {
        Service.call(this, displayName, '00000001-0000-1777-8000-775D67EC4377', subtype);
        this.addCharacteristic(EvePowerConsumption);
        this.addOptionalCharacteristic(EveTotalPowerConsumption);
    };
    inherits(PowerMeterService, Service);

    this.service = new PowerMeterService(this.name);
    this.service.getCharacteristic(EvePowerConsumption).on('get', this.getPowerConsumption.bind(this));
    this.service.addCharacteristic(EveTotalPowerConsumption).on('get', this.getTotalPowerConsumption.bind(this));
    
    var self = this;

    const tibberFeed = new TibberFeed(self.options);
    
    // Subscribe to "data" event.
    tibberFeed.on('data', data => {
        self.powerConsumption = parseFloat(data.power.toString());
        self.service.getCharacteristic(EvePowerConsumption).setValue(self.powerConsumption, undefined, undefined);
        self.loggingService.addEntry({time: Math.round(new Date().valueOf() / 1000), power: self.powerConsumption});

        self.totalPowerConsumption = parseFloat(data.accumulatedConsumption.toString());
        self.service.getCharacteristic(EveTotalPowerConsumption).setValue(self.totalPowerConsumption, undefined, undefined);

    });

    tibberFeed.on('connected', data => {
        self.log("Connected, " + data);
    });
    
    tibberFeed.on('disconnected', data => {
        self.log("Disconnected, " + data);
    });
    
    // Connect to Tibber data feed
    tibberFeed.connect();

    //tibberFeed.close();        
}

TibberPowerConsumptionAccessory.prototype.getPowerConsumption = function (callback) {
    callback(null, this.powerConsumption);
};

TibberPowerConsumptionAccessory.prototype.getTotalPowerConsumption = function (callback) {
    callback(null, this.totalPowerConsumption);
};

TibberPowerConsumptionAccessory.prototype.getServices = function () {
    const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'Neskvern')
        .setCharacteristic(Characteristic.Model, 'HomeBridge Tibber')
        .setCharacteristic(Characteristic.SerialNumber, '000')

    return [this.service, informationService, this.loggingService];
};

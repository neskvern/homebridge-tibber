# homebridge-tibber
This is a [Homebridge](https://github.com/nfarina/homebridge) plugin getting Tibber power consumption data into HomeKit

## Installation

### npm
```
(sudo) npm install homebridge-tibber
```

### Known Issues


### Example Configuration
```

{
    "accessory": "tibber-power-consumption",
    "name": "Tibber Power",
    "feedUrl": "wss://api.tibber.com/v1-beta/gql/subscriptions",
    "queryUrl": "https: //api.tibber.com/v1-beta/gql",
    "apiKey": "<insert your API key>",
    "homeId": "<insert yout homeId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

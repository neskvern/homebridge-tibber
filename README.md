# homebridge-tibber
This is a [Homebridge](https://github.com/nfarina/homebridge) plugin getting Tibber power consumption data into HomeKit

![Alt text](./tibber.png?raw=true "Tibber")

### Example Configuration
```

{
    "accessory": "tibber-power-consumption",
    "name": "Tibber Power",
    "feedUrl": "wss://api.tibber.com/v1-beta/gql/subscriptions",
    "queryUrl": "https: //api.tibber.com/v1-beta/gql",
    "apiKey": "<insert your API key>",
    "homeId": "<insert your homeId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
# Info
Uses special characteristics of the eve power outlet. Apples Home app does not show special characteristic, power consumption
will only be displayed in apps supporting this (Eve app, Home+ etc.).

# homebridge-tibber
This is a [Homebridge](https://github.com/nfarina/homebridge) plugin getting Tibber power consumption data (from Tibber Pulse) into HomeKit. Plugin reads data thru Tibber API.

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
This plugin uses special characteristics of the Eve power outlet / Eve Energy. Apples Home app does not show special characteristic so power consumption
will only be displayed in apps supporting this (Eve app, Home+ etc.).

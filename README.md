# ts-input-mask

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.png?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Description

`ts-input-mask` is a TypeScript library allowing to format user input on the fly. 

Based on [RadMadRobot's Input Mask Library](https://github.com/RedMadRobot/input-mask-android)

## Mask examples

1. International phone numbers: `+1 ([000]) [000] [00] [00]`
2. Local phone numbers: `([000]) [000]-[00]-[00]`
3. Names: `[A][-----------------------------------------------------]` 
4. Text: `[A…]`
5. Dates: `[00]{.}[00]{.}[9900]`
6. Serial numbers: `[AA]-[00000099]`
7. IPv4: `[099]{.}[099]{.}[099]{.}[099]`
8. Visa card numbers: `[0000] [0000] [0000] [0000]`
9. MM/YY: `[00]{/}[00]`


## Installation

```
npm install ts-input-mask --save
```

## Usage

#### 1. Import the listener

```
var MaskedTextChangedListener = require('ts-input-mask');

//es6
import { MaskedTextChangedListener } from 'ts-input-mask';
```

#### 2. Create instance of the listener

```
const listener: MaskedTextChangedListener = MaskedTextChangedListener.installOn(
    primaryFormat, \\ format of mask: +7 ([000]) [000]-[00]-[00]
    input, \\ pass HTMLInputElement here document.createElement("input") to attach the listener
    new class implements MaskedTextChangedListener.ValueListener {
        public onTextChanged( \\ method called when value changes
            maskFilled: boolean, \\ true when mask is filled
            extractedValue: string, \\ text without placeholder: 1234567890
            formattedText: string  \\ text with placeholder +7 (123) 456-78-90
        ): void {
            console.log(maskFilled, extractedValue, formattedText);
        }
    }(),
    affineFormats,
    customNotations,
    affinityCalculationStrategy,
    autocomplete
);
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


#### Testing

```
npm run test
```

#### Testing with coverage:

```
npm run test:coverage
```

## Authors

* [**German Arutyunov**](https://github.com/gaarutyunov)

## License

This project is licensed under the [MIT License](https://github.com/gaarutyunov/ts-input-mask/blob/master/LICENSE) 

## Acknowledgments

* RadMadRobot's Android [Input Mask Library](https://github.com/RedMadRobot/input-mask-android)
* RadMadRobot's iOS [Input Mask Library](https://github.com/RedMadRobot/input-mask-ios)

## See also

* [input-mask-angular](https://github.com/gaarutyunov/input-mask-angular) Simple implementation of this library as angular directive

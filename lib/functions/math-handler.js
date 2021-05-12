module.exports = {
    async dec(callback, {
        argumentsList
    }) {
        let callbackResponse = {}
        callbackResponse.type = 'reply'

        try {
            let str = argumentsList[0];
            let bin = 0;
            let r = 0;
            let bits = 1;
            while (str > 0) {
                //calculate modulus
                r = str % 2;
                str = Math.floor((str /= 2));
                //add to string
                bin += r * bits;
                bits *= 10;
            }
            let _response = bin.toString();
            callbackResponse.response = _response;

        } catch (err) {
            callbackResponse.response = RESPONSES.error.invalid;
        }
        callback(callbackResponse)
    },
    async bin(callback, {
        argumentsList
    }) {
        let callbackResponse = {}
        callbackResponse.type = 'reply'
        try {
            let str = argumentsList[0];
            let dec = 0;
            let bits = 1;
            let l = str.length - 1;
            let current, result;
            for (firstWordIndex = 0; firstWordIndex <= l; firstWordIndex++) {
                current = +str[l - firstWordIndex];
                result = bits;
                dec += result * current;
                bits *= 2;
            }
            let _response = dec.toString();
            callbackResponse.response = _response;
        } catch (err) {
            callbackResponse.response = RESPONSES.error.invalid;
        }
        callback(callbackResponse)
    },
    async equation(callback, {
        argumentsList
    }) {
        let _response;

        if (argumentsList != null && argumentsList.length == 3) {
            let b = parseFloat(argumentsList[1]);
            let a = parseFloat(argumentsList[0]);
            let c = parseFloat(argumentsList[2]);

            let delta = b * b - 4 * a * c;
            let divisor, x;
            console.log(delta);
            if (delta <= 0) {
                _response = "delta: " + delta;
            } else {
                divisor = 2 * a;
                x = (-b + Math.sqrt(delta)) / divisor;
                _response = "Root(+): " + x;
                x = (-b - Math.sqrt(delta)) / divisor;
                _response += "\nRoot(-): " + x;
            }
        } else {
            _response = "Insira B A C";
        }
        let callbackResponse = {
            type: 'reply',
            response: _response
        }
        callback(callbackResponse)
    },
}
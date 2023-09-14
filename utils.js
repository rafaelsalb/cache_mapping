var Utils =
{
    toBinary: function(number, digits)
    {
        let binary = number.toString(2);
        binary = binary.length != digits ? "0".repeat(digits - binary.length) + binary : binary;
        return binary;
    },

    clone: function(obj){
        if(obj == null || typeof (obj) != 'object')
        return obj;

        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = clone(obj[key]);

        return temp;
    }
}
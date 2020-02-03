/**
 * 
 */
'use strict';
angular.module('efrm.directive')
.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 5);
                number = value.slice(5);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 5) +  number.slice(5,7);
            }
            else{
                number = number;
            }

            return ( city + "-" + number).trim();
        }
        else{
            return city;
        }

    };
})
.filter('twoDecimal', function () {
    return function (decimalNumber) {
    	if(!decimalNumber){
    		return;
    	}
    	var num = decimalNumber.toString();
    	var numArr = num.split('.');
    	if(numArr.length == 1){
    		num  =  num + '.00';
    	}else{
    		if(numArr[1].length == 1){
    			num  =  num + '0';
    		}
    	}
    	return num;
    };
})
.filter('PST', ['Util', function (Util) {
    return function (lastLogin) {
    	if(lastLogin == 'N/A'){
    		return 'N/A';
    	}
    	else if(lastLogin == 'NA'){
    		return 'NA';
    	}
    	else{
    		return Util.moment.tz(lastLogin, 'America/Los_Angeles').format('MMMM DD, YYYY (h:mm A z)');
    	}
    };
}])
.filter('MMDDYYYY', ['Util', function (Util) {
    return function (lastLogin) {
    	if(lastLogin == 'NA'){
    		return 'NA';
    	}
    	else{
    		return Util.moment(lastLogin).format('MM/DD/YYYY');
    	}
    		
    };
}])
.filter('offset', function() {
    return function(input, start) {
    	return input.slice(start);
 	};
})
.filter('GMT', ['Util', function (Util) {
    return function (lastLogin) {
    	if(lastLogin == 'N/A'){
    		return 'N/A';
    	}
    	else if(lastLogin == 'NA'){
    		return 'NA';
    	}else if(lastLogin == ''){
    		return '';
    	}
    	else{
    		
    		if(typeof lastLogin != "string"){
    			
    			 
    			 return moment(lastLogin).format('DD-MM-YY (h:mm A )');
    			
    			
    		}else{
    			
    			return Util.moment.tz(lastLogin, '').format('DD-MM-YY (h:mm A )');
    		}
    		
    		
    	}
    };
}]).filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
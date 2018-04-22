function func_search_in_obj(nameKey, value, Obj) {
    for (var i = 0; i < Obj.length; i++) {
        if (Obj[i][nameKey] == value) {
            return Obj[i];
        }
    }
    return false;
}

/*var array = [
 { name:"string 1", value:"this", other: "that" },
 { name:"string 2", value:"this", other: "that" }
 ];
 _.findWhere(array, {name: 'string 1'})
 In ES6 you can use Array.prototype.find(predicate, thisArg?) like so:
 array.find(x => x.name === 'string 1')
 var resultObject = search("string 1", array);*/

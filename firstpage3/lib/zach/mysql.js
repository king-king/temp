(function(){

	var ZU = require("./util");
	var loopArray = ZU.loopArray;
	var loopObject = function loopObj( obj, block ) {
		for ( var key in obj ) {
			obj.hasOwnProperty( key ) && block( key, obj[key] );
		}
	};


	var DEBUG = false;
	function debug(d){
		DEBUG = d;
	}

	function listData(connection,table,pk,cb){
		var queryString = "SELECT * FROM `"+table+"`";
		DEBUG&&console.log(queryString);
		connection.query(queryString,function(error,result){
			if(error){
				cb&&cb(error);
			}
			else{
				var rst = [];
				loopArray(result,function(row){
					rst[row[pk]] = row;
				});
				cb&&cb(error,rst);
			}
		});
	}

	function insertData(connection,table,data,cb){
		var first = true;
		var columnString = "";
		var valueString = "";
		loopObject(data,function(k,v){
			if(first){
				first = false;
			}
			else{
				columnString += ", ";
				valueString += ", ";
			}
			columnString += "`"+k+"`";
			switch(typeof v){
				case "number":
					valueString += ""+v+"";
					break;
				case "string":
					valueString += "'"+v+"'";
					break;
				default:
					valueString += "NULL";
			}
		});
		var queryString = "INSERT INTO `"+table+"` ("+columnString+") VALUES ("+valueString+")";
		DEBUG&&console.log(queryString);
		connection.query(queryString,function(error,result){
			cb&&cb(error,result);
		});
	}

	function updateData(connection,table,pk,pkv,data,cb){
		var first = true;
		var kvString = "";
		loopObject(data,function(k,v){
			if(first){
				first = false;
			}
			else{
				kvString += ", ";
			}
			kvString += "`"+k+"`=";
			switch(typeof v){
				case "number":
					kvString += ""+v+"";
					break;
				case "string":
					kvString += "'"+v+"'";
					break;
				default:
					kvString += "NULL";
			}
		});
		var queryString = "UPDATE `"+table+"` SET "+kvString+" WHERE "+pk+"="+pkv;
		DEBUG&&console.log(queryString);
		connection.query(queryString,function(error,result){
			cb&&cb(error,result);
		});
	}

	function deleteData(connection,table,pk,pkv,cb){
		var queryString = "DELETE FROM `"+table+"` WHERE "+pk+"="+pkv;
		DEBUG&&console.log(queryString);
		connection.query(queryString,function(error,result){
			cb&&cb(error,result);
		});
	}

	exports.debug = debug;

	exports.listData = listData;
	exports.insertData = insertData;
	exports.updateData = updateData;
	exports.deleteData = deleteData;

})();
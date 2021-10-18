   
const path = require('path');
const log = require('intel').getLogger('sitespeedio.plugin.test_plugin');

module.exports = {
  name() {
    
    return path.basename(__dirname);
  },

  open(context, options) {
    this.make = context.messageMaker("test_plugin").make
    log.info(options.test_plugin.value)
    
  },
  processMessage(message, queue) {
   
   //log.info(message)
   
   var keys = message;
   //for (const [key, value] of Object.entries(obj)) {
   //  console.log(key);
   //}


   //var keys = {'key1':1,'key2':{'key3':2,'key4':3,'key5':{'key6':4}}};
   //var result = {};

   //function serialize(keys, parentKey){
   //    for(var key in keys){
   //        if(parseInt(keys[key], 10)){
   //            result[parentKey+key] = keys[key];
   //        }else{
   //            serialize(keys[key], parentKey+key+".");
   //        }
   //    }
   //}
   //serialize(keys, "");
   //console.log(result);


   //var myDict = {'key1':1,'key2':{'key3':2,'key4':3,'key5':{'key6':4}}};
   //console.log(keys)

   function getFieldAndSeriesName(key) {

         const functions = [

           'min',

           'p10',

           'median',

           'mean',

           'avg',

           'max',

           'p90',

           'p99',

           'mdev',

           'stddev'

         ];

         const keyArray = key.split('@');
         const end = keyArray.pop();
         if (functions.indexOf(end) > -1) {
             return { field: end, seriesName: keyArray.pop() };
   }
         return { field: 'value', seriesName: end };

       }




   function flattenDict(dictToFlatten) {
       function flatten(dict, parent) {
           var keys = [];
           var values = [];

           for(var key in dict) {
               if(typeof dict[key] === 'object') {
                   var result = flatten(dict[key], parent ? parent + '@' + key : key);
                   keys = keys.concat(result.keys);
                   values = values.concat(result.values);
               }
               else {
                   keys.push(parent ? parent + '@' + key : key);
                   values.push(dict[key]);
               }
           }

           return {
               keys : keys,
               values : values
           }
       }

       var result = flatten(dictToFlatten);
       var flatDict = {};

       for(var i = 0, end = result.keys.length; i < end; i++) {
           flatDict[result.keys[i]] = result.values[i];
       }

       return flatDict;
   }
   if(keys.type.endsWith('.summary')){
   var points = {}
   var data_to_DB = []
   var tags = {}
   tags['summaryType'] = 'summary'
   tags['timestamp'] = keys['timestamp']
   tags['source'] = keys['source']
   tags['group'] = keys['group']

   var obj = flattenDict(keys['data']);

   for(var key in obj){
   var body = getFieldAndSeriesName(key);
   //body['data'] = obj[key]
   var field = body['field']
   delete body['field']
   if(keys.type == 'pagexray.summary'){
   var vals = key.split('@')
   if(vals[0] == 'contentTypes'){
      body['contenttype'] = vals[1]
   }
    else{
        body['contenttype'] = '-'
    }

   if(vals[0] == 'firstParty'){
       body['party'] = 'firstParty'
   }

   else if(vals[0] == 'thirdParty'){
       body['party'] = 'thirdParty'
   }

   else{
       body['party'] = '-'
   }
   //console.log(key) 
   }    

   if(keys.type == 'coach.summary'){
      var vals = key.split('@') 
      body['advice'] = vals[0]
   }    



   var val = points
   for(var k in body){
       tags[k] = body[k]
       if(body[k] in val){
           val = val[body[k]]
           continue;
       }
       else{
           val[body[k]] = {}
           val = val[body[k]]
           continue;

       }

   }
   for(var k in tags){
   val[k] = tags[k]
   }
   val[field] = obj[key]
   data_to_DB.push(val)

   //if(body['seriesName'] in points){
   //points[body['seriesName']][body['field']] = body['data']
   //}
   //else{
   //points[body['seriesName']] = {"timestamp":timestamp,"source":source,"group":group}
   //}
   //console.log(body);
   }
   data_to_DB = [...new Set(data_to_DB)];
   log.info(data_to_DB)
   }
  
 },
  close(options, errors) {
    log.info(options.test_plugin.value)
    
  }
};

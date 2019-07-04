
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.beforeSave("Score", function(request, response) {
  if(request.object.get('score') % 2 == 0)
  {
    request.object.set("isEventNumber",true)
}else{
  request.object.set("isEventNumber",false)
}
response.success()
});

Parse.Cloud.define("getUser", function(request, response) {
 var query = Parse.Query('User')
 query.equalTo('objectId',request.params.user)
 .find()
 .then((result)=>{
     console.log("Result"+result.length)
     response.success(result[0].get('username'))
 }).catch(()=>{
   console.log("Score lookup failed")
 })
});

Parse.Cloud.job("resetScore", function(request, response) {
  var query = Parse.Query('Score')
  query.find({
    success: function(result){
      console.log("Succesfully retrieved "+result.length +" scores")
      query.each(function(object,error){
          object.destroy({
            success: function(object){
               console.log("Succesfully destroyed object")
               response.success()
            },
            error: function(error){
              console.log(error.message)
              response.error("Lookup object failed")
            },
            useMasterKey: true
          })
      })
    },
    error: function(error){
      console.log(error.message)
      console.log("Score lookup failed")
    }
    
  })
 });


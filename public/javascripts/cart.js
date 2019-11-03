//html body onload="Load()" tag
function Load(){
 
 $.ajax({
      url: "/api/products",
      method: "GET"
    }).done(function(msg) {
    
      console.log(msg);
      
      
    }).fail(function(data, status){
    alert(status);
    }); 
 
}



 
 //main
 $(document).ready(function(e) {
   console.log('Hello');
  

 }); // end ready
 
 
 
 



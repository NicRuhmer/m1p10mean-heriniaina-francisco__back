var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
function toastSuccess(message){
    toastr.success(''+message+ '', '<h5 class="text-white px-1 py-1"> Success  </h5>', 
    {positionClass: "position-absolute top-50 start-50 translate-middle-x",timeout: 4000,rtl: false});
}
function toastWarning(message){
    toastr.error(''+message+ '', '<h5 class="text-white px-2 py-2"><i class="feather fa fa-info-circle me-2"></i> Error  </h5>', 
    {positionClass: "position-absolute top-50 start-50 translate-middle-x",timeout: 5000,rtl: false});
}
function toastError(description){
    toastr.error(''+description+'', '<h5 class="text-white px-1 py-1"> Erreur </h5>', 
    {positionClass: "position-absolute top-50 start-50 translate-middle-x",timeout: 4000,rtl: false});
}


$(document).ready(function () {
    $('#submit_new_resp').attr('disabled', true);
});



$('#modif_diagnostique').click( function(){
    const diag_id = $(this).data("id");
    document.getElementById('message_update_error').innerHTML="";
    document.getElementById("message_update_success").innerHTML = "";
    $(this).attr('disabled',true);
    $(this).html("Modification en cour ...");
    const reponse_={
        title: $('#titled').val(),
        description: $('#descriptiond').val(),
        duration: $('#durationd').val(),
        qte: $('#qted').val(),
        montant: $('#montantd').val()
    };

  

    fetch('/modif/'+diag_id+'/reparation-diagnostique', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
      })
      .then(res => {
        if (res.ok) return res.json()
      })
        .then(response => {
            if(response.status==200){
                document.getElementById("message_update_success").innerHTML = response.message;
            }
            if(response.status==400){
                document.getElementById("message_update_error").innerHTML = response.message;
            }  
           $(this).attr('disabled',false); 
           $(this).html("Modifier");
        }).catch(err=>{
            document.getElementById("message_update_error").innerHTML = err.message;
            $(this).attr('disabled',false); 
            $(this).html("Modifier");
        });
          
});



$('#submit_diagnostique').click( function(){
    const diag_id = $(this).data("id");
    document.getElementById('message_error').innerHTML="";
    document.getElementById('message_success').innerHTML="";
    $(this).attr('disabled',true);
    $(this).html("Enregistrement en cour ...");
    const reponse_={
        title: $('#title').val(),
        description: $('#description').val(),
        duration: $('#duration').val(),
        qte: $('#qte').val(),
        montant: $('#montant').val()
    };

    fetch('/create/'+diag_id+'/reparation-diagnostique', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
      })
      .then(res => {
        if (res.ok) return res.json()
      })
        .then(response => {
            if(response.status==200){
                document.getElementById("message_success").innerHTML = response.message;
            }
            if(response.status==400){
                document.getElementById("message_error").innerHTML = response.message;
            }  
           $(this).attr('disabled',false); 
           $(this).html("Ajout");
        }).catch(err=>{
            document.getElementById("message_error").innerHTML = err.message;
            $(this).attr('disabled',false); 
            $(this).html("Ajout");
        });
          
});


function supp_diagnostique(diag_id){
    const reponse_={};
    $(".delete_diagnostique").attr('disabled',true); 
    fetch('/delete/'+diag_id+'/reparation-diagnostique', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
      })
      .then(res => {
        if (res.ok) return res.json()
      })
        .then(response => {
            if(response.status==200){
                alert(response.message);
                // toastSuccess(response.message);
            }
            if(response.status==400){
                alert(response.message);
                // toastError(response.message);
            }  
           $(".delete_diagnostique").attr('disabled',false); 
        }).catch(err=>{
            alert(err.message);
              // toastError(err.message);
            $(".delete_diagnostique").attr('disabled',false); 
        });
}



$('#start_reparation').click( function(){
    const reparation_id = $(this).data("id");
  
    // $(this).attr('disabled',true);
    $(this).html("Chargement du projet  en cours ...");
    const reponse_={};

 fetch('/start-reparation/'+reparation_id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
      })
      .then(res => {
        if (res.ok) return res.json()
      })
        .then(response => {
           
           $(this).attr('disabled',false); 
           $(this).html("Lancez le projet");

        window.location.protocol + "//" + window.location.host + "/reparation-en-cours/"+reparation_id;
        }).catch(err=>{
            alert(err.message);
            $(this).attr('disabled',false); 
            $(this).html("Lancez le projet");
        });
          
});
 
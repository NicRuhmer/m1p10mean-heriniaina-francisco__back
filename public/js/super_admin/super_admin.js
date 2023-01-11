var HOST = "http://localhost:3000";
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
    $('#submit_spa').attr('disabled', true);
});


$('#form-new-spa').keyup(function () {

    if ($('#name').val().length > 1 &&
        $('#email').val().length > 5 &&
        $('#new_password').val().length > 2 &&
        $('#confirm_password').val().length > 2 &&
        $('#new_password').val() == $('#confirm_password').val()
    ) {
        $('#submit_spa').attr('disabled', false);
    } else {
       
        $('#submit_spa').attr('disabled', true);
    }
});


$('#email').keyup( function(){
    if($(this).val().length>5){
        if($(this).val().match(validRegex)){
            document.getElementById('email_error').innerHTML="";
            $.ajax({
                url:HOST+"/verify-mail-user",
                method:"POST",
                data:{mail: $(this).val()},
                dataType : "JSON",
                success:function(data)
                {
                    if(data.data!=null){
                        document.getElementById('email_error').innerHTML="le mail de l'utilisateur a été déjà utilisé";
                        $('#submit_spa').attr('disabled',true);
                    } else {
                        document.getElementById('email_error').innerHTML="";
                    }       
                }
            }); 
        } else{
            document.getElementById('email_error').innerHTML="le mail est invalide";
            $('#submit_spa').attr('disabled',true);
        }
    } else {
        document.getElementById('email_error').innerHTML="le mail est invalide";
        $('#submit_spa').attr('disabled',true);
    }
});


$('#submit_spa').click( function(){
    document.getElementById('message_error').innerHTML=="";
    $(this).attr('disabled',true);
    $(this).html("Enregistrement en cour ...");
    const reponse_={
        nicname: $('#name').val(),
        username: $('#email').val(),
        new_password: $('#new_password').val(),
        confirm_password: $('#confirm_password').val()
    };

    if(document.getElementById('email_error').innerHTML==="" &&
        document.getElementById('message_error').innerHTML===""){
                $(this).attr('disabled',false);
                $(this).html("Enregistré");
            
                fetch('/new-first-spa', {
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
                    }).catch(err=>{
                        document.getElementById("message_error").innerHTML = err.message;
                    });
            } else {
                document.getElementById("message_error").innerHTML = 'les données sont invalides';
                
            } 
});

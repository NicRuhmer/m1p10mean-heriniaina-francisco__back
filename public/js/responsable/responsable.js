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

$('#form-new-resp').keyup(function () {

    if ($('#name').val().length > 1 &&
        $('#email').val().length > 5 &&
        $('#contact').val().length > 2 &&
        $('#adresse').val().length > 2 &&
        $('#salaire').val() > 0 &&
        $('#password').val().length>3
    ) {
        $('#submit_new_resp').attr('disabled', false);
    } else {
       
        $('#submit_new_resp').attr('disabled', true);
    }
});


$('#email').keyup( function(){
    if($(this).val().length>5){
        if($(this).val().match(validRegex)){
            document.getElementById('email_error').innerHTML="";
            fetch('/verify-mail-user', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({mail:$(this).val()})
              })
              .then(res => {
                if (res.ok) return res.json()
              })
                .then(response => {
                    if(response.data!=null){
                        document.getElementById('email_error').innerHTML="le email de l'utilisateur a été déjà utilisé";
                        $('#submit_new_resp').attr('disabled',true);
                    }
                    else{
                        document.getElementById('email_error').innerHTML="";
                  }   
                }).catch(err=>{
                    document.getElementById("email_error").innerHTML = err.message;
                });

            /*$.ajax({
                url:HOST+"/verify-mail-user",
                method:"POST",
                data:{mail: $(this).val()},
                dataType : "JSON",
                success:function(data)
                {
                    if(data.data!=null){
                        document.getElementById('email_error').innerHTML="le email de l'utilisateur a été déjà utilisé";
                        $('#submit_new_resp').attr('disabled',true);
                    } else {
                        document.getElementById('email_error').innerHTML="";
                    }       
                }
            }); */
        } else{
            document.getElementById('email_error').innerHTML="le email est invalide";
            $('#submit_new_resp').attr('disabled',true);
        }
    } else {
        document.getElementById('email_error').innerHTML="le email est invalide";
        $('#submit_new_resp').attr('disabled',true);
    }
});


$('#contact').keyup( function(){
    if($(this).val().length>2){
         document.getElementById('contact_error').innerHTML="";
    } else {
         document.getElementById('contact_error').innerHTML="contact est invalide !";
         $('#submit_new_resp').attr('disabled',true);
    }
});

$('#adresse').keyup( function(){
    if($(this).val().length>2){
         document.getElementById('adresse_error').innerHTML="";
       
         if(document.getElementById('email_error').innerHTML==="" &&
         document.getElementById('contact_error').innerHTML==="" &&
         document.getElementById('password_error').innerHTML==="" &&
         document.getElementById('salaire_error').innerHTML===""){
         $('#submit_new_resp').attr('disabled',false);
     } else {
         $('#submit_new_resp').attr('disabled',true);
     }
    } else {
         document.getElementById('adresse_error').innerHTML="adresse est invalide !";
         $('#submit_new_resp').attr('disabled',true);
    }
});

$('#salaire').keyup( function(){
    if($(this).val()>0){
         document.getElementById('salaire_error').innerHTML="";
       
         if(document.getElementById('email_error').innerHTML==="" &&
         document.getElementById('contact_error').innerHTML==="" &&
         document.getElementById('adresse_error').innerHTML==="" &&
         document.getElementById('password_error').innerHTML===""){
         $('#submit_new_resp').attr('disabled',false);
     } else {
         $('#submit_new_resp').attr('disabled',true);
     }
    } else {
         document.getElementById('salaire_error').innerHTML="salaire est invalide !";
         $('#submit_new_resp').attr('disabled',true);
    }
});

$('#password').keyup( function(){
    if($(this).val().length>3){
         document.getElementById('password_error').innerHTML="";
         if(document.getElementById('email_error').innerHTML==="" &&
            document.getElementById('contact_error').innerHTML==="" &&
            document.getElementById('adresse_error').innerHTML==="" &&
            document.getElementById('salaire_error').innerHTML===""){
            $('#submit_new_resp').attr('disabled',false);
        } else {
            $('#submit_new_resp').attr('disabled',true);
        }
        
    } else {
         document.getElementById('password_error').innerHTML="mot de passe est invalide !";
         $('#submit_new_resp').attr('disabled',true);
    }
});


$('#submit_new_resp').click( function(){
    document.getElementById('message_error').innerHTML=="";
    $(this).attr('disabled',true);
    $(this).html("Enregistrement en cour ...");
    const reponse_={
        nicname: $('#name').val(),
        username: $('#email').val(),
        contact: $('#contact').val(),
        adresse: $('#adresse').val(),
        salaire: $('#salaire').val(),
        password: $('#password').val(),
        role:$('#role').val()
    };

    if(document.getElementById('email_error').innerHTML==="" &&
        document.getElementById('contact_error').innerHTML==="" &&
        document.getElementById('adresse_error').innerHTML==="" &&
        document.getElementById('salaire_error').innerHTML==="" &&
        document.getElementById('password_error').innerHTML===""){
                $(this).attr('disabled',false);
                $(this).html("Enregistré");
            
                fetch('/resp.create', {
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


function start(e){
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text",e.target.getAttribute("id"));
}

function over(e){
    // e.preventDefault();
    return false;
}


function drop(e){
    const ob = e.dataTransfer.getData("text");
    e.currentTarget.appendChild(document.getElementById(ob));
}
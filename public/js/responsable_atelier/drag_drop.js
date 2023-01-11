
var position=0;
function mouseBtnInvalid(){
    const note = document.getElementById('note_appel').value;
    if((note ==="" || note==null) && position==0){
        btnmoveright();
     
        position=1;
        return false;
    }

    else if((note ==="" || note==null) && position==1){
        btnmoveleft();
        position=2;
        return false;
    }

   else if((note ==="" || note==null) && position==2){
        resetbtnsubmitnote();
        position=1;
        return false;
    } 
    else {
        document.getElementById('submit_note').style.cursor='pointer';
        return false;
    }

}

function btnmoveleft(){
    const btn = document.getElementById('submit_note');
    btn.style.transform = 'translatex(251%)';
}
function btnmoveright(){
    const btn = document.getElementById('submit_note');
    btn.style.transform = 'translatex(0%)';
}

function resetbtnsubmitnote(){
    const btn = document.getElementById('submit_note');
    btn.style.transform = 'translatex(0%)';
}

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


function show_detail_cadence(cadence){
/*
    document.getElementById('disposition').innerHTML = cadence.disposition.description;
    document.getElementById('sentiment').innerHTML = cadence.sentiment.description;
*/
document.getElementById('disposition').innerHTML = cadence.disposition.description;
document.getElementById('sentiment').innerHTML = cadence.sentiment.description;

    document.getElementById('debut_appel').innerHTML = cadence.start_time;
    document.getElementById('fin_appel').innerHTML = cadence.end_time;
   /* document.getElementById('direction_appel').innerHTML = cadence.desc_direction;
    document.getElementById('status_appel').innerHTML = cadence.desc_status;*/
    document.getElementById('debut_appel').innerHTML = cadence.start_time;
    document.getElementById('note_appel').value = cadence.note;
    document.getElementById('token_appel').setAttribute('value',cadence._id);
    document.getElementById('phone_appel').innerHTML = cadence.phone_number_contact;
   
    if(cadence.note){
        $('#submit_note').html('Modifié');
    } else {
        $('#submit_note').html('Enregistré');
    }
    
}


$('#submit_note').on('click',function(){
    const id =  $('#token_appel').val();
    const note_ = $('#note_appel').val();
    const url_=`http://localhost:8080/edit-note-history/${id}`;
    
    $.ajax({
        url:url_,
        data:{note:note_},
        dataType : "JSON",
        method:"PUT",
       success:function(data)
        {
            if(data){
                if(data.status ==200){
                    toastSuccess(data.message);
                    setTimeout(() => {
                        document.location.reload();
                      }, 5000);
                } else {
                    toastError(data.message);
              
                }
            }
        },error: function(err){
            console.log(err);
            toastError(err.message);         
        }
    }); 

   
});



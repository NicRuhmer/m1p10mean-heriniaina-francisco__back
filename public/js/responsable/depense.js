function toastSuccess(message) {
    toastr.success('' + message + '', '<h5 class="text-white px-1 py-1"> Success  </h5>',
        { positionClass: "position-absolute top-50 start-50 translate-middle-x", timeout: 4000, rtl: false });
}
function toastWarning(message) {
    toastr.error('' + message + '', '<h5 class="text-white px-2 py-2"><i class="feather fa fa-info-circle me-2"></i> Error  </h5>',
        { positionClass: "position-absolute top-50 start-50 translate-middle-x", timeout: 5000, rtl: false });
}
function toastError(description) {
    toastr.error('' + description + '', '<h5 class="text-white px-1 py-1"> Erreur </h5>',
        { positionClass: "position-absolute top-50 start-50 translate-middle-x", timeout: 4000, rtl: false });
}



function save_new_depense() {

    $('#loading_page').css("display", "block");
    
    $('#save_new_depense').attr('disabled', true);
    $('#save_new_depense').html("Enregistrement en cours ...");
    const reponse_ = {
        description: $('#description').val()
    };

    fetch('/depense.create', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
          
            if (response.status == 200) {
                document.location.reload();
            }
            if (response.status == 400) {
                toastError(response.message);
            }
            $('#save_new_depense').attr('disabled', false);
            $('#save_new_depense').html("Enregistrer");
        }).catch(err => {
            $('#save_new_depense').attr('disabled', false);
            toastError(err.message);
            $('#save_new_depense').html("Enregistrer");
        });

}


function edit_depense(depense_id) {
   
    $('#loading_page').css("display", "block");
    // const diag_id = $(this).data("id");
    const reponse_ = {
        description: $('#description'+depense_id).val()
    };
    fetch('/depense.update/' + depense_id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
         
            if (response.status == 200) {
                document.location.reload();
            }
            if (response.status == 400) {
                toastError(response.message);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}

function delete_depense(depense_id) {
   
    $('#loading_page').css("display", "block");
    // const diag_id = $(this).data("id");
  
    fetch('/depense.delete/' + depense_id, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
         
            if (response.status == 200) {
                document.location.reload();
            }
            if (response.status == 400) {
                toastError(response.message);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}



function save_new_other_depense() {

    $('#loading_page').css("display", "block");
    
    $('#save_new_other_depense').attr('disabled', true);
    $('#save_new_other_depense').html("Enregistrement en cours ...");
    const reponse_ = {
        depense: $('#depense').val(),
        description:$('#description').val(),
        date:$('#date').val(),
        categorie:$('#categorie').val(),
        totale:$('#totale').val()
    };

    fetch('/other-depense.create', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
          
            if (response.status == 200) {
                document.location.reload();
             }
            if (response.status == 400) {
                toastError(response.message);
            }
            $('#save_new_other_depense').attr('disabled', false);
            $('#save_new_other_depense').html("Enregistrer");
        }).catch(err => {
            $('#save_new_other_depense').attr('disabled', false);
            toastError(err.message);
            $('#save_new_other_depense').html("Enregistrer");
        });

}


function edit_other_depense(other_depense_id) {
   
    $('#loading_page').css("display", "block");
    // const diag_id = $(this).data("id");
    const reponse_ = {
        depense: $('#depense'+other_depense_id+"").val(),
        description:$('#description'+other_depense_id).val(),
        date:$('#date'+other_depense_id).val(),
        categorie:$('#categorie'+other_depense_id+"").val(),
        totale:$('#totale'+other_depense_id).val()
    };
    fetch('/other-depense.update/' + other_depense_id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
         
            if (response.status == 200) {
                document.location.reload();
            }
            if (response.status == 400) {
                toastError(response.message);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}

function delete_other_depense(other_depense_id) {
   
    $('#loading_page').css("display", "block");
    // const diag_id = $(this).data("id");
   
    fetch('/other-depense.delete/' + other_depense_id, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
         
            if (response.status == 200) {
                document.location.reload();
            }
            if (response.status == 400) {
                toastError(response.message);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}


function show_data_stat(statistiques){
   
    var html="";
    for(var ids=0;ids<statistiques.length;ids++){
        html+='<div class="d-flex justify-content-between mb-3">';
        html+=    '<h6>'+statistiques[ids]._id.depense[0].description+'</h6>';
        html+=    '<h5>'+statistiques[ids].totale+'Ar</h5>';
        html+='</div>';
    }

    $('#list_depense_data').empty();
    $('#list_depense_data').append(html);
}

function filtre_list_depense_stat(){
  
    $('#loading_page').css("display", "block");
    fetch('/statistiqueFilter', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({date:$('#date_filter').val(),categorie:$('#categorie_filter').val()})
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
       
            if (response.status == 400) {
                toastError(response.message);
            } else {
                document.getElementById("stat_chiffre_affaire").innerHTML=response.chiff_affaire.chiffre_daffaire+"Ar";
                document.getElementById("stat_benefice").innerHTML=response.benefice+"Ar";
             
                show_data_stat(response.depense);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}
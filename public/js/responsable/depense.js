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



function close_modal(){
    $('#show_modal_depense').empty();
}
function close_modal_other(){
    $('#show_modal_other_depense').empty();
}

function show_modal_depense(detail_id){
    // const detail = JOSN.parse(detail_);
    var html="";

    
    fetch('/depense.get/'+detail_id, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(detail => {
            $('#loading_page').css("display", "none");
        
            if (detail.status == 400) {
                toastError(detail.message);
            } else {
                html+=' <div id="show_modal_depense'+detail._id+'" class="modal fade show " data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="display: block;">';
                html+='<div class="modal-dialog">  <div class="modal-content">   <div class="modal-header">';
                html+='<h5 class="modal-title" id="exampleModalLabel">Modification</h5>';
                html+='<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="close_modal()"></button>';
                html+='</div><div class="modal-body"><div class="mb-3">';
                html+='<label for="exampleFormControlInput1"   class="form-label">Description <span class="text-danger">*</span></label>';
                html+='<input type="text" class="form-control" value="'+detail.description+'" id="description'+detail._id+'" name="description'+detail._id+'" />';
                html+='</div></div>';
                html+='<div class="modal-footer d-flex justify-content-between">';
                html+='<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="close_modal()">Annuler</button>';
                var edit_depense= `edit_depense('${detail._id}')`;
                html+='<button type="button" class="btn btn-primary" onclick="'+edit_depense+'"   data-bs-dismiss="modal">Modifier</button>';
                html+= '</div></div></div></div>';
                $('#show_modal_depense').empty();
    $('#show_modal_depense').append(html);
            }
   
    
        }).catch(err => {
            toastError(err.message);
        });

}

function show_modal_other_depense(detail_id){
    var html="";
 
    fetch('/other-depense.get/'+detail_id, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
            if (response.status == 400) {
                toastError(response.message);
            } else {
                html+='<div  id="show_modal_other_depense'+detail_id+'" class="modal fade show " data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="display: block;">';
                html+=      '<div class="modal-dialog">';
                html+=      ' <div class="modal-content">';
                html+=     '  <div class="modal-header">';
                html+=    '   <h5 class="modal-title" id="exampleModalLabel">Modification</h5> ';
                html+=     '<button type="button" class="btn-close" data-bs-dismiss="modal" onclick="close_modal_other()" aria-label="Close"></button>';
                html+=      '</div>';
                html+=    '<div class="modal-body">';
                html+=      '<div class=" shadow p-3 mb-5 bg-body rounded" >';
                html+=    '<div class="mb-3 d-flex">';
                html+=      '<label for="exampleFormControlInput1" class="form-label">Date<span class="text-danger">*</span></label>';
                html+=        '<input id="date'+response.data._id+'" value="'+moment(response.data.thedate).format("YYYY-MM-DD")+'" name="date'+response.data._id+'" type="date" class="form-control" />';
                html+=    ' </div>';
                                    
                html+=     '<div class="mb-3">';
                html+=   '<label for="exampleFormControlInput1" class="form-label">Type de dépense...<span class="text-danger">*</span></label>';
                html+=     '<select class="form-select" id="depense'+response.data._id+'" name="depense'+response.data._id+'" aria-label="Default select example">';
                    for(var id=0;id<response.depenses.length;id++){
                        if(""+response.depenses[id]._id==""+response.data.depense._id){
                html+=   '<option value="'+response.depenses[id]._id+'" selected>'+response.depenses[id].description+'</option>';
                        } else {
                html+=  '<option value="'+response.depenses[id]._id+'">'+response.depenses[id].description+'</option>';
                        }
                    }
                html+=    '</select>';
                html+='</div>';
                html+=    '<div class="mb-3">';
                html+=    '<label for="exampleFormControlInput1" class="form-label">Dépense étant que...<span class="text-danger">*</span></label>';
                html+=   '<select class="form-select" id="categorie'+response.data._id+'" name="categorie'+response.data._id+'">';
                    if(response.data.categorie=="DAY"){
                html+=       '<option value="YEAR">Année</option>';
                html+=           '<option value="MONTH">Mensuelle</option>';
                html+=         '<option value="DAY" selected>Journalier</option>';
                        
                    }
                    if(response.data.categorie=="MONTH"){
                html+=    '<option value="DAY">Journalier</option>';
                html+=     '<option value="MONTH" selected>Mensuelle</option>';
                html+=      '<option value="YEAR">Année</option>';
                    }
                    if(response.data.categorie=="YEAR"){
                        html+=     '<option value="YEAR" selected>Année</option>';
                        html+=      '<option value="MONTH">Mensuelle</option>';
                        html+=       '<option value="DAY">Journalier</option>';
                    }
                        
                html+=   '</select>';
                html+=   '</div>';
                html+=   '<div class="mb-3">';
                html+=       '<label for="exampleFormControlInput1"  class="form-label">Description</label>';
                html+=            '<textarea class="form-control" id="description'+response.data._id+'" rows="3">'+response.data.description+'</textarea>';
                html+=       '</div>';
                html+=       '<div class="mb-3">';
                html+=          '<label for="exampleFormControlInput1" class="form-label">Totale TTC (Ar) <span  class="text-danger">*</span></label>';
                html+=           '<input type="number" class="form-control"  id="totale'+response.data._id+'" value="'+response.data.totale+'" min="1" name="totale'+response.data._id+'" required placeholder="Totale TTC (Ar) ">';
                html+=               '<span class="text-danger" id="totale_error"></span>';
                html+=          '</div>';
                html+=     '</div>';
                html+=     '<div class="modal-footer d-flex justify-content-between">';
                html+=        '<button type="button" class="btn btn-secondary"  onclick="close_modal_other()" data-bs-dismiss="modal">Annuler</button>';
                var edit_other_depense = `edit_other_depense('${response.data._id}')`;
                html+=         '<button type="button" class="btn btn-primary" onclick="'+edit_other_depense+'" data-bs-dismiss="modal">Modifier</button>';
                html+=      '</div> </div> </div> </div>';
            
                $('#show_modal_other_depense').empty();
                $('#show_modal_other_depense').append(html);
            }
           
   
        }).catch(err => {
            toastError(err.message);
        });

    

}

function show_list_data_oher_depense(list_depenses){
    var html="";

    for(var id=0;id<list_depenses.length;id++){
        html+='<tr>';
        html+=    '<td>'+moment(list_depenses[id].thedate).format('DD MMMM YYYY')+'</td>';
        html+=    '<td>'+list_depenses[id].depense.description+'</td>';
        html+=    '<td>'+list_depenses[id].description+'</td>';
        html+=    '<td>'+list_depenses[id].totale+'Ar</td>';
        html+=    '<td>';
        html+=        '<div class="btn-group">';
        html+=            '<button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">';
        html+=               'Plus';
        html+=          '</button>';
        html+=            '<ul class="dropdown-menu">';
                        var show_modal_other_depense = `show_modal_other_depense('${list_depenses[id]._id}')`;
                        html+=                 '<li><a class="dropdown-item" href="#"  onclick="'+show_modal_other_depense+'">Modifier</a></li>';
                        var delete_other_depense =`delete_other_depense('${list_depenses[id]._id}')`;
                        html+=                 '<li><a class="dropdown-item" href="#" onclick="'+delete_other_depense+'">Supprimer';
                        html+=                 '</a></li>';             
        html+=                '</ul>';
        html+=         '</div>';
        html+=    '</td>';
        html+='</tr>';
    }

    $('#show_list_data_other_depense').empty();
    $('#show_list_data_other_depense').append(html);
}


function show_list_data_depense(depenses){
    var html="";

  
    for(var id=0;id<depenses.length;id++){
        html+='<tr>';
        html+=    '<td>'+depenses[id].description+'</td>';
        html+=    '<td>';
        html+=        '<div class="btn-group">';
        html+=            '<button type="button" class="btn btn-success dropdown-toggle"';
        html+=                'data-bs-toggle="dropdown"';
        html+=                'aria-expanded="false">';
        html+=                'Plus';
        html+=            '</button>'
        html+=            '<ul class="dropdown-menu">';
                    var modal = `show_modal_depense('${depenses[id]._id}')`;
        html+=                 '<li><a class="dropdown-item" href="#" onclick="'+modal+'">Modifier</a></li>';
                         var supp = `delete_depense('${depenses[id]._id}')`;
        html+=                '<li><a class="dropdown-item" href="#" onclick="'+supp+'">Supprimer';
        html+=                 '</a></li>';

        html+=               '</ul>';
        html+=        '</div>';
        html+=    '</td>';
        html+='</tr>';
    }

    $('#show_list_data_depense').empty();
    $('#show_list_data_depense').append(html);
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
                show_list_data_depense(response.data);
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
                show_list_data_depense(response.data);
              //  document.location.reload();
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
                show_list_data_depense(response.data);
            //    document.location.reload();
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
                show_list_data_oher_depense(response.data,response.depenses);
                // document.location.reload();
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
                show_list_data_oher_depense(response.data,response.depenses);
                // document.location.reload();
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
                show_list_data_oher_depense(response.data,response.depenses);
                // document.location.reload();
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
                if(response.chiff_affaire.moyen_temps_reparation==null){
                    document.getElementById("stat_moyen_temps_reparation").innerHTML="0 heure environ";
                
                } else {
                    document.getElementById("stat_moyen_temps_reparation").innerHTML=response.chiff_affaire.moyen_temps_reparation+"heure environ";
                
                }
                show_data_stat(response.depense);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}
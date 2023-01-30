var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
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


$(document).ready(function () {
    $('#submit_new_resp').attr('disabled', true);
});




function modif_diagnostique(diag_id) {
    $('#loading_page').css("display", "block");

    document.getElementById('message_update_error').innerHTML = "";
    document.getElementById("message_update_success").innerHTML = "";
    $(this).attr('disabled', true);
    $(this).html("Modification en cour ...");
    const reponse_ = {
        title: $('#titled').val(),
        description: $('#descriptiond').val(),
        duration: $('#durationd').val(),
        qte: $('#qted').val(),
        montant: $('#montantd').val(),
        unite: $('#united').val()
    };


    $('#show_modal_diagnostique').empty();
    
    fetch('/modif/' + diag_id + '/reparation-diagnostique', {
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
             list_diagnostique(response.data);
                // document.location.reload();
                //      document.getElementById("message_update_success").innerHTML = response.message;
            }
            else{
                toastError(response.message);
            }
            $(this).attr('disabled', false);
            $(this).html("Modifier");
        }).catch(err => {
            toastError(err.message);
            $(this).attr('disabled', false);
            $(this).html("Modifier");
        });

}


function list_diagnostique(listes) {
    var html = '';
    for (var id = 0; id < listes.length; id++) {

        html += '<tr>';
        html += '<td>';
        html += '<div>';
        html += '<p>' + listes[id].title + ' < br > ';
        html += '+listes[id].description+</p>';
        html += '</div>';

        html += '</td>';
        html += '<td>';
        html += '<p>durée: ' + listes[id].duration + ' heure<br>'
        html += 'quantité pièce: ' + listes[id].qte + '</p>';
        html += '</td>';
        html += '<td>' + listes[id].pu + 'Ar</td>';
        html += '<td>';
        var tmp = `modification_diagnostique('${listes[id]._id}')`;
        var tmp2 = `supression_diagnostique('${listes[id]._id}')`;

        html += '<div class="d-flex justify-content-between">';
        html += '<button type="button" class="btn';
        html += 'btn-success" data-bs-toggle="modal" onclick="' + tmp + '">Modifier</button>';
        html += '<button type="button" onclick="' + tmp2 + '" id="delete_diagnostique" class="btn';
        html += 'btn-warning delete_diagnostique">Rétirer</button>';
        html += '</div>';
        html += '</td>';
        html += '</tr>';
    }
    $('#list_data_diagnostique').empty();
    $('#list_data_diagnostique').append(html);
}

function valid_release_date(id) {
    const reponse_ = {
        release_date: $('#release_date').val()
    };


    $('#loading_page').css("display", "block");
    // if (release_date.release_date!=null) {
    fetch('/valide/' + id + '/sortit-vehicule', {
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
            } else {
                toastError(response.message);
            }

        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
    // } else {
    //     toastError("champs invalide !");
    // }
}


function close_diagnostique(){
    $('#show_modal_diagnostique').empty();
}

function show_modal_diagnostique_form(detail_id) {
    // const detail = JOSN.parse(detail_);
    var html = "";

fetch('/diagnostique/get/' + detail_id, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(detail => {
   
            html += '<div class="modal fade show " data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="display: block;">';
            html += '<div class="modal-dialog"> <div class="modal-content"> <div class="modal-header">';
                html += ' <h5 class="modal-title" id="staticBackdropLabel">Modification de "'+detail.title+'" </h5>';
                html += '   <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="close_diagnostique()" aria-label="Close"></button>';
                html += '</div>  <div class="modal-body">  <div class="mb-3 mt-3">';

                html += '<label for="exampleFormControlInput1"   class="form-label">Tâches</label>';
                html += '<input type="text" class="form-control" id="titled"  name="titled" required value="'+detail.title+'"   placeholder="Tâches">';
                html += '</div> <div class="mb-3">   <label for="exampleFormControlInput1" class="form-label">Description </label>';
                html += '<textarea class="form-control" placeholder="Description"  id="descriptiond" name="descriptiond" rows="3">'+detail.description+'</textarea>';
                html += '</div>  <div class="mb-3"><label for="exampleFormControlInput1"  class="form-label">Estimation du duration(heure) </label>';
                html += '<input type="number" class="form-control" id="durationd"   name="durationd" min="0" required   value="'+detail.duration+'"  placeholder="En heure">';
                html += '</div>  <div class="mb-3"> <label for="exampleFormControlInput1"  class="form-label">Quantité </label>';
                html += '<input type="number" class="form-control" id="qted" name="qted"   min="0" required value="'+detail.qte+'"  placeholder="Quantité">';
                html += '</div> <div class="mb-3"> <label for="exampleFormControlInput1" class="form-label">Unité </label>';
                html += '<input type="text" class="form-control" id="united"  name="united" min="0" required  value="'+detail.unite+'" placeholder="Unité">';
                html += '</div>  <div class="mb-3"> <label for="exampleFormControlInput1"   class="form-label">Estimation du prix   </label>';
                html += '<input type="number" class="form-control" id="montantd"  name="montantd" required value="'+detail.pu+'" placeholder="En Ar">';
                html += ' </div>  </div>   <div class="modal-footer d-flex justify-content-between">';
                html += '<button type="button" class="btn btn-secondary" onclick="close_diagnostique()" >Close</button>';

                var modif = `modif_diagnostique('${detail._id}')`;

                html += '<button type="button" onclick="'+modif+'" class="btn btn-primary">Modifier</button></div> </div> </div>';

                $('#show_modal_diagnostique').empty();
                $('#show_modal_diagnostique').append(html);

        }).catch(err => {
            toastError(err.message);
        });

}

function list_diagnostique(diagnostiques) {
    var html = "";
    for (var id = 0; id < diagnostiques.length; id++) {

        html += '<tr><td><div><p>';
        html += '        <span class="">' + diagnostiques[id].title + '</span> <br>  ' + diagnostiques[id].description;
        html += '</p>  </div> </td>';
        html += '  <td>';
        html += '<p>durée:' + diagnostiques[id].duration + ' heure<br>  quantité pièce: ' + diagnostiques[id].qte;
        html += '</p> </td> <td>' + diagnostiques[id].pu + 'Ar</td>';
        html += '<td> <div class="d-flex  justify-content-between">';
        var tmp = `show_modal_diagnostique_form('${diagnostiques[id]._id}')`;
        var sup = `supp_diagnostique('${diagnostiques[id]._id}')`;
        html += '<button type="button" class="btn    btn-success" onclick="' + tmp + '">Modifier</button>';
        html += '<button type="button"  onclick="' + sup + '"  class="btn btn-warning delete_diagnostique">Rétirer</button>';
        html +='</div>   </td>  </tr>';
    }
    $('#list_data_diagnostique').empty();
    $('#list_data_diagnostique').append(html);
}


$('#submit_diagnostique').click(function () {
    $('#loading_page').css("display", "block");

    const diag_id = $(this).data("id");
    document.getElementById('message_error').innerHTML = "";
    document.getElementById('message_success').innerHTML = "";
    $(this).attr('disabled', true);
    $(this).html("Enregistrement en cour ...");
    const reponse_ = {
        title: $('#title').val(),
        description: $('#description').val(),
        duration: $('#duration').val(),
        qte: $('#qte').val(),
        montant: $('#montant').val(),
        unite: $('#unite').val()
    };

    fetch('/create/' + diag_id + '/reparation-diagnostique', {
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
                list_diagnostique(response.data);
            }
            else{
                toastError(response.message);
            }
          
            $(this).attr('disabled', false);
            $(this).html("Ajout");
        }).catch(err => {
            $('#loading_page').css("display", "none");
            document.getElementById("message_error").innerHTML = err.message;
            $(this).attr('disabled', false);
            $(this).html("Ajout");
        });

});

/*
$('#submit_diagnostique').click(function () {
    $('#loading_page').css("display", "block");

    const diag_id = $(this).data("id");
    document.getElementById('message_error').innerHTML = "";
    document.getElementById('message_success').innerHTML = "";
    $(this).attr('disabled', true);
    $(this).html("Enregistrement en cour ...");
    const reponse_ = {
        title: $('#title').val(),
        description: $('#description').val(),
        duration: $('#duration').val(),
        qte: $('#qte').val(),
        montant: $('#montant').val()
    };

    fetch('/create/' + diag_id + '/reparation-diagnostique', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
            document.location.reload();
            if (response.status == 200) {
                document.getElementById("message_success").innerHTML = response.message;
            }
            if (response.status == 400) {
                document.getElementById("message_error").innerHTML = response.message;
                // list_diagnostique(response.data);
            }
           
            $(this).attr('disabled', false);
            $(this).html("Ajout");
        }).catch(err => {
            $('#loading_page').css("display", "none");
            document.getElementById("message_error").innerHTML = err.message;
            $(this).attr('disabled', false);
            $(this).html("Ajout");
        });

});*/


function supp_diagnostique(diag_id) {
    const reponse_ = {};
    $('#loading_page').css("display", "block");
    $(".delete_diagnostique").attr('disabled', true);
    fetch('/delete/' + diag_id + '/reparation-diagnostique', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
            if (response.status == 200) {
              list_diagnostique(response.data);
            }
           else {

                toastError(response.message);
            }
            $(".delete_diagnostique").attr('disabled', false);
        }).catch(err => {

            toastError(err.message);
            $(".delete_diagnostique").attr('disabled', false);
        });
}




function accepter_reparation_client(reparation_id) {
    $('#loading_page').css("display", "block");
    fetch('/accepter-la-reparation/' + reparation_id, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $('#loading_page').css("display", "none");
            if (response.status == 200) {

                setInterval(() => {
                    window.location.replace(window.location.protocol + "//" + window.location.host + "/voiture_receptionner");

                }, 2000);
            }
            else {

                toastError(response.message);
            }
        }).catch(err => {

            toastError(err.message);
        });
}

$('#start_reparation').click(function () {
    const reparation_id = $(this).data("id");

    // $(this).attr('disabled',true);
    $(this).html("Chargement du projet  en cours ...");
    const reponse_ = { reparation: reparation_id };

    fetch('/start-reparation/' + reparation_id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $(this).attr('disabled', false);
            $(this).html("Lancez le projet");
            if (response.status == 200) {

                window.location.replace(window.location.protocol + "//" + window.location.host + "/etat-davancement/" + reparation_id);
                //  window.location.protocol + "//" + window.location.host + "/reparation-en-cours/"+reparation_id;
            }

        }).catch(err => {
            alert(err.message);
            $(this).attr('disabled', false);
            $(this).html("Lancez le projet");
        });

});

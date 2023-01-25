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
    $('#save_new_facture').attr('disabled', true);
});



$('#facture').keyup(function () {
    document.getElementById('facture_error').innerHTML = "";
         
    if ($(this).val().length > 0) {
        $('#save_new_facture').attr('disabled', false);
   
            fetch('/verify-facture', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mail: $(this).val() })
            })
                .then(res => {
                    if (res.ok) return res.json()
                })
                .then(response => {
                    if (response.data != null) {
                        document.getElementById('facture_error').innerHTML = "Le n° facture déjà utilisé!";
                        $('#save_new_facture').attr('disabled', true);
                    }
                    else {
                        document.getElementById('facture_error').innerHTML = "";
                    }
                }).catch(err => {
                    document.getElementById("facture_error").innerHTML = err.message;
                });
     
    } else {
        document.getElementById('facture_error').innerHTML = "le facture est invalide";
        $('#save_new_facture').attr('disabled', true);
    }
});


function save_new_facture(reparation_id) {

    $('#loading_page').css("display", "block");
    // const reparation_id = $(this).data("id");
    $('#save_new_facture').attr('disabled', true);
    $('#save_new_facture').html("Enregistrement en cours ...");
    const reponse_ = {
        facture: $('#facture').val(),
        invoice_date: $('#invoice_date').val(),
        due_date: $('#due_date').val(),
        paiement: $('#paiement').val()
    };

    fetch('/save/' + reparation_id + '/new-facture', {
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
                window.location.replace(window.location.protocol + "//" + window.location.host + "/detail/" + reparation_id+"/facture");
            }
            if (response.status == 400) {
                toastError(response.message);
            }
            $('#save_new_facture').attr('disabled', false);
            $('#save_new_facture').html("Validé la facture");
        }).catch(err => {
            $('#save_new_facture').attr('disabled', false);
            toastError(err.message);
            $('#save_new_facture').html("Validé la facture");
        });

}


function edit_facture_diagnostique(diag_id) {
   
    $('#loading_page').css("display", "block");
    // const diag_id = $(this).data("id");
    const reponse_ = {
        title: $('#titlefact'+diag_id).val(),
        tva: $('#tvafact'+diag_id).val(),
        qte: $('#qtefact'+diag_id).val(),
        montant: $('#montantfact'+diag_id).val(),
        unite: $('#unitefact'+diag_id).val()
    };
    fetch('/edit/' + diag_id + '/diagnostique', {
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

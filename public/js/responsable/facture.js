


$(document).ready(function () {
    $('#save_new_facture').attr('disabled', true);
});




$('#facture').keyup(function () {
    if ($(this).val().length > 5) {
        if ($(this).val().match(validRegex)) {
            document.getElementById('facture_error').innerHTML = "";
            fetch('/verify-mail-user', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mail: $(this).val() })
            })
                .then(res => {
                    if (res.ok) return res.json()
                })
                .then(response => {
                    if (response.data != null) {
                        document.getElementById('facture_error').innerHTML = "N° facture déjà utilisé";
                        $('#submit_new_resp').attr('disabled', true);
                    }
                    else {
                        document.getElementById('facture_error').innerHTML = "";
                    }
                }).catch(err => {
                    document.getElementById("facture_error").innerHTML = err.message;
                });
        } else {
            document.getElementById('facture_error').innerHTML = "le facture est invalide";
            $('#submit_new_resp').attr('disabled', true);
        }
    } else {
        document.getElementById('facture_error').innerHTML = "le facture est invalide";
        $('#submit_new_resp').attr('disabled', true);
    }
});


$('#save_new_facture').click(function () {
    $('#loading_page').css("display", "block");
    const diag_id = $(this).data("id");
    $(this).attr('disabled', true);
    $(this).html("Enregistrement en cours ...");
    const reponse_ = {
        facture: $('#facture').val(),
        invocie_date: $('#invocie_date').val(),
        due_date: $('#due_date').val(),
        paiement: $('#paiement').val()
    };

    fetch('/save/' + diag_id + '/new-facture', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            if (response.status == 200) {
                $('#loading_page').css("display", "none");
                window.location.replace(window.location.protocol + "//" + window.location.host + "/detail/" + reparation_id+"/facture");
       
            }
            if (response.status == 400) {
                toastError(response.message);
            }
            $(this).attr('disabled', false);
            $(this).html("Modifier");
        }).catch(err => {
            toastError(err.message);
       
            $(this).attr('disabled', false);
            $(this).html("Modifier");
        });

});


$('#edit_facture_diagnostique').click(function () {
    $('#loading_page').css("display", "block");
    const diag_id = $(this).data("id");
    $(this).attr('disabled', true);
    $(this).html("Modification en cour ...");
    const reponse_ = {
        title: $('#titlefact').val(),
        tva: $('#tvafact').val(),
        qte: $('#qtefact').val(),
        montant: $('#montantfact').val(),
        unite: $('#unitefact').val()
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
            $(this).attr('disabled', false);
            $(this).html("Modifier");
        }).catch(err => {
            $('#loading_page').css("display", "none");
         
            toastError(err.message);
            $(this).attr('disabled', false);
            $(this).html("Modifier");
        });

});

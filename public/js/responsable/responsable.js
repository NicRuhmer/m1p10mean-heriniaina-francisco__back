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

$('#form-new-resp').keyup(function () {

    if ($('#name').val().length > 1 &&
        $('#email').val().length > 5 &&
        $('#contact').val().length > 2 &&
        $('#adresse').val().length > 2 &&
        $('#salaire').val() > 0 &&
        $('#password').val().length > 3
    ) {
        $('#submit_new_resp').attr('disabled', false);
    } else {

        $('#submit_new_resp').attr('disabled', true);
    }
});


$('#email').keyup(function () {
    if ($(this).val().length > 5) {
        if ($(this).val().match(validRegex)) {
            document.getElementById('email_error').innerHTML = "";
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
                        document.getElementById('email_error').innerHTML = "le email de l'utilisateur a été déjà utilisé";
                        $('#submit_new_resp').attr('disabled', true);
                    }
                    else {
                        document.getElementById('email_error').innerHTML = "";
                    }
                }).catch(err => {
                    document.getElementById("email_error").innerHTML = err.message;
                });
        } else {
            document.getElementById('email_error').innerHTML = "le email est invalide";
            $('#submit_new_resp').attr('disabled', true);
        }
    } else {
        document.getElementById('email_error').innerHTML = "le email est invalide";
        $('#submit_new_resp').attr('disabled', true);
    }
});


$('#contact').keyup(function () {
    if ($(this).val().length > 2) {
        document.getElementById('contact_error').innerHTML = "";
    } else {
        document.getElementById('contact_error').innerHTML = "contact est invalide !";
        $('#submit_new_resp').attr('disabled', true);
    }
});

$('#adresse').keyup(function () {
    if ($(this).val().length > 2) {
        document.getElementById('adresse_error').innerHTML = "";

        if (document.getElementById('email_error').innerHTML === "" &&
            document.getElementById('contact_error').innerHTML === "" &&
            document.getElementById('password_error').innerHTML === "" &&
            document.getElementById('salaire_error').innerHTML === "") {
            $('#submit_new_resp').attr('disabled', false);
        } else {
            $('#submit_new_resp').attr('disabled', true);
        }
    } else {
        document.getElementById('adresse_error').innerHTML = "adresse est invalide !";
        $('#submit_new_resp').attr('disabled', true);
    }
});

$('#salaire').keyup(function () {
    if ($(this).val() > 0) {
        document.getElementById('salaire_error').innerHTML = "";

        if (document.getElementById('email_error').innerHTML === "" &&
            document.getElementById('contact_error').innerHTML === "" &&
            document.getElementById('adresse_error').innerHTML === "" &&
            document.getElementById('password_error').innerHTML === "") {
            $('#submit_new_resp').attr('disabled', false);
        } else {
            $('#submit_new_resp').attr('disabled', true);
        }
    } else {
        document.getElementById('salaire_error').innerHTML = "salaire est invalide !";
        $('#submit_new_resp').attr('disabled', true);
    }
});

$('#password').keyup(function () {
    if ($(this).val().length > 3) {
        document.getElementById('password_error').innerHTML = "";
        if (document.getElementById('email_error').innerHTML === "" &&
            document.getElementById('contact_error').innerHTML === "" &&
            document.getElementById('adresse_error').innerHTML === "" &&
            document.getElementById('salaire_error').innerHTML === "") {
            $('#submit_new_resp').attr('disabled', false);
        } else {
            $('#submit_new_resp').attr('disabled', true);
        }

    } else {
        document.getElementById('password_error').innerHTML = "mot de passe est invalide !";
        $('#submit_new_resp').attr('disabled', true);
    }
});



$('#submit_new_resp').click(function () {
    document.getElementById('message_error').innerHTML == "";
    $('#loading_page').css("display", "block");
    $(this).attr('disabled', true);
    $(this).html("Enregistrement en cour ...");
    const reponse_ = {
        nicname: $('#name').val(),
        username: $('#email').val(),
        contact: $('#contact').val(),
        adresse: $('#adresse').val(),
        salaire: $('#salaire').val(),
        password: $('#password').val(),
        role: $('#role').val()
    };

    if (document.getElementById('email_error').innerHTML === "" &&
        document.getElementById('contact_error').innerHTML === "" &&
        document.getElementById('adresse_error').innerHTML === "" &&
        document.getElementById('salaire_error').innerHTML === "" &&
        document.getElementById('password_error').innerHTML === "") {
        $(this).attr('disabled', false);
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
                $('#loading_page').css("display", "none");
                if (response.status == 200) {
                    toastSuccess(response.message);
                    // document.getElementById("message_success").innerHTML = response.message;
                }
                if (response.status == 400) {
                    toastError(response.message);
                    // document.getElementById("message_error").innerHTML = response.message;
                }
            }).catch(err => {
                $('#loading_page').css("display", "none");
                toastError(err.message);
                // document.getElementById("message_error").innerHTML = err.message;
            });
    } else {
        $('#loading_page').css("display", "none");
        toastError('les données sont invalides');
        // document.getElementById("message_error").innerHTML = 'les données sont invalides';
    }
});


$('#submit_update_resp').click(function () {
    const id = $(this).data("id");
    $('#loading_page').css("display", "block");
    $(this).attr('disabled', true);
    $(this).html("Modification en cour ...");
    const reponse_ = {
        nicname: $('#named').val(),
        username: $('#emaild').val(),
        contact: $('#contactd').val(),
        adresse: $('#adressed').val(),
        salaire: $('#salaired').val(),
    };
    const url = `/resp.update/${id}`;
    fetch(url, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $(this).attr('disabled', false);
            $(this).html("Modifier");

            $('#loading_page').css("display", "none");
            if (response.status == 200) {
                toastSuccess(response.message);
                // document.getElementById("message_success").innerHTML = response.message;
            }
            if (response.status == 400) {
                toastError(response.message);
                // document.getElementById("message_error").innerHTML = response.message;
            }
        }).catch(err => {
            $(this).attr('disabled', false);
            $(this).html("Modifier");

            $('#loading_page').css("display", "none");
            toastError(err.message);
            // document.getElementById("message_error").innerHTML = err.message;
        });

});

function desactived(id_) {
    $('#loading_page').css("display", "block");
    const reponse_ = {};
    var url = `/desactived/${id_}/teams`;
    fetch(url, {
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
                toastSuccess(response.message);
                setInterval(() => {
                    document.location.reload();
                }, 3000);
            }
            if (response.status == 400) {
                toastError(response.message);
            }

        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}



$('#reset_password').click(function () {
    const id = $(this).data("id");
    $(this).attr('disabled', true);
    $(this).html("Modification en cour ...");
    const reponse_ = {
        last_password: $('#last_password').val(),
        new_password: $('#new_password').val(),
        confirm_password: $('#confirm_password').val()
    };
    const url = `/reset_password/${id}/user`;
    fetch(url, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reponse_)
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            $(this).attr('disabled', false);
            $(this).html("Modifier le mot de passe");

            $('#loading_page').css("display", "none");
            if (response.status == 200) {
                toastSuccess(response.message);
            }
            if (response.status == 400) {
                toastError(response.message);
            }
        }).catch(err => {
            $(this).attr('disabled', false);
            $(this).html("Modifier le mot de passe");

            $('#loading_page').css("display", "none");
            toastError(err.message);
        });

});

function actived(id_) {
    $('#loading_page').css("display", "block");
    const reponse_ = {};
    var url = `/actived/${id_}/teams`;
    fetch(url, {
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
                toastSuccess(response.message);
                setInterval(() => {
                    document.location.reload();
                }, 3000);
            }
            if (response.status == 400) {
                toastError(response.message);
            }
        }).catch(err => {
            $('#loading_page').css("display", "none");
            toastError(err.message);
        });
}


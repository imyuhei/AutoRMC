var storage = chrome.storage.local;

function save(callback){
    hideWarning();
    if (checkInputPresence()) {
        var values = {
            "username": jQuery("#username input").val(), 
            "password": jQuery("#password input").val(), 
            "autofill": jQuery("input[name=autofill]:checked").val(), 
            "autologin": jQuery("input[name=autologin]:checked").val(), 
            "lastlogin": 0, 
            "error": ""
        };
        storage.set(values,
            function(){
                callback(values);
                addSuccess(jQuery("#input-username").siblings("span"));
                addSuccess(jQuery("#input-password").siblings("span"));
            }
        );
    }
}

function checkInputPresence() {
    var fieldsPresence = true;
    if (jQuery("#username input").val() == "") {
        jQuery("#username div").text("Please fill in User Name");
        jQuery("#username span").removeClass("glyphicon-ok").addClass("glyphicon-warning-sign").addClass("text-danger");
        fieldsPresence = false;
    }
    if (jQuery("#password input").val() == "") {
        jQuery("#password div").text("Please fill in Password");
        jQuery("#password span").removeClass("glyphicon-ok").addClass("glyphicon-warning-sign").addClass("text-danger");
        fieldsPresence = false;
    }
    return fieldsPresence;
}

function addWarning(elem) {
    elem.removeClass("glyphicon-ok").removeClass("text-success").addClass("glyphicon-warning-sign").addClass("text-danger");
}

function addSuccess(elem) {
    elem.removeClass("text-danger").removeClass("text-danger").addClass("glyphicon-ok").addClass("text-success");
}

function hideWarning() {
    jQuery("#message").html("");
    jQuery("#username span").removeClass("glyphicon-warning-sign").removeClass("text-danger");
    jQuery("#username div").text("");
    jQuery("#password span").removeClass("glyphicon-warning-sign").removeClass("text-danger");
    jQuery("#password div").text("");
};

function removeSuccess(elem) {
    elem.removeClass("glyphicon-ok").removeClass("text-success");
}

hideWarning();

storage.get(null, function(values){
    jQuery("#username input").val(values.username);
    jQuery("#password input").val(values.password);
    if(checkInputPresence()) {
        addSuccess(jQuery("#input-username").siblings("span"));
        addSuccess(jQuery("#input-password").siblings("span"));
    }
    if (values.autofill == "disable") {
        jQuery("#disable-autofill").attr("checked", "checked").siblings().addClass("selected");;
    } else {
        jQuery("#enable-autofill").attr("checked", "checked").siblings().addClass("selected");;
    }
    if (values.autologin == "disable") {
        jQuery("#disable-autologin").attr("checked", "checked").siblings().addClass("selected");;
    } else {
        jQuery("#enable-autologin").attr("checked", "checked").siblings().addClass("selected");;
    }
    if (values.error == "username") {
        jQuery("#message").html("<span class=\"text-danger\">"+
            "History has shown that your User Name is incorrect"+
        "</span>");
        jQuery("#userame span").show();
    } else if (values.error == "passwordorquota") {
        jQuery("#message").html("<span class=\"text-danger\">"+
            "History has shown that your Password is incorrect"+
            ", or you have run out of your credit"+
        "</span>");
        jQuery("#password span").show();
    } else if (values.error == "network") {
        jQuery("#message").html("<span class=\"text-danger\">"+
            "History has shown that there is a network error from RMC"+
            ", please contact RMC office"+
        "</span>");
    } else if (values.error == "alreadyloggedin") {
        jQuery("#message").html("<span class=\"text-danger\">"+
            "History has shown that your account has been logged in somewhere else"+
            ", please logoff from other location first."+
        "</span>");
    }
});

// bind form elements event listener
jQuery("#autofill input[type=radio]").change(function() {
    if (jQuery("input[name=autologin]:checked").val() == 'enable') {
        // if auto login is enabled, auto fill must be enabled as well
        jQuery("#autologin > label.control-label").css('color', '#A33').fadeIn(200).fadeOut(100).fadeIn(200).fadeOut(100).fadeIn(200);
        setTimeout(function() {
            jQuery("#autologin > label.control-label").css('color', '');
            jQuery("#enable-autofill").prop("checked", true);
        }, 2000);
        // switch it back to another radio
        return;
    }
    jQuery("#input-autofill label.selected").removeClass("selected");
    jQuery(this).siblings().addClass("selected");
    save(function(){});
});
jQuery("#autologin input[type=radio]").change(function() {
    jQuery("#input-autologin label.selected").removeClass("selected");
    jQuery(this).siblings().addClass("selected");
    if (jQuery("input[name=autofill]:checked").val() == 'disable') {
        // if auto login is enabled, auto fill must be enabled as well
        jQuery("#input-autofill label.selected").removeClass("selected");
        jQuery("#enable-autofill").prop("checked", true).siblings().addClass("selected");
        save(function(){});
    }
    save(function(){});
});

// function inputFocus() {
//     removeSuccess(jQuery(this).siblings("span"));
// }
function inputChange() {
    save(function(){});
}
jQuery("#input-username").change(inputChange);
jQuery("#input-password").change(inputChange);

// jQuery("#save").click(function(e){
//     save(function(){
//         jQuery("#message").html("<span class=\"text-success\">Settings saved</span>");
//     });
// });

// jQuery("#reset").click(function(e){
//     jQuery("#disable-autologin").attr("checked", "checked").trigger("click");
//     jQuery("#username input").val("");
//     jQuery("#password input").val("");
//     storage.clear();
// });
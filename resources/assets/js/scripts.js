$(document).ready(function () {
let map;
let marker;
let apiToken;
let trackingInterval; // To store the interval ID
const username = "Shiran";  // Replace with your GPS login account
const password = "S123456";  // Replace with your GPS login password
const vehiclePlate = "8020";

async function initializeMap(param) {
    if (param) {
        var licensePlate = param.license_plate;
        var vehicleName = param.vehicle_name;

        // Update the h6 elements
        $(".vehicle-details-section").html(`
            <p>Vehicle name:  ${vehicleName} <br>
            Vehicle license plate:  ${licensePlate}</p>
        `);
    }

    try {
    const defaultLocation = { lat: 6.9271, lng: 79.8612 }; // Colombo, Sri Lanka

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Initialize the map
    map = new Map(document.getElementById("map"), {
        zoom: 14,
        center: defaultLocation,
        mapId: "22981a254bd9a54e"  // Replace with your Map ID
    });

    // Create marker at default location
    marker = new AdvancedMarkerElement({
        position: defaultLocation,
        map: map,
        title: 'GPS Tracker'
    });

    // Start fetching GPS data
    await getGpsTrackerAuthToken();
    } catch (error) {
        console.error("Map Initialization Error:", error);
        alertify.error(error);
    }
}

function retryLoadMap() {
    errorOccurred = false;
    document.getElementById("error-message").style.display = "none";
    initializeMap();
}

async function getGpsTrackerAuthToken() {
    $.ajax({
        url: "http://openapi.itracksense.com/api/user/GetLoginToken",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "LoginName": username,
            "PassWord": password
        }),
        success: async function (response) {
            if (response.Code === 200) {
                apiToken = response.Data;
                await fetchVehicleLocationData(); // Start fetching GPS data
            } else {
                console.error("Failed to get API Token:", response.ErrMsg);
                alertify.error(response.ErrMsg);
            }
        },
        error: function (xhr, status, error) {
            console.error("Login error:", error);
            alertify.error(error);
        }
    });
}
async function fetchVehicleLocationData() {
    $.ajax({
        url: "http://openapi.itracksense.com/api/vehicle/GetCurrentVehicleInfo",
        type: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken
        },
        data: JSON.stringify({
            "VehiclePlates": vehiclePlate
        }),
        success: function (response) {
            if (response.Code === 200) {
                const vehicleData = response.Data.data[0];  // Access first vehicle's data

                const latitude = vehicleData.Lat;
                const longitude = vehicleData.Lon;

                // Update marker position
                const currentLocation = {
                    lat: latitude,
                    lng: longitude
                };

                marker.position = currentLocation;
                map.setCenter(currentLocation);
            } else {
                console.error("Failed to get GPS data:", response.ErrMsg);
                alertify.error("Something went wrong. Please try again later!");
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch GPS data:", error);
            alertify.error(error);
        }
    });
}

function startTracking() {
    fetchVehicleLocationData();
    trackingInterval = setInterval(fetchVehicleLocationData, 5000);
}

function stopTracking() {
    clearInterval(trackingInterval);
}


$('#closeLiveTracking').on('click', async function() {
    $('#liveTrackingSection').hide();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
        });
});

    const lang = $("html").attr("lang");
    let tooltipsDateTime;

    $.ajaxSetup({
        beforeSend: function () {
            const restrictedUrls = ["/search/cities/", "/search/addresses/"];
            if (
                this.url &&
                this.url.length &&
                restrictedUrls.includes(this.url.substring(0, 15))
            ) {
                $(".loading-web").css("display", "none");
            } else {
                $(".loading-web").css("display", "block");
            }
        },
        complete: function () {
            $(".loading-web").css("display", "none");
        },
    });

    if (lang === "si") {
        tooltipsDateTime = {
            pickHour: "පැය තෝරන්න",
            incrementHour: "පැය වැඩි කරන්න",
            decrementHour: "පැය අඩු කරන්න",
            pickMinute: "මිනිත්තුව තෝරන්න",
            incrementMinute: "මිනිත්තුව වැඩි කරන්න",
            decrementMinute: "මිනිත්තුව අඩු කරන්න",
        };
    } else {
        tooltipsDateTime = {
            pickHour: "Pick Hour",
            incrementHour: "Increment Hour",
            decrementHour: "Decrement Hour",
            pickMinute: "Pick Minute",
            incrementMinute: "Increment Minute",
            decrementMinute: "Decrement Minute",
        };
    }

    //datetime picker
    // let routeDuration = $('#stopping_time, #route_duration_hour');
    // if (routeDuration.length) {
    //     routeDuration.datetimepicker({
    //         locale: lang,
    //         defaultDate: moment(new Date()).hours(0).minutes(0).seconds(0).milliseconds(0),
    //         tooltips: tooltipsDateTime,
    //         format: 'HH:mm'
    //     });
    // }

    //datepicker variables
    let ob = $(".datepicker-element");
    let oz = $(".datepicker");

    let body = $("body");

    let options = {
        orientation: "bottom auto",
        format: "d MM yyyy",
        language: lang,
    };

    $(".print-ticket").click(function (e) {
        window.print();
    });

    $(document).on("change", ".gender-change", function (d) {
        if ($(this).val() == 1) {
            $(this)
                .parents(".ticket-passenger")
                .find(".ticket-passenger-icon-gender")
                .removeClass("man woman")
                .addClass("man");
        } else {
            $(this)
                .parents(".ticket-passenger")
                .find(".ticket-passenger-icon-gender")
                .removeClass("man woman")
                .addClass("woman");
        }
    });

    $(".sign-in-button-p").on("click", function (e) {
        e.preventDefault();
        openLoginForm();
        closeEmailVerificationForm();
        closeMobileVerificationForm();
        closeRegisterForm();
    });

    $("#sign-up-button-p").on("click", function (e) {
        e.preventDefault();
        openEmailVerificationForm();
        closeLoginForm();
    });

    $("#signUpByGoogle").on("click", function (e) {
        const width = 500, height = 600;
        const left = (screen.width - width) / 4;
        const top = (screen.height - height) / 4;

        const googleAuthPopup = window.open("", "Google Login", "width=500,height=600");
        // const googleAuthPopup = window.open(
        //     "/auth/google/redirect",
        //     "Google Login",
        //     `width=${width},height=${height},top=${top},left=${left}`
        // );

        if (!googleAuthPopup || googleAuthPopup.closed || typeof googleAuthPopup.closed === 'undefined') {
            alert("Popup blocked! Please allow popups and try again.");
            return;
        }

        googleAuthPopup.location.href = "/auth/google/redirect";
        googleAuthPopup.focus();
    });

    //I th
    window.handleGoogleLogin = function (user) {
        // console.log("Google User:", user);
        window.location.reload();
    };

    window.redirectGoogleLoginToNormal = function (param) {
        closeEmailVerificationForm()
        openLoginForm()
        $(".login-popup-wrapper .response")
        .css("display", "inline-block")
        .addClass("response-success")
        .html(param.text);
        $("#google_id").val(param.googleId);
        $("#phone_number2").val(param.phone_number);
    };

    /*----------------------------------------------------*/
    // login and register functions.
    /*----------------------------------------------------*/

    window.openRegisterForm = openRegisterForm;
    window.closeEmailVerificationForm = closeEmailVerificationForm;
    window.openEmailVerificationForm = openEmailVerificationForm;
    window.closeMobileVerificationForm = closeMobileVerificationForm;
    window.openMobileVerificationForm = openMobileVerificationForm;

    function openLoginForm (e) {
        $(".login-btn-wrapper").addClass("open");
    };

    function openEmailVerificationForm (e) {
        $(".email-verification-btn-wrapper").addClass("open");
    };

    function openMobileVerificationForm (e) {
        $(".mobile-verification-btn-wrapper").addClass("open");
    };

    function openMobileVerificationPopup (e) {
        $(".mobile-update-verification-popup-wrapper").addClass("open");
    };

    function closeMobileVerificationPopup (e) {
        $(".mobile-update-verification-popup-wrapper").removeClass("open");
    };

    function closeEmailVerificationForm (e) {
        $(".email-verification-btn-wrapper").removeClass("open");
    };

    function closeMobileVerificationForm (e) {
        $(".mobile-verification-btn-wrapper").removeClass("open");
    };

    function openRegisterForm (e) {
        $(".signup-btn-wrapper").addClass("open");
    };

    function closeLoginForm (e) {
        $(".login-btn-wrapper").removeClass("open");
    };

    function closeRegisterForm (e) {
        $(".signup-btn-wrapper").removeClass("open");
    };


    /*----------------------------------------------------*/
    // Modal mobile verification.
    /*----------------------------------------------------*/
    $(".mobile-verification-popup-wrapper .close").on("click", function (e) {
        e.preventDefault();
        window.history.replaceState({}, document.title, window.location.pathname);
        closeMobileVerificationForm();
    });


    /*----------------------------------------------------*/
    // Modal email verification.
    /*----------------------------------------------------*/
    $(".email-verification-popup-wrapper .close").on("click", function (e) {
        e.preventDefault();
        window.history.replaceState({}, document.title, window.location.pathname);
        closeEmailVerificationForm();
        checkForVerifiedEmails()
    });

    /*----------------------------------------------------*/
    // Modal mobile change otp verification.
    /*----------------------------------------------------*/
    $(".mobile-update-verification-popup-wrapper .close").on("click", function (e) {
        e.preventDefault();
        closeMobileVerificationPopup();
    });

    /*----------------------------------------------------*/
    // Modal login.
    /*----------------------------------------------------*/
    $(".login-button").on("click", function (e) {
        e.preventDefault();
        openLoginForm();
        closeEmailVerificationForm();
        closeRegisterForm();
    });

    $(".login-popup-wrapper .close").on("click", function (e) {
        e.preventDefault();
        closeLoginForm();
    });

    /*----------------------------------------------------*/
    // Modal signup.
    /*----------------------------------------------------*/
    $(".signup-button").on("click", function (e) {
        e.preventDefault();
        // openRegisterForm();
        closeLoginForm();
        openEmailVerificationForm();
    });

    $(".signup-popup-wrapper .close").on("click", function (e) {
        e.preventDefault();
        closeEmailVerificationForm();
        closeRegisterForm();
    });

    /*----------------------------------------------------*/
    // Content corners visibility.
    /*----------------------------------------------------*/
    let site_content_wrapper = $(".site-content-wrapper");
    if (site_content_wrapper.height() < 2210) {
        $(".corner-bottom-pattern").hide();
    }

    if (site_content_wrapper.height() < 910) {
        $(".corner-bottom-gray").hide();
    }

    $(".profile-financial")
        .find('input[name="type"]')
        .change(function (e) {
            $(this).parents().find("fieldset").attr("disabled", "disasbled");
            $(this).parent().parent().find("fieldset").removeAttr("disabled");
        });

    $(document).on("click", ".way-rount-trip", function (e) {
        e.preventDefault();
        let fnd = $(this).find(".one-way");
        if (fnd.hasClass("active")) {
            fnd.removeClass("active");
            fnd.next().addClass("active");
            $(this)
                .parents()
                .find(".return-date")
                .removeClass("transparentify")
                .removeClass("disabled-field");
            $(this)
                .parents()
                .find(".two-way")
                .removeClass("transparentify")
                .removeClass("disabled-field");
        } else {
            fnd.addClass("active");
            $(this).parents().find("#travel_date_back").val("");
            $(this)
                .parents()
                .find(".return-date")
                .val("")
                .addClass("transparentify")
                .addClass("disabled-field");
            $(this)
                .parents()
                .find(".two-way")
                .addClass("transparentify")
                .addClass("disabled-field");
            fnd.next().removeClass("active");
        }
    });

    $(document).on("click", ".disabled-field", function () {
        $(this).removeClass("transparentify").removeClass("disabled-field");
        $(".two-way").removeClass("transparentify");
        $(this).parents().find(".round-trip").trigger("click");
    });

    /*----------------------------------------------------*/
    // owlCarousel
    /*----------------------------------------------------*/
    let o = $(".owl-carousel-reviews");
    if (o.length > 0) {
        o.owlCarousel({
            items: 1,
            loop: true,
            margin: 30,
        });
    }

    let CSRF_TOKEN = $('meta[name="csrf-token"]').attr("content");

    $(document).on("click", ".tabs-selector a", function (e) {
        e.preventDefault();
        $(".tabs-selector").find("a").removeClass("active");
        $(".tabs").find("div.tab-content").addClass("hidden");
        $(this).addClass("active");
        let tab = $(this).attr("href");
        $(tab).removeClass("hidden");
    });

    $(document).on("click", ".logout", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("auth_logout"),
            type: "POST",
            data: { _token: CSRF_TOKEN },
            dataType: "JSON",
            success: function (data) {
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
                window.location.href = data.text;
            },
        });
    });

    let route_type = $("#route_type");
    if (route_type.length > 0) {
        route_type.change(function (e) {
            e.preventDefault();
            let value = $(this).val();
            $.ajax({
                url: route("driver_route_type"),
                type: "POST",
                data: { _token: CSRF_TOKEN, route_type: value },
                dataType: "JSON",
                success: function (data) {
                    $("#vehicle_model").empty();
                    $.each(data.models, function (k, v) {
                        $("#vehicle_model").append(
                            '<option value="' +
                                v.id +
                                '">' +
                                v.name +
                                "</option>"
                        );
                    });

                    $("#license_plate").empty();
                    $.each(data.license_plates, function (k, v) {
                        $("#license_plate").append(
                            '<option value="' +
                                v.id +
                                '">' +
                                v.name +
                                "</option>"
                        );
                    });
                },
            });
        });
    }

    let vehicle_model = $("#vehicle_model");
    if (vehicle_model.length > 0) {
        vehicle_model.change(function (e) {
            e.preventDefault();
            let value = $(this).val();
            $.ajax({
                url: route("driver_routes_vehicle"),
                type: "POST",
                data: { _token: CSRF_TOKEN, model: value },
                dataType: "JSON",
                success: function (data) {
                    $("#license_plate").empty();
                    $.each(data, function (k, v) {
                        $("#license_plate").append(
                            '<option value="' +
                                v.id +
                                '">' +
                                v.license_plate +
                                "</option>"
                        );
                    });
                },
            });
        });
    }

    $(".language")
        .find("a.dropdown-item")
        .click(function (e) {
            e.preventDefault();
            $.ajax({
                url: route("set_preferred_locale"),
                type: "POST",
                data: { _token: CSRF_TOKEN, lang: $(this).attr("hreflang") },
                dataType: "JSON",
                context: this,
                success: function () {
                    let resubmit = $.trim($(this).attr("data-resubmit"));
                    if (resubmit.length) {
                        let elResubmit = "#" + resubmit;
                        $(elResubmit)
                            .find('input[name="lang"]')
                            .val($(this).attr("hreflang"));
                        $(elResubmit).submit();
                    } else {
                        window.location.href = $(this).attr("href");
                    }
                },
            });
        });

    let from_and_to = $('input[name="from"], input[name="to"]');
    if (from_and_to.length) {
        let cities = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: "/cities/tenByCountry.json",
            remote: {
                url: "/search/cities/%QUERY.json",
                wildcard: "%QUERY",
            },
        });
        from_and_to.typeahead(null, {
            name: "city",
            display: "name",
            source: cities,
            minLength: 2,
        });
    }

    let from_and_to_address = $(
        'input[name="from_address"], input[name="to_address"]'
    );
    if (from_and_to_address.length) {
        let addresses = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "/search/addresses/%QUERY.json",
                wildcard: "%QUERY",
            },
        });
        from_and_to_address.typeahead(null, {
            name: "address",
            display: "name",
            source: addresses,
            minLength: 2,
        });
    }

    let incid = 1;
    let routeVehicleForm = $("#routeVehicleForm");
    routeVehicleForm.submit(function (e) {
        e.preventDefault();
        let formData = routeVehicleForm.serializeArray();
        formData.push({ name: "increment", value: incid });
        incid++;
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("diver_routes_add_vehicle"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(".transport-registration-road-form").append(data.text);
                    let cities = new Bloodhound({
                        datumTokenizer:
                            Bloodhound.tokenizers.obj.whitespace("name"),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        prefetch: "/cities/tenByCountry.json",
                        remote: {
                            url: "/search/cities/%QUERY.json",
                            wildcard: "%QUERY",
                        },
                    });

                    let addresses = new Bloodhound({
                        datumTokenizer:
                            Bloodhound.tokenizers.obj.whitespace("name"),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        remote: {
                            url: "/search/addresses/%QUERY.json",
                            wildcard: "%QUERY",
                        },
                    });
                    $('input[name="from"], input[name="to"]').typeahead(null, {
                        name: "city",
                        display: "name",
                        source: cities,
                    });
                    $(
                        'input[name="from_address"], input[name="to_address"]'
                    ).typeahead(null, {
                        name: "address",
                        display: "name",
                        source: addresses,
                    });
                    // let routeDuration = $('#stopping_time');
                    //
                    // routeDuration.datetimepicker({
                    //     locale: lang,
                    //     defaultDate: moment(new Date()).hours(0).minutes(0).seconds(0).milliseconds(0),
                    //     tooltips: tooltipsDateTime,
                    //     format: 'HH:mm'
                    // });
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("submit", ".routeEditForm", function (e) {
        e.preventDefault();
        let resp = $(".response");
        resp.css("display", "none").removeClass(
            "response-success response-danger response-warning response-info"
        );
        let formData = $(this).serializeArray();
        let depd = moment($("#departure_date").datepicker("getDate")).format(
            "YYYY-MM-DD"
        );
        formData.push({ name: "departure_date", value: depd });
        let arrd = moment($("#arrival_date").datepicker("getDate")).format(
            "YYYY-MM-DD"
        );
        formData.push({ name: "arrival_date", value: arrd });
        $.ajax({
            url: route("driver_routes_edit"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    resp.css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    resp.css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: resp.offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                resp.css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: resp.offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("submit", ".routeRegistrationForm", function (e) {
        e.preventDefault();
        let resp = $(".response");
        resp.css("display", "none").removeClass(
            "response-success response-danger response-warning response-info"
        );
        let formData = $(this).serializeArray();
        if ($(this).find("#departure_date_multiple")) {
            let dates = $(this)
                .find("#departure_date_multiple")
                .datepicker("getDates");
            dates.forEach((d) => {
                let depd = moment(d).format("YYYY-MM-DD");
                formData.push({ name: "departure_date[]", value: depd });
            });
        } else {
            let depd = moment(
                $("#departure_date").datepicker("getDate")
            ).format("YYYY-MM-DD");
            formData.push({ name: "departure_date", value: depd });
        }

        $.ajax({
            url: route("driver_routes_add"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    if ($(this).find('input[name="continue"]').val() === "yes") {
                        $(".wizard-container").empty();
                        let wizardComplete = $(".wizard-complete");
                        $(".progress-bar").addClass("completed");
                        wizardComplete.removeClass("hidden");
                        $(".title1").html(wizardComplete.find("h1").html());
                        window.location.href = route("drivers_license");
                    } else {
                        resp.css("display", "inline-block")
                            .addClass("response-success")
                            .html(data.text);
                        window.location.href = route("routes_list");
                        $("html, body").animate({ scrollTop: resp.offset().top - 150, }, 1000 );
                    }
                } else {
                    resp.css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate({ scrollTop: resp.offset().top - 150, }, 1000);
                }
            },
            error: function (data) {
                resp.css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate({ scrollTop: resp.offset().top - 150, }, 1000);
            },
        });
    });

    $(document).on("click", ".ticket_cancel", function (e) {
        e.preventDefault();
        let ths = $(this);
        let id;
        if (ths.attr("data-id")) {
            id = ths.attr("data-id");
        }
        alertify
            .confirm(
                ths.attr("data-title"),
                ths.attr("data-confirm-msg"),
                function () {
                    $.ajax({
                        url: route("cancel_ticket"),
                        type: "POST",
                        context: this,
                        data: { _token: CSRF_TOKEN, id: id },
                        success: function (data) {
                            if (data.status === 1) {
                                alertify.success(data.text);
                            } else {
                                alertify.error(data.text);
                            }
                        },
                        error: function (data) {
                            alertify.error(data.responseJSON.text);
                        },
                    });
                },
                function () {}
            )
            .set("labels", {
                ok: ths.attr("data-ok"),
                cancel: ths.attr("data-cancel"),
            });
    });

    $(document).on("click", ".route_cancel", function (e) {
        e.preventDefault();
        let ths = $(this);
        let id;
        if (ths.attr("data-id")) {
            id = ths.attr("data-id");
        } else {
            id = ths.parents(".routeEditForm").find('input[name="id"]').val();
        }
        let resp = $(".response");
        alertify
            .confirm(
                ths.attr("data-title"),
                ths.attr("data-confirm-msg"),
                function () {
                    $.ajax({
                        url: route("driver_routes_sales_cancel"),
                        type: "POST",
                        context: this,
                        data: { _token: CSRF_TOKEN, id: id },
                        success: function (data) {
                            if (data.status === 1) {
                                alertify.success(data.text);
                            } else {
                                alertify.error(data.text);
                            }
                        },
                        error: function (data) {
                            alertify.error(data.responseJSON.text);
                        },
                    });
                },
                function () {}
            )
            .set("labels", {
                ok: ths.attr("data-ok"),
                cancel: ths.attr("data-cancel"),
            });
    });

    $(document).on("click", ".route_delete_alertify", function (e) {
        e.preventDefault();
        let ths = $(this);
        let id;
        if (ths.attr("data-id")) {
            id = ths.attr("data-id");
        } else {
            id = ths.parents(".routeEditForm").find('input[name="id"]').val();
        }
        let resp = $(".response");
        resp.css("display", "none").removeClass(
            "response-success response-danger response-warning response-info"
        );
        alertify
            .confirm(
                ths.attr("data-title"),
                ths.attr("data-confirm-msg"),
                function () {
                    $.ajax({
                        url: route("driver_routes_delete"),
                        type: "POST",
                        context: this,
                        data: { _token: CSRF_TOKEN, id: id },
                        success: function (data) {
                            if (data.status === 1) {
                                alertify.success(data.text);
                            } else {
                                alertify.error(data.text);
                            }
                        },
                        error: function (data) {
                            alertify.error(data.responseJSON.text);
                        },
                    });
                },
                function () {}
            )
            .set("labels", {
                ok: ths.attr("data-ok"),
                cancel: ths.attr("data-cancel"),
            });
    });

    $(document).on("click", ".vehicle_delete_alertify", function (e) {
        e.preventDefault();
        let ths = $(this);
        let id;
        if (ths.attr("data-id")) {
            id = ths.attr("data-id");
        } else {
            id = ths.parents(".vehicleEditForm").find('input[name="id"]').val();
        }
        let resp = $(".response");
        resp.css("display", "none").removeClass(
            "response-success response-danger response-warning response-info"
        );
        alertify
            .confirm(
                ths.attr("data-title"),
                ths.attr("data-confirm-msg"),
                function () {
                    $.ajax({
                        url: route("driver_vehicle_delete"),
                        type: "POST",
                        context: this,
                        data: { _token: CSRF_TOKEN, id: id },
                        success: function (data) {
                            if (data.status === 1) {
                                alertify.success(data.text);
                            } else {
                                alertify.error(data.text);
                            }
                        },
                        error: function (data) {
                            alertify.error(data.responseJSON.text);
                        },
                    });
                },
                function () {}
            )
            .set("labels", {
                ok: ths.attr("data-ok"),
                cancel: ths.attr("data-cancel"),
            });
    });

    $(document).on("click", ".route_delete", function (e) {
        e.preventDefault();
        let ths = $(this);
        if (ths.parents(".route-form-edit").length) {
            let id;
            if (ths.attr("data-id")) {
                id = ths.attr("data-id");
            } else {
                id = ths
                    .parents(".routeEditForm")
                    .find('input[name="id"]')
                    .val();
            }
            let resp = $(".response");
            resp.css("display", "none").removeClass(
                "response-success response-danger response-warning response-info"
            );
            alertify
                .confirm(
                    ths.attr("data-title"),
                    ths.attr("data-confirm-msg"),
                    function () {
                        $.ajax({
                            url: route("driver_routes_delete"),
                            type: "POST",
                            context: this,
                            data: { _token: CSRF_TOKEN, id: id },
                            success: function (data) {
                                if (data.status === 1) {
                                    window.location.href = route("routes_list");
                                } else {
                                    resp.css("display", "inline-block")
                                        .addClass("response-danger")
                                        .html(data.text);
                                }
                                $("html, body").animate(
                                    {
                                        scrollTop: resp.offset().top - 150,
                                    },
                                    1000
                                );
                            },
                            error: function (data) {
                                resp.css("display", "inline-block")
                                    .addClass("response-danger")
                                    .html(data.responseJSON.text);
                                $("html, body").animate(
                                    {
                                        scrollTop: resp.offset().top - 150,
                                    },
                                    1000
                                );
                            },
                        });
                    },
                    function () {}
                )
                .set("labels", {
                    ok: ths.attr("data-ok"),
                    cancel: ths.attr("data-cancel"),
                });
        } else {
            ths.parents(".transport-registration-road-section").next().remove();
            ths.parents(".transport-registration-road-section").remove();
        }
    });

    $(document).on("click", function (e) {
        let container = [
            ".my_cart_popup",
            ".my_notifications_popup",
            ".explanation",
        ];
        $.each(container, function (key, value) {
            if (!$(value).is(e.target) && $(value).has(e.target).length === 0) {
                $(value).hide();
            }
        });
    });

    $(document).on("click", ".expl", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().find(".explanation").toggle();
        $(this)
            .parent()
            .find(".arrow-down")
            .css("margin-left", this.offsetLeft - 17 + "px");
    });

    let countdown = $(".countdown");
    if (countdown.length) {
        countdown.countdown(countdown.attr("data-date"), function (event) {
            let days = event.offset.totalDays;
            if (days === 0) {
                $(this).html(event.strftime("%H:%M:%S"));
            } else if (days === 1) {
                $(this).html(
                    event.strftime(
                        '<span>1</span> <span class="dday">' +
                            countdown.attr("data-day") +
                            "</span> <span>%H:%M:%S</span>"
                    )
                );
            } else {
                $(this).html(
                    event.strftime(
                        '<span>%-D</span> <span class="dday">' +
                            countdown.attr("data-days") +
                            "</span> <span>%H:%M:%S</span>"
                    )
                );
            }
        });
    }

    $(document).on("click", ".my_cart_button", function (e) {
        e.stopPropagation();
        if (!$(this).hasClass("allow")) {
            e.preventDefault();
            $(".my_cart_popup").toggle();
        }
    });

    $(document).on("click", ".my_notifications_button", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".my_notifications_popup").toggle();
        if (!$(this).hasClass("clicked")) {
            $.ajax({
                url: route("notifications_read_all"),
                type: "POST",
                dataType: "JSON",
                method: "POST",
                context: this,
                data: { _token: CSRF_TOKEN },
            });
            $(this)
                .addClass("clicked")
                .find("span")
                .removeClass("new")
                .html("0");
        }
    });

    $(document).on("click", ".remove_financial", function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("financial_remove"),
            type: "POST",
            dataType: "JSON",
            method: "POST",
            context: this,
            data: { _token: CSRF_TOKEN, id: $(this).attr("data-id") },
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".profile-financial")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    $(this).parents("tr").remove();
                } else {
                    $(this)
                        .parents(".profile-financial")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents(".profile-financial")
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let financialTable = $("#financialTable");

    financialTable.on("change", 'input[name="method"]', function () {
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("financial_activate"),
            type: "POST",
            dataType: "JSON",
            method: "POST",
            context: this,
            data: { _token: CSRF_TOKEN, id: $(this).attr("data-id") },
            success: function (data) {
                if (data.status !== 1) {
                    $(this)
                        .parents(".profile-financial")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
        });
    });

    $(document).on("submit", "#addFinancial", function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("financial_add_action"),
            type: "POST",
            dataType: "JSON",
            method: "POST",
            context: this,
            data: $(this).serializeArray(),
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".profile-financial")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parents(".profile-financial")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents(".profile-financial")
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    if (financialTable.length > 0) {
        financialTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("financial_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [{ className: "eng", targets: [2] }],
            columns: [
                { data: "date" },
                { data: "type" },
                { data: "account" },
                { data: "status" },
                { data: "action", className: "fsize" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let driverPayoutsTable = $("#driverPayoutsTable");
    if (driverPayoutsTable.length > 0) {
        driverPayoutsTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("payout_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN, type: "driver" },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [1, 3, 4] },
                { className: "eng lh-2 inline-block", targets: 2 },
            ],
            columns: [
                { data: "date" },
                { data: "transaction_id" },
                { data: "method" },
                { data: "currency" },
                { data: "amount" },
                { data: "the_status" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let vehicleDetailsTable = $("#vehicleDetailsTable");
    let tableInstance;
    if (vehicleDetailsTable.length > 0) {
        tableInstance = vehicleDetailsTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("partner_vehicle_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN, type: "driver" },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [1, 3, 4] },
                { className: "eng lh-2 inline-block", targets: 2 },
            ],
            columns: [
                { data: "phone_number" },
                { data: "license_plate" },
                { data: "vehicle_name" },
                { data: "driver_name" },
                { data: "number_of_seats" },
                { data: "route_name" },
                { data: "status" },
                { data: "actions", orderable: false, searchable: false }, // Action column
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    // $(document).on('click', '.change-speed-limit', function(event) {
    //     $('#speedLimitPopup').show();
    // });

    $('#closeSpeedLimitPopup').on('click', function() {
        $('#speedLimitPopup').hide();
    });

    $('#vehicleDetailsTable tbody').on('click', '.dropdown-item',async function(e) {
        e.preventDefault();
        var actionType = $(this).attr("class").split(' ')[1];
        var id = $(this).data("id");
        var rowData = tableInstance.row($(this).closest('tr')).data();
        console.log("Action Type:", actionType);
        console.log("ID:", id);
        console.log("Row Data:", rowData);

        if (actionType === 'live-tracking') {
            await initializeMap(rowData)
            $('#liveTrackingSection').show();
            document.getElementById("liveTrackingSection").scrollIntoView({ behavior: "smooth" });
            $('#mileageSection').hide();
        } else if (actionType === 'view-milage') {
            $('#mileageSection').show();
            $('#liveTrackingSection').hide();
        }
    });

    $("#PayoutDriverForm").submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("payout_submit"),
            data: $(this).serializeArray(),
            dataType: "JSON",
            context: this,
            method: "POST",
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".payout-history")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parents(".payout-history")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents(".payout-history")
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $("#PayoutPartnerForm").submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("payout_submit"),
            data: $(this).serializeArray(),
            dataType: "JSON",
            context: this,
            method: "POST",
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".payout-history")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parents(".payout-history")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents(".payout-history")
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let partnerPayoutsTable = $("#partnerPayoutsTable");
    if (partnerPayoutsTable.length > 0) {
        partnerPayoutsTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/payout-data",
                type: "POST",
                data: { _token: CSRF_TOKEN, type: "partner" },
                dataType: "JSON",
            },
            columnDefs: [{ className: "eng", targets: [1, 3, 4] }],
            columns: [
                { data: "date" },
                { data: "transaction_id" },
                { data: "method" },
                { data: "currency" },
                { data: "amount" },
                { data: "the_status" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let partnersListTable = $("#partnersListTable");
    if (partnersListTable.length > 0) {
        partnersListTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("partners_list"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [{ className: "eng", targets: [0, 4, 5, 6, 7] }],
            columns: [
                { data: "phone_number" },
                { data: "name" },
                { data: "the_type" },
                { data: "vehicle_type" },
                { data: "number_of_seats" },
                { data: "tier_1_cut" },
                { data: "tier_2_cut" },
                { data: "passenger_cut" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let partnerSalesTable = $("#partnerSales");
    if (partnerSalesTable.length > 0) {
        partnerSalesTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("partners_sales"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [0, 6, 7] },
                {
                    targets: 5,
                    render: function (data) {
                        return moment(data)
                            .locale(lang)
                            .format("D\\ MMMM YYYY");
                    },
                },
            ],
            columns: [
                { data: "user_phone" },
                { data: "user_name" },
                { data: "user_type" },
                { data: "vehicle_type" },
                { data: "the_route" },
                { data: "departure_date" },
                { data: "percent" },
                { data: "amount" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let salesDataTable = $("#driverSales");
    if (salesDataTable.length > 0) {
        salesDataTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_sales"),
                type: "POST",
                data: { _token: CSRF_TOKEN, history: true },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [0, 2, 4, 5, 6, 7] },
                {
                    targets: 3,
                    render: function (data) {
                        return moment(data)
                            .locale(lang)
                            .format("D\\ MMMM YYYY");
                    },
                },
            ],
            columns: [
                { data: "route_id" },
                { data: "the_route" },
                { data: "the_transport" },
                { data: "departure_date" },
                { data: "total_sold" },
                { data: "price" },
                { data: "total_sold_currency" },
                { data: "total_company_currency" },
                { data: "actions" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let currentSalesDataTable = $("#driverCurrentSales");
    if (currentSalesDataTable.length > 0) {
        currentSalesDataTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_current_sales"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [0, 2, 4, 5, 6, 7] },
                {
                    targets: 3,
                    render: function (data) {
                        return moment(data)
                            .locale(lang)
                            .format("D\\ MMMM YYYY");
                    },
                },
            ],
            columns: [
                { data: "route_id" },
                { data: "the_route" },
                { data: "the_transport" },
                { data: "departure_date" },
                { data: "total_sold" },
                { data: "price" },
                { data: "total_sold_currency" },
                { data: "total_company_currency" },
                { data: "actions" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let driverSalesHistory = $("#driverSalesHistory");
    if (driverSalesHistory.length > 0) {
        driverSalesHistory.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_sales_history"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [0, 3, 5, 6, 7] },
                {
                    targets: 4,
                    render: function (data) {
                        return moment(data)
                            .locale(lang)
                            .format("D\\ MMMM YYYY");
                    },
                },
            ],
            columns: [
                { data: "id" },
                { data: "customer" },
                { data: "the_route" },
                { data: "the_transport" },
                { data: "departure_date" },
                { data: "seat_number" },
                { data: "price" },
                { data: "company_cut" },
                { data: "the_status" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let salesByRouteIdDataTable = $("#driverSalesByRouteId");
    if (salesByRouteIdDataTable.length > 0) {
        salesByRouteIdDataTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_sales_history"),
                type: "POST",
                data: {
                    _token: CSRF_TOKEN,
                    route_id: $('input[name="route_id"]').val(),
                },
                dataType: "JSON",
            },
            columnDefs: [{ className: "eng", targets: [2, 3, 4] }],
            columns: [
                { data: "customer" },
                { data: "the_route" },
                { data: "the_transport" },
                { data: "seat_number" },
                { data: "price" },
                { data: "the_status" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let showMoreMini = $(".show_more_mini");
    showMoreMini.click(function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: route("show_more_ratings"),
            data: {
                _token: CSRF_TOKEN,
                id: parseInt($(this).attr("data-id")),
                skip: parseInt($(this).attr("data-skip")),
            },
            dataType: "JSON",
            context: this,
            success: function (data) {
                if (data !== false) {
                    let ratings_listing = $("#ratings_listing");
                    if (data.hideShowMore === true) {
                        $(this).css("display", "none");
                    }
                    ratings_listing.append(data.results);
                    $(this).attr("data-skip", data.skip);
                }
            },
        });
    });

    function updateCurrency(currencyParam = null) {
        // Get stored currencies from localStorage
        let currencies = JSON.parse(localStorage.getItem("currencies"));
        if (!currencies) return;

        // Find the selected currency exchange rate
        let selectedCurrency = currencyParam ?? localStorage.getItem("selected_currency");
        let selectedCurrencyData = currencies.find(curr => curr.key === selectedCurrency);
        if (!selectedCurrencyData) return;

        let exchangeRate = parseFloat(selectedCurrencyData.value); // Convert string to number

        // Update all elements with class "currency-div"
        document.querySelectorAll(".currency-div").forEach(el => {
            let originalPrice;

            // For total values, apply only to elements with 'total-container' class
            if (el.classList.contains("total-container")) {
                let totalTicketValue = $('input[name="amount"]').val() * parseFloat($('input[name="price"]').val()).toFixed(2)
                originalPrice = totalTicketValue;
            } else {
                originalPrice = parseFloat(el.dataset.originalPrice);
                if (!originalPrice) {
                    originalPrice = parseFloat(el.innerText); // fallback
                    el.dataset.originalPrice = originalPrice; // Store once
                }
            }

            let convertedPrice = (originalPrice * exchangeRate).toFixed(2);
            el.innerText = convertedPrice;
        });

        // Update all elements with the current currency key (e.g., USD, EUR)
        document.querySelectorAll(".currency-key").forEach(el => {
            el.innerText = selectedCurrency;
        });

        // Update selected currency in localStorage and UI
        localStorage.setItem("selected_currency", selectedCurrency);
        document.getElementById("currentCurrency").innerText = selectedCurrency;
    }

    let currencies = localStorage.getItem("currencies");
    let selectedCurrency = localStorage.getItem("selected_currency");
    if (!currencies || !selectedCurrency) {
        loadCurrencyData()
    }

    function loadCurrencyData () {
        $.ajax({
            data: { _token: CSRF_TOKEN },
            url: route("current_currency_code"),
            dataType: "JSON",
            method: "POST",
            beforeSend: function () {
                $(".loading-web").css("display", "none");
            },
            success: function (data) {
                currencies = data['currencies'];
                selectedCurrency = data['selected_currency'];
                if (currencies && selectedCurrency) {
                    localStorage.setItem("selected_currency", selectedCurrency);
                    localStorage.setItem("currencies", JSON.stringify(currencies));
                }
            },
            error: function (xhr, status, error) {
                console.error("Currency details get error:", error);
                alertify.error(error);
            }
        });
    }


 document.querySelectorAll(".switch-currency").forEach(item => {
        item.addEventListener("click", function () {
            let selectedCurrency = this.dataset.currency;
            updateCurrency(selectedCurrency);
        });
    });

    let routesDataTable = $("#routes");
    if (routesDataTable.length > 0) {
        routesDataTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_routes_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            order: [[3, "asc"]],
            columns: [
                { data: "id" },
                { data: "the_transport" },
                { data: "the_route" },
                { data: "departure_date" },
                { data: "the_time" },
                { data: "address_from.translated.name" },
                { data: "address_to.translated.name" },
                { data: "price" },
                { data: "currency.currency_key" },
                { data: "actions", className: "fsize" },
            ],
            columnDefs: [
                { className: "eng", targets: [0, 1, 4, 5, 7, 8, 9] },
                {
                    targets: 3,
                    render: function (data) {
                        return moment(data)
                            .locale(lang)
                            .format("D\\ MMMM YYYY");
                    },
                },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    $(document).on("change", "#type", function (e) {
        if ($(this).val() === "1") {
            $("#departure_day").parent().parent().addClass("hidden");
            $("#arrival_day").parent().parent().addClass("hidden");
            $("#departure_date").parent().parent().removeClass("hidden");
            $("#arrival_date").parent().parent().removeClass("hidden");
            setDepatureDateType(false);
        } else if ($(this).val() === "2") {
            $("#departure_day").parent().parent().removeClass("hidden");
            $("#arrival_day").parent().parent().removeClass("hidden");
            $("#departure_date").parent().parent().addClass("hidden");
            $("#arrival_date").parent().parent().addClass("hidden");
            setDepatureDateType(true);
        }
    });

    function setDepatureDateType(val) {
        let datePicker = $("#departure_date_multiple");
        datePicker.val("");
        if (datePicker.data("datepicker")) {
            datePicker.datepicker("destroy");
        }

        let options = {
            orientation: "bottom auto",
            format: "d MM yyyy",
            language: lang,
            startView: 2,
            multidate: val
        };
        datePicker.datepicker(options);
    }


    let boughtTickets = $("#bought-tickets");
    if (boughtTickets.length > 0) {
        boughtTickets.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("user_tickets_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [2, 4, 5, 6] },
                {
                    targets: 0,
                    render: function (data) {
                        return moment(data)
                            .locale(lang)
                            .format("D\\ MMMM YYYY");
                    },
                },
            ],
            columns: [
                { data: "departure_date" },
                { data: "route_type" },
                { data: "route_id" },
                { data: "the_route" },
                { data: "the_transport" },
                { data: "seat" },
                { data: "price" },
                { data: "ticket" },
                { data: "status" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let finesDataTable = $("#fines");
    if (finesDataTable.length > 0) {
        finesDataTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_fines_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columns: [{ data: "date" }, { data: "route" }, { data: "amount" }],
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    let vehiclesDatatable = $("#vehicles");
    if (vehiclesDatatable.length > 0) {
        vehiclesDatatable.DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: route("driver_vehicles_data"),
                type: "POST",
                data: { _token: CSRF_TOKEN },
                dataType: "JSON",
            },
            columnDefs: [
                { className: "eng", targets: [1, 2] },
                { className: "eng text-center", targets: [3, 4] },
                { className: "fsize", targets: 6 },
            ],
            columns: [
                { data: "route_types.translated.name" },
                { data: "manufacturer_model" },
                { data: "license_plate" },
                { data: "year" },
                { data: "number_of_seats" },
                { data: "status" },
                { data: "actions" },
            ],
            createdRow: function (row, data, index) {
                $(row).addClass("trsize cntr");
            },
            language: {
                url: "/js/dataTables." + lang + ".lang",
            },
        });
    }

    //Vehicle Seat management

    let has_vehicle_scheme = $(".has-vehicle-scheme");

    let draggableSeat = $(".draggable-vehicle");
    if (draggableSeat.length > 0 && has_vehicle_scheme.length < 1) {
        draggableVehicle(draggableSeat, 4);
    }

    let nonDraggable = $(".nondraggable-vehicle");

    let multiple_transport_images = $(
        ".transport-registration-form-img-multiple"
    );
    if (multiple_transport_images.length) {
        multiple_transport_images.hover(
            function () {
                $(this)
                    .find(".hovered-bg")
                    .removeClass("hidden")
                    .css("height", $(this).find("img").outerHeight() + "px");
                $(this)
                    .find(".hovered-single-image")
                    .removeClass("hidden")
                    .css(
                        "margin-top",
                        $(this).find("img").outerHeight() / 2 - 8 + "px"
                    );
            },
            function () {
                $(this).find(".hovered-bg").addClass("hidden");
                $(this).find(".hovered-single-image").addClass("hidden");
            }
        );
    }

    let seatsDefault = (function () {
        let tmp = null;
        let type;
        if ($("#type").length) {
            type = $("#type").val();
        } else {
            type = 1;
        }
        $.ajax({
            async: false,
            url: route("driver_vehicle_seats_max"),
            method: "POST",
            data: { _token: CSRF_TOKEN, type: type },
            beforeSend: function () {
                $(".loading-web").css("display", "none");
            },
            success: function (d) {
                tmp = d;
            },
        });
        return tmp;
    })();

    // needtochange
    let new_row = $(".new_row");
    $(document).on("click", ".new_row", function (e) {
        e.preventDefault();
        let type = $("#type").val();
        let vehicle_scheme = $(".seat-parent");
        if (parseInt(type) === 1 || parseInt(type) === 3) {
            newRow(vehicle_scheme, this, parseInt(seatsDefault), 4);
        } else if (parseInt(type) === 2 || parseInt(type) === 4) {
            newRow(vehicle_scheme, this, parseInt(seatsDefault), 5);
        } else {
            $(this).off("click");
        }
    });

    $(document).on("change", ".transport-registration #type", function () {
        let thsv = parseInt($(this).val());
        seatsDefault = (function () {
            let tmp = null;
            $.ajax({
                async: false,
                url: route("driver_vehicle_seats_max"),
                method: "POST",
                data: { _token: CSRF_TOKEN, type: thsv },
                success: function (d) {
                    tmp = d;
                },
            });
            return tmp;
        })();
        $.ajax({
            url: route("driver_vehicle_scheme"),
            type: "POST",
            data: { _token: CSRF_TOKEN, type: thsv },
            success: function (data) {
                let row;
                if (thsv === 1) {
                    row = 3;
                } else if (thsv === 2 || thsv === 3 || thsv === 5) {
                    row = 4;
                } else if (thsv === 4 || thsv === 6) {
                    row = 5;
                }
                $(".scheme_container").html(data);
                let vehicle_scheme = $(".seat-parent");
                let seats = vehicle_scheme.children().length;
                if (seats < seatsDefault - row) {
                    new_row.removeClass("hidden");
                }
                // need to verify
                if (thsv !== 7) {
                    new_row.css("display", "block");
                } else {
                    new_row.css("display", "none");
                }
                if (thsv !== 7) {
                    draggableVehicle(vehicle_scheme, row);
                } else {
                    $(document).off("click", ".remove_seat");
                }
                $(".vehicle-scheme-wrapper").css("display", "block");
            },
        });
    });

    // needtochange
    $(document).on("click", ".remove_seat", function (e) {
        e.preventDefault();
        let vehicle_scheme = $(".seat-parent");
        let rowVal = $("#type").val();
        let row;
        if (parseInt(rowVal) === 2 || parseInt(rowVal) === 4) {
            row = 5;
        } else if (parseInt(rowVal) === 1 || parseInt(rowVal) === 3) {
            row = 4;
        }
        if (rowVal !== 3) {
            removeSeat(vehicle_scheme, this, parseInt(seatsDefault), row);
        }
    });

    // needtochange
    function removeSeat(vehicle_scheme, ths, number, row) {
        $(ths).parent().remove();
        let seatSeparator;
        let toSeparate;
        let frontEnd;
        if (row === 4) {
            seatSeparator = -182;
            frontEnd = 350;
        } else if (row === 5) {
            seatSeparator = -85;
            frontEnd = 210;
        }

        let seats = vehicle_scheme.children().length;
        if (seats <= number - row) {
            new_row.removeClass("hidden");
        }
        let max = 0;

        vehicle_scheme.find(".vehicle-seat").each(function () {
            let value = parseInt($(this).css("left"));
            max = value > max ? value : max;
        });

        toSeparate = max + seatSeparator;
        vehicle_scheme.css("width", toSeparate + "px");
        vehicle_scheme
            .parents(".draggable-vehicle")
            .css("width", frontEnd + toSeparate + "px");
    }

    // needtochange
    function hasVehicleScheme(
        draggableSeat,
        hasVehicleScheme,
        seatParent,
        nonDraggable = null
    ) {
        if (hasVehicleScheme.length) {
            let frontEnd;
            let row;
            let seatSeparator;
            if (parseInt(hasVehicleScheme.find("#type").val()) === 7) {
                //verify
                $(document).off("click", ".remove_seat");
            } else {
                if (parseInt(hasVehicleScheme.find("#type").val()) === 1) {
                    frontEnd = 210;
                    seatSeparator = -85;
                    row = 3;
                } else if (
                    parseInt(hasVehicleScheme.find("#type").val()) === 2 ||
                    parseInt(hasVehicleScheme.find("#type").val()) === 3 ||
                    parseInt(hasVehicleScheme.find("#type").val()) === 5
                ) {
                    frontEnd = 350;
                    seatSeparator = -70;
                    row = 4;
                } else if (
                    parseInt(hasVehicleScheme.find("#type").val()) === 4 ||
                    parseInt(hasVehicleScheme.find("#type").val()) === 6
                ) {
                    frontEnd = 450;
                    seatSeparator = -80;
                    row = 5;
                }
                if (draggableSeat.length > 0) {
                    draggableVehicle(draggableSeat, row);
                }
            }

            let max = 0;

            $(".vehicle-seat").each(function () {
                let value = parseInt($(this).css("left"));
                max = value > max ? value : max;
            });

            let toSeparate = max + seatSeparator;
            seatParent.css("width", toSeparate + "px");
            draggableSeat.css("width", frontEnd + toSeparate + "px");
            if (nonDraggable !== null && nonDraggable.length) {
                nonDraggable.css("width", frontEnd + toSeparate + "px");
            }
        }
    }

    //On edit page
    let seat_parent = $(".seat-parent");
    hasVehicleScheme(
        draggableSeat,
        has_vehicle_scheme,
        seat_parent,
        nonDraggable
    );

    function newRow(vehicle_scheme, ths, number, row) {
        let seats = vehicle_scheme.children().length;
        let max = 0;
        let toAppSeats = seats + row;

        if (toAppSeats >= number) {
            new_row.addClass("hidden");
        }

        // needtochange
        let toSeparate;
        let seatSeparator;
        let seatWidth;
        let top;
        let frontEnd;
        let toAppend;
        if (row === 3) {
            //verify
            seatSeparator = -182;
            seatWidth = 120;
            top = 0;
            frontEnd = 350;
        } else if (row === 4) {
            seatSeparator = -85;
            seatWidth = 80;
            top = 40;
            frontEnd = 210;
        } else if (row === 5) {
            seatSeparator = -85;
            seatWidth = 80;
            top = 30;
            frontEnd = 210;
        }

        $(".vehicle-seat").each(function () {
            let value = parseInt($(this).css("left"));
            max = value > max ? value : max;
        });

        let countWithMaxLeft = vehicle_scheme
            .find(".vehicle-seat")
            .filter(function () {
                return parseInt($(this).css("left")) === max;
            }).length;

        toAppend = max + seatWidth;
        let maxVal = 0;
        vehicle_scheme.find(".vehicle-seat").each(function () {
            let value = parseInt($(this).find(".transparent-input").val());
            maxVal = value > maxVal ? value : maxVal;
        });

        let minInc = 0;

        max = toAppend;
        toSeparate = max + seatSeparator;
        vehicle_scheme.css("width", toSeparate + "px");
        vehicle_scheme
            .parents(".draggable-vehicle")
            .css("width", frontEnd + toSeparate + "px");

        if (countWithMaxLeft === row) {
            let kf;
            let kfm;
            let kfa;
            let kfTop;
            let kfLeft;
            let kfmTop;
            let kfmLeft;

            let maxNum = 0;

            $(".transparent-input").each(function () {
                const value = parseInt($(this).val());
                maxNum = value > maxNum ? value : maxNum;
            });
            // needtochange
            if (row === 4) {
                let minone = maxNum - 1;
                let mintwo = maxNum - 2;
                let minthree = maxNum - 3;
                if (
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + maxNum + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + minone + " .fromleft")
                                .val()
                        ) &&
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + minone + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + mintwo + " .fromleft")
                                .val()
                        ) &&
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + mintwo + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + minthree + " .fromleft")
                                .val()
                        )
                ) {
                    kf = maxNum - 1;
                    kfm = maxNum;
                    kfTop = vehicle_scheme
                        .find(".vehicle-seat" + kf + " .fromtop")
                        .val();
                    kfLeft = vehicle_scheme
                        .find(".vehicle-seat" + kf + " .fromleft")
                        .val();
                    vehicle_scheme.find(".vehicle-seat" + kf).remove();
                    let lastSeat = vehicle_scheme.find(".vehicle-seat" + kfm);
                    lastSeat
                        .removeClass("vehicle-seat" + kfm)
                        .addClass("vehicle-seat" + kf);
                    lastSeat
                        .find(".transparent-input")
                        .attr("name", "seat_positioning[" + kf + "][value]")
                        .val(kf);
                    lastSeat
                        .find(".fromtop")
                        .attr("name", "seat_positioning[" + kf + "][top]")
                        .val(kfTop);
                    lastSeat
                        .find(".fromleft")
                        .attr("name", "seat_positioning[" + kf + "][left]")
                        .val(kfLeft);
                }
                // needtochange
            } else if (row === 5) {
                let minone = maxNum - 1;
                let mintwo = maxNum - 2;
                let minthree = maxNum - 3;
                let minfour = maxNum - 4;
                if (
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + maxNum + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + minone + " .fromleft")
                                .val()
                        ) &&
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + minone + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + mintwo + " .fromleft")
                                .val()
                        ) &&
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + mintwo + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + minthree + " .fromleft")
                                .val()
                        ) &&
                    parseInt(
                        vehicle_scheme
                            .find(".vehicle-seat" + minthree + " .fromleft")
                            .val()
                    ) ===
                        parseInt(
                            vehicle_scheme
                                .find(".vehicle-seat" + minfour + " .fromleft")
                                .val()
                        )
                ) {
                    kf = maxNum - 2;
                    kfm = maxNum - 1;
                    kfa = maxNum;
                    kfTop = vehicle_scheme
                        .find(".vehicle-seat" + kf + " .fromtop")
                        .val();
                    kfLeft = vehicle_scheme
                        .find(".vehicle-seat" + kf + " .fromleft")
                        .val();
                    vehicle_scheme.find(".vehicle-seat" + kf).remove();
                    let lastSeat = vehicle_scheme.find(".vehicle-seat" + kfm);
                    lastSeat
                        .removeClass("vehicle-seat" + kfm)
                        .addClass("vehicle-seat" + kf);
                    lastSeat
                        .find(".transparent-input")
                        .attr("name", "seat_positioning[" + kf + "][value]")
                        .val(kf);
                    lastSeat
                        .find(".fromtop")
                        .attr("name", "seat_positioning[" + kf + "][top]")
                        .val(kfTop);
                    lastSeat
                        .find(".fromleft")
                        .attr("name", "seat_positioning[" + kf + "][left]")
                        .val(kfLeft);

                    kfmTop = vehicle_scheme
                        .find(".vehicle-seat" + kf + " .fromtop")
                        .val();
                    kfmLeft = vehicle_scheme
                        .find(".vehicle-seat" + kf + " .fromleft")
                        .val();
                    let lastSeatM = vehicle_scheme.find(".vehicle-seat" + kfa);
                    lastSeatM
                        .removeClass("vehicle-seat" + kfa)
                        .addClass("vehicle-seat" + kfm);
                    lastSeatM
                        .find(".transparent-input")
                        .attr("name", "seat_positioning[" + kfm + "][value]")
                        .val(kfm);
                    lastSeatM
                        .find(".fromtop")
                        .attr("name", "seat_positioning[" + kfm + "][top]")
                        .val(kfmTop);
                    lastSeatM
                        .find(".fromleft")
                        .attr("name", "seat_positioning[" + kfm + "][left]")
                        .val(kfmLeft);
                }
            }
        } else {
            minInc = 1;
        }

        let toAppSeatsVal = maxVal + row;
        for (let i = maxVal; i < toAppSeatsVal; i++) {
            let j;
            if (row === 3) {
                ///verify
                if (i === maxVal) {
                    j = 255;
                } else if (i === maxVal + 1) {
                    j = 195;
                } else if (i === maxVal + 2) {
                    j = 135;
                } else if (i === maxVal + 3) {
                    j = 75;
                }
            } else if (row === 4) {
                if (i === maxVal) {
                    j = 200;
                } else if (i === maxVal + 1) {
                    j = 160;
                } else if (i === maxVal + 2) {
                    j = 120;
                } else if (i === maxVal + 3) {
                    j = 80;
                } else if (i === maxVal + 4) {
                    j = 40;
                }
            } else if (row === 5) {
                if (i === maxVal) {
                    j = 200;
                } else if (i === maxVal + 1) {
                    j = 160;
                } else if (i === maxVal + 2) {
                    j = 120;
                } else if (i === maxVal + 3) {
                    j = 80;
                } else if (i === maxVal + 4) {
                    j = 40;
                }
            }

            let iplus = minInc + i;
            vehicle_scheme.append(
                "" +
                    '<div class="vehicle-seat vehicle-seat' +
                    iplus +
                    '" style="left:' +
                    toAppend +
                    "px;top:" +
                    j +
                    'px;">' +
                    '<span><input type="text" class="transparent-input onchange-actioned" name="seat_positioning[' +
                    iplus +
                    '][value]"' +
                    ' value="' +
                    iplus +
                    '" title="">' +
                    '<input type="hidden" name="seat_positioning[' +
                    iplus +
                    '][top]" class="fromtop" value="' +
                    j +
                    '">' +
                    '<input type="hidden" name="seat_positioning[' +
                    iplus +
                    '][left]" class="fromleft" value="' +
                    toAppend +
                    '">' +
                    "</span>" +
                    ' <div class="remove_seat ' +
                    (top === 10 ? "top-10" : "") +
                    '">x</div>' +
                    " </div>"
            );
            draggableVehicle(vehicle_scheme, row);
        }
    }

    $(document).on("keyup", ".onchange-actioned", function (e) {
        let curVal = $(this).val();
        $(this).attr("name", "seat_positioning[" + curVal + "][value]");
        $(this)
            .next()
            .attr("name", "seat_positioning[" + curVal + "][top]");
        $(this)
            .next()
            .next()
            .attr("name", "seat_positioning[" + curVal + "][left]");
        $(this)
            .parents(".vehicle-seat")
            .attr("class", "vehicle-seat vehicle-seat" + curVal);
    });

    function draggableVehicle(vehicleSeat, row) {
        vehicleSeat
            .find(".vehicle-seat")
            .each(function (index) {
                $(this)
                    .find(".fromtop")
                    .val(parseInt($(this).css("top")));
                $(this)
                    .find(".fromleft")
                    .val(parseInt($(this).css("left")));
            })
            .draggable({
                grid: [5, 5],
                drag: function (event, ui) {
                    let max = 0;
                    let frontEnd;
                    let seatSeparator;
                    if (row === 3) {
                        // verify
                        frontEnd = 350;
                        seatSeparator = -182;
                    } else if (row === 4) {
                        frontEnd = 210;
                        seatSeparator = -85;
                    } else if (row === 5) {
                        frontEnd = 210;
                        seatSeparator = -85;
                    }
                    let vehicle_scheme = $(".seat-parent");
                    $(this).find(".fromtop").val(ui.position.top);
                    $(this).find(".fromleft").val(ui.position.left);
                    $(".vehicle-seat").each(function () {
                        let value = parseInt($(this).css("left"));
                        max = value > max ? value : max;
                    });
                    if (ui.position.left >= max) {
                        vehicle_scheme.css(
                            "width",
                            ui.position.left + seatSeparator + "px"
                        );
                        vehicle_scheme
                            .parents(".draggable-vehicle")
                            .css(
                                "width",
                                ui.position.left +
                                    seatSeparator +
                                    frontEnd +
                                    "px"
                            );
                    }
                },
            });
    }

    // END vehicle scheme management

    let forgotPasswordForm = $("#forgotPasswordForm");
    forgotPasswordForm.submit(function (e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_forgot"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                        $('#forgotPasswordForm').find('input, button').prop('disabled', true);
                        openLoginForm();
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let supportForm = $("#supportForm");
    supportForm.submit(function (e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_support"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let supportReplyForm = $("#supportReplyForm");
    supportReplyForm.submit(function (e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_support_reply"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let close_ticket = $(".close_ticket");
    close_ticket.click(function (e) {
        e.preventDefault();
        let formData = $(this).parents("form").serializeArray();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_support_close"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    setTimeout(function () {
                        window.location.href = route("support");
                    }, 5000);
                } else {
                    $(this)
                        .parents(".response")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents(".response")
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let close_ticket_secure = $(".close_ticket_secure");
    close_ticket_secure.click(function (e) {
        e.preventDefault();
        let formData = $(this).parents("form").serializeArray();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_support_close_secure"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    setTimeout(function () {
                        window.location.href = route("support");
                    }, 5000);
                } else {
                    $(this)
                        .parents(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let supportReplyFormSecure = $("#supportReplyFormSecure");
    supportReplyFormSecure.submit(function (e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_support_reply_secure"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let loginForm = $(".loginForm");
    loginForm.submit(function (e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("auth_login"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                // location.reload();
                if (data.status === 1) {
                    window.location.href = data.text;
                } else if (data.status === 3) {
                    scrollTo();
                    location.reload()
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger mini")
                        .html(data.text);
                }
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger mini")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let registerForm = $(".registerForm");
    registerForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = registerForm.serializeArray();
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $.ajax({
            url: route("auth_register"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    const url = new URL(window.location);
                    url.searchParams.delete('verified_email');
                    window.history.replaceState({}, document.title, url.toString());
                    closeRegisterForm();
                    openLoginForm();
                    $(".login-popup-wrapper .response")
                    .css("display", "inline-block")
                    .addClass("response-success")
                    .html(data.text);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let emailVerificationForm = $("#email-verification-form");
    emailVerificationForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = emailVerificationForm.serializeArray();
        $.ajax({
            url: route("verification_email"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    closeRegisterForm();
                    openLoginForm();
                    $(".email-verification-popup-wrapper .response")
                    .css("display", "inline-block")
                    .addClass("response-success")
                    .html(data.text);

                    document.getElementById("verification-email-input").disabled = true;
                    document.querySelector("#email-verification-form button[type='submit']").disabled = true;
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let mobileVerificationForm = $("#mobile-verification-form");
    window.mobileVerificationForm = mobileVerificationForm;
    let submitButton = mobileVerificationForm.find('button[type="submit"]');
    mobileVerificationForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = mobileVerificationForm.serializeArray();
        let otpCode = formData.find((field) => field.name === "otp_code")?.value || "";
        let apiUrl = otpCode ? route("verify_otp") : route("verification_mobile");

        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });

        $.ajax({
            url: apiUrl,
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    if (otpCode) {
                        closeMobileVerificationForm();
                        window.location.reload();
                    } else {
                        $(".mobile-verification-popup-wrapper .response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);

                        let formGroups = mobileVerificationForm.find(".form-group");
                        formGroups.hide();
                        formGroups.last().show();
                        submitButton.text('VERIFY OTP')
                    }
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    const currentPath = window.location.pathname;
    const routeRegex = /^\/listings\/\d+-[a-zA-Z]+-[a-zA-Z]+-date-\d{4}-\d{2}-\d{2}$/;
    const targetElement = document.querySelector(".ticket-scheme");
    function scrollTo () {
        if (routeRegex.test(currentPath)) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        } else {
            return;
    }
    }

    let changeableStars = $(".stars-active.changeable");
    if (changeableStars.length) {
        changeableStars.find("i").on({
            mouseover: function () {
                $(this)
                    .prevAll()
                    .andSelf()
                    .removeClass("fa-star-o")
                    .addClass("fa-star");
                $(this).nextAll().addClass("fa-star-o").removeClass("fa-star");
            },
            mouseleave: function () {
                changeableStars
                    .find("i")
                    .addClass("fa-star-o")
                    .removeClass("fa-star");
                changeableStars
                    .find("i")
                    .filter(function () {
                        return (
                            $(this).attr("data-rating") ===
                            $('input[name="rating"]').val()
                        );
                    })
                    .prevAll()
                    .andSelf()
                    .removeClass("fa-star-o")
                    .addClass("fa-star");
            },
            click: function () {
                $('input[name="rating"]').val($(this).attr("data-rating"));
            },
        });
    }

    let ajaxForm = $('form[data-type="ajax"]');
    ajaxForm.submit(function (e) {
        e.preventDefault();
        let response = $(".response");
        if (!response.hasClass("d-block")) {
            response.css("display", "none");
        }
        response.removeClass(
            "response-success response-danger response-warning response-info"
        );
        let formData = new FormData($(this)[0]);
        if ($(this).find("#birth_date").length) {
            let psdate = moment(
                $(this).find("#birth_date").datepicker("getDate")
            ).format("YYYY-MM-DD");
            formData.append("birth_date", psdate);
        }
        if ($(this).find("#phone_number").length) {
            formData.append(
                "phone_number",
                $(this)
                    .find('input[name="phone_number"]')
                    .intlTelInput("getNumber")
            );
        }
        $.ajax({
            url: $(this).attr("data-action"),
            type: "POST",
            cache: false,
            processData: false,
            async: true,
            context: this,
            contentType: false,
            data: formData,
            dataType: "JSON",
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .removeClass("response-blank")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .removeClass("response-blank")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .removeClass("response-blank")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("click", ".wizard-back", function (e) {
        e.preventDefault();
        let lastActive = $(".progress .progress-bar:not(.not-active)").last();
        let step = parseInt($(".progress-bar:not(.not-active)").length) - 1;
        $.ajax({
            url: route("driver_step_" + step),
            data: { _token: CSRF_TOKEN },
            method: "POST",
            success: function (data) {
                $("html, body").animate(
                    {
                        scrollTop: $(".title1").offset().top - 50,
                    },
                    1000
                );
                lastActive.addClass("not-active");
                $("div.title1").html(lastActive.html());
                $(".wizard-container").html(data);
                if (step === 1) {
                    let phone_number_input = $('input[name="phone_number"]');
                    phone_number_input.intlTelInput({
                        autoPlaceholder: "aggressive",
                        defaultCountry: current_country_code,
                        onlyCountries: ["lk"],
                        utilsScript: "/js/utils.js",
                    });
                    let oz = $(".datepicker");
                    let options = {
                        orientation: "bottom auto",
                        format: "d MM yyyy",
                        language: lang,
                        startView: 2,
                    };
                    oz.datepicker(options);
                } else if (step === 3) {
                    let draggable_vehicle = $(".draggable-vehicle");
                    $(".vehicle-scheme-wrapper").css("display", "block");
                    let has_vehicle_scheme = $(".has-vehicle-scheme");
                    let seatParent = $(".seat-parent");
                    hasVehicleScheme(
                        draggable_vehicle,
                        has_vehicle_scheme,
                        seatParent
                    );
                    let oz = $(".datepicker");
                    let options = {
                        orientation: "bottom auto",
                        format: "d MM yyyy",
                        language: lang,
                        startView: 2,
                    };
                    oz.datepicker(options);
                }
            },
        });
    });

    $(document).on("submit", "#editProfileForm", function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = $(this).serializeArray();
        let psdate = moment(
            $(this).find(".datepicker").datepicker("getDate")
        ).format("YYYY-MM-DD");
        formData.push({ name: "birth_date", value: psdate });
        const emailField = document.getElementById('email');
        formData.push({ name: 'email', value: emailField.value });
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $.ajax({
            url: route("user_edit_profile"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    if (
                        $(this).find('input[name="continue"]').val() === "yes"
                    ) {
                        $("html, body").animate(
                            {
                                scrollTop: $(".title1").offset().top - 50,
                            },
                            1000
                        );
                        $.ajax({
                            url: route("driver_step_2"),
                            data: { _token: CSRF_TOKEN },
                            method: "POST",
                            success: function (data) {
                                $(
                                    ".progress .progress-bar:nth-child(2)"
                                ).removeClass("not-active");
                                $("div.title1").html(
                                    $(
                                        ".progress .progress-bar:not(.not-active):last-child"
                                    ).html()
                                );
                                $(".wizard-container").html(data);
                            },
                        });
                    } else {
                        $(this)
                            .parents()
                            .find(".response")
                            .css("display", "inline-block")
                            .addClass("response-success")
                            .html(data.text);
                        $("html, body").animate(
                            {
                                scrollTop: $(".response").offset().top - 150,
                            },
                            1000
                        );
                    }
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("submit", "#driversLicenseForm", function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = new FormData($(this)[0]);
        $.ajax({
            url: route("driver_license"),
            type: "POST",
            cache: false,
            processData: false,
            async: true,
            context: this,
            contentType: false,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    if (
                        $(this).find('input[name="continue"]').val() === "yes"
                    ) {
                        $("html, body").animate(
                            {
                                scrollTop: $(".title1").offset().top - 50,
                            },
                            1000
                        );
                        $.ajax({
                            url: route("driver_step_3"),
                            data: { _token: CSRF_TOKEN },
                            method: "POST",
                            success: function (data) {
                                $(
                                    ".progress .progress-bar:nth-child(3)"
                                ).removeClass("not-active");
                                $("div.title1").html(
                                    $(
                                        ".progress .progress-bar:not(.not-active):last-child"
                                    ).html()
                                );
                                $(".wizard-container").html(data);
                                $(".vehicle-scheme-wrapper").css(
                                    "display",
                                    "block"
                                );
                                let draggable_vehicle = $(".draggable-vehicle");
                                let has_vehicle_scheme = $(
                                    ".has-vehicle-scheme"
                                );
                                let seatParent = $(".seat-parent");
                                hasVehicleScheme(
                                    draggable_vehicle,
                                    has_vehicle_scheme,
                                    seatParent
                                );
                                let oz = $(".datepicker");
                                let options = {
                                    orientation: "bottom auto",
                                    format: "d MM yyyy",
                                    language: lang,
                                    startView: 2,
                                };
                                oz.datepicker(options);
                            },
                        });
                    } else {
                        $(this)
                            .parents()
                            .find(".response")
                            .css("display", "inline-block")
                            .addClass("response-success")
                            .html(data.text);
                        $("html, body").animate(
                            {
                                scrollTop: $(".response").offset().top - 150,
                            },
                            1000
                        );
                    }
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let passwordWithoutOld = $("#passwordWithoutOld");
    passwordWithoutOld.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = $(this).serialize();
        $.ajax({
            url: route("user_set_password"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    setTimeout(function () {
                        location.reload();
                    }, 5000);
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let changePasswordForm = $("#changePasswordForm");
    changePasswordForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = changePasswordForm.serialize();
        $.ajax({
            url: route("user_change_password"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let updateMobileNumberForm = $("#updateMobileNumberForm");
    updateMobileNumberForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );

        var newMobileNumber = $(this).find('input[name="phone_number"]');
        var phoneNumber = newMobileNumber.intlTelInput("getNumber");
        let formData = new FormData(updateMobileNumberForm[0]);
        formData.set("new_mobile", phoneNumber);

        $.ajax({
            url: route("user_change_mobile"),
            type: "POST",
            context: this,
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents()
                        .find(".response-popup")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    $('#new_phone_number').val(phoneNumber.replace(/^\+94/, '0'));
                    openMobileVerificationPopup();
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let otpVerificationForm = $("#otpVerificationForm");
    otpVerificationForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = new FormData(otpVerificationForm[0]);
        formData.set("new_mobile", $(this).find('input[name="phone_number"]').intlTelInput("getNumber"));

        $.ajax({
            url: route("user_verify_mobile"),
            type: "POST",
            context: this,
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                        location.reload();
                    closeMobileVerificationPopup();
                } else {
                    $(this)
                        .parents()
                        .find(".response-popup")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response-popup")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    function step4() {
        return $.ajax({
            url: route("driver_step_4"),
            data: { _token: CSRF_TOKEN },
            method: "POST",
            success: function (data) {
                $("html, body").animate(
                    {
                        scrollTop: $(".title1").offset().top - 50,
                    },
                    1000
                );
                $(".progress .progress-bar:nth-child(4)").removeClass(
                    "not-active"
                );
                $("div.title1").html(
                    $(
                        ".progress .progress-bar:not(.not-active):last-child"
                    ).html()
                );
                $(".wizard-container").html(data);
                let cities = new Bloodhound({
                    datumTokenizer:
                        Bloodhound.tokenizers.obj.whitespace("name"),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    prefetch: "/cities/tenByCountry.json",
                    remote: {
                        url: "/search/cities/%QUERY.json",
                        wildcard: "%QUERY",
                    },
                });

                let addresses = new Bloodhound({
                    datumTokenizer:
                        Bloodhound.tokenizers.obj.whitespace("name"),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: "/search/addresses/%QUERY.json",
                        wildcard: "%QUERY",
                    },
                });
                $('input[name="from"], input[name="to"]').typeahead(null, {
                    name: "city",
                    display: "name",
                    source: cities,
                });
                $(
                    'input[name="from_address"], input[name="to_address"]'
                ).typeahead(null, {
                    name: "address",
                    display: "name",
                    source: addresses,
                });
                // let routeDuration = $('#stopping_time');
                // routeDuration.datetimepicker({
                //     locale: lang,
                //     defaultDate: moment(new Date()).hours(0).minutes(0).seconds(0).milliseconds(0),
                //     tooltips: tooltipsDateTime,
                //     format: 'HH:mm'
                //});
                let oz = $(".datepicker");
                let options = {
                    orientation: "bottom auto",
                    format: "d MM yyyy",
                    language: lang,
                    startDate: new Date(),
                };
                oz.datepicker(options);
            },
        });
    }

    $(document).on("submit", "#vehicleRegistrationForm", function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = new FormData($(this)[0]);
        let psdate = moment(
            $("#date_of_registration").datepicker("getDate")
        ).format("YYYY-MM-DD");
        formData.append("date_of_registration", psdate);
        $.ajax({
            url: route("driver_vehicle_add"),
            type: "POST",
            cache: false,
            processData: false,
            async: true,
            context: this,
            contentType: false,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    if (
                        $(this).find('input[name="continue"]').val() === "yes"
                    ) {
                        step4();
                    } else {
                        $(this)
                            .parent()
                            .find(".response")
                            .css("display", "inline-block")
                            .addClass("response-success")
                            .html(data.text);
                        setTimeout(function () {
                            window.location.href = route("vehicles_list");
                        }, 5000);
                        $("html, body").animate(
                            {
                                scrollTop: $(".response").offset().top - 150,
                            },
                            1000
                        );
                    }
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("submit", "#vehicleEditForm", function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = new FormData($(this)[0]);
        let psdate = moment(
            $("#date_of_registration").datepicker("getDate")
        ).format("YYYY-MM-DD");
        formData.append("date_of_registration", psdate);
        $.ajax({
            url: route("driver_vehicle_edit"),
            type: "POST",
            cache: false,
            processData: false,
            async: true,
            context: this,
            contentType: false,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    if (
                        $(this).find('input[name="continue"]').val() === "yes"
                    ) {
                        step4();
                    } else {
                        $(this)
                            .parent()
                            .find(".response")
                            .css("display", "inline-block")
                            .addClass("response-success")
                            .html(data.text);
                        $("html, body").animate(
                            {
                                scrollTop: $(".response").offset().top - 150,
                            },
                            1000
                        );
                    }
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function () {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html("Try again later");
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("change", "#avatar", function (e) {
        let fileInput = e.target;
        let cropperModal = $("#cropperModal");
        const currentAvatar = document.getElementById("currentAvatar");
        if (fileInput.files != null && fileInput.files[0] != null) {
            let file, img;
            let _URL = window.URL || window.webkitURL;
            img = new Image();
            const allowedMimes = ["image/jpeg", "image/png"];
            if ((file = fileInput.files[0])) {
                img.onload = () => {
                    if (!allowedMimes.includes(file.type)) {
                        alert("გთხოვთ აირჩიოთ სწორი სურათი");
                        return false;
                    } else if (img.width < 200 || img.height < 200) {
                        alert("გთხოვთ აირჩიოთ 200x200-ზე დიდი სურათი");
                        return false;
                    } else {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            currentAvatar.src = e.target.result;
                            let cropper = new Cropper(currentAvatar, {
                                aspectRatio: 1,
                                autoCropArea: 1,
                                minCropBoxWidth: 200,
                                minCropBoxHeight: 200,
                                viewMode: 1,
                                movable: true,
                                zoomable: false,
                            });

                            cropperModal.modal("show");

                            cropperModal.on("hidden.bs.modal", function () {
                                cropper.destroy();
                                $("#avatar").val("");
                                currentAvatar.src = "";
                                $(".cropper-bg").remove();
                            });
                            $("#saveAvatar").click(function (e) {
                                e.preventDefault();
                                $(".response")
                                    .css("display", "none")
                                    .removeClass(
                                        "response-success response-danger response-warning response-info"
                                    );
                                cropper
                                    .getCroppedCanvas(this.outputOptions)
                                    .toBlob(
                                        (blob) => {
                                            let form = new FormData();
                                            let data = Object.assign(
                                                {},
                                                this.uploadFormData
                                            );
                                            for (let key in data) {
                                                form.append(key, data[key]);
                                            }
                                            form.append(
                                                "avatar",
                                                blob,
                                                this.filename
                                            );
                                            form.append("_token", CSRF_TOKEN);

                                            $.ajax({
                                                url: route(
                                                    "user_change_avatar"
                                                ),
                                                type: "POST",
                                                cache: false,
                                                processData: false,
                                                async: true,
                                                context: this,
                                                contentType: false,
                                                data: form,
                                                success: function (data) {
                                                    if (data.status === 1) {
                                                        location.reload();
                                                    } else {
                                                        $(this)
                                                            .parents()
                                                            .find(".response")
                                                            .css(
                                                                "display",
                                                                "inline-block"
                                                            )
                                                            .addClass(
                                                                "response-danger"
                                                            )
                                                            .html(data.text);
                                                        $("html, body").animate(
                                                            {
                                                                scrollTop:
                                                                    $(
                                                                        ".response"
                                                                    ).offset()
                                                                        .top -
                                                                    150,
                                                            },
                                                            1000
                                                        );
                                                    }
                                                },
                                                error: function (data) {
                                                    $(this)
                                                        .parents()
                                                        .find(".response")
                                                        .css(
                                                            "display",
                                                            "inline-block"
                                                        )
                                                        .addClass(
                                                            "response-danger"
                                                        )
                                                        .html(
                                                            data.responseJSON
                                                                .text
                                                        );
                                                    $("html, body").animate(
                                                        {
                                                            scrollTop:
                                                                $(
                                                                    ".response"
                                                                ).offset().top -
                                                                150,
                                                        },
                                                        1000
                                                    );
                                                },
                                            });
                                        },
                                        "image/jpeg",
                                        90
                                    );
                            });
                        };
                        reader.readAsDataURL(fileInput.files[0]);
                    }
                };
                img.src = _URL.createObjectURL(file);
            }
        }
    });

    $(document).on("change", "#front_side", function () {
        let filename = $(this).val().split("\\").pop();
        $('label[for="front_side"]').html(
            '<i class="fa fa-upload" aria-hidden="true"></i> ' + filename
        );
    });

    $(document).on("change", "#back_side", function () {
        let filename = $(this).val().split("\\").pop();
        $('label[for="back_side"]').html(
            '<i class="fa fa-upload" aria-hidden="true"></i> ' + filename
        );
    });

    $(document).on("change", "#vehicle_license_front_side", function () {
        let filename = $(this).val().split("\\").pop();
        $('label[for="vehicle_license_front_side"]').html(
            '<i class="fa fa-upload" aria-hidden="true"></i> ' + filename
        );
    });

    $(document).on("change", "#vehicle_license_back_side", function () {
        let filename = $(this).val().split("\\").pop();
        $('label[for="vehicle_license_back_side"]').html(
            '<i class="fa fa-upload" aria-hidden="true"></i> ' + filename
        );
    });

    $(document).on("click", "#deleteAvatar", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("user_remove_avatar"),
            type: "POST",
            data: { _token: CSRF_TOKEN },
            success: function (data) {
                if (data.status === 1) {
                    location.reload();
                }
            },
        });
    });

    $(document).on("click", "#delete_vehicle_license_front_side", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("driver_vehicle_delete_front"),
            type: "POST",
            context: this,
            data: { _token: CSRF_TOKEN, id: $('input[name="id"]').val() },
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".form-group")
                        .find(".transport-registration-form-img")
                        .remove();
                    $(this).remove();
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("click", "#delete_vehicle_license_back_side", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("driver_vehicle_delete_back"),
            type: "POST",
            context: this,
            data: { _token: CSRF_TOKEN, id: $('input[name="id"]').val() },
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".form-group")
                        .find(".transport-registration-form-img")
                        .remove();
                    $(this).remove();
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("click", ".delete-veh-image", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("driver_vehicle_delete_image"),
            data: {
                _token: CSRF_TOKEN,
                path: $(this).attr("data-path"),
                id: $('input[name="id"]').val(),
            },
            method: "POST",
            context: this,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".transport-registration-form-img-multiple")
                        .remove();
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("click", "#delete_front_side", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("driver_license_delete_front"),
            type: "POST",
            context: this,
            data: { _token: CSRF_TOKEN },
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".form-group")
                        .find(".profile-license-img")
                        .remove();
                    $(this).remove();
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("click", "#delete_back_side", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("driver_license_delete_back"),
            type: "POST",
            context: this,
            data: { _token: CSRF_TOKEN },
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parents(".form-group")
                        .find(".profile-license-img")
                        .remove();
                    $(this).remove();
                } else {
                    $(this)
                        .parents()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parents()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let registerAsDriverForm = $("#registerAsDriverForm");
    registerAsDriverForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = registerAsDriverForm.serializeArray();
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $.ajax({
            url: route("auth_register_driver"),
            type: "POST",
            data: formData,
            context: this,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let registerNewPartnerForm = $("#registerNewPartnerForm");
    registerNewPartnerForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = registerNewPartnerForm.serializeArray();
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $.ajax({
            url: "/api/registration-partner",
            type: "POST",
            data: formData,
            context: this,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    registerNewPartnerForm.trigger("reset");
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let becomeDriverForm = $("#becomeDriverForm");
    becomeDriverForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = becomeDriverForm.serializeArray();
        $.ajax({
            url: route("register_driver"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    setTimeout(function () {
                        window.location.href = route("driver_wizard");
                    }, 3000);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let becomePartnerForm = $("#becomePartnerForm");
    becomePartnerForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = becomePartnerForm.serializeArray();
        $.ajax({
            url: route("register_partner"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                    window.location.href = route("partner_profit");
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    let registerAsPartnerForm = $("#registerAsPartnerForm");
    registerAsPartnerForm.submit(function (e) {
        e.preventDefault();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        let formData = registerAsPartnerForm.serializeArray();
        formData.push({
            name: "phone_number",
            value: $(this)
                .find('input[name="phone_number"]')
                .intlTelInput("getNumber"),
        });
        $.ajax({
            url: route("auth_register_partner"),
            type: "POST",
            context: this,
            data: formData,
            success: function (data) {
                if (data.status === 1) {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-success")
                        .html(data.text);
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                }
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on("click", ".vegatr", function (e) {
        e.preventDefault();
        let gallery = $(this).attr("data-gallery");
        $(gallery)
            .magnificPopup({
                delegate: "a",
                type: "image",
                gallery: {
                    enabled: true,
                },
            })
            .magnificPopup("open");
    });
    $(document).on("click", "[id^='toggleIcon-']", function () {
        const icon = this;
        const inputId = icon.id.replace("toggleIcon-", "");
        const passwordInput = document.getElementById(inputId);

        if (passwordInput) {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";

            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
        }
    });


    /*----------------------------------------------------*/
    // Superfish menu.
    /*----------------------------------------------------*/
    $(".sf-menu").superfish();

    /*----------------------------------------------------*/
    // Datepicker
    /*----------------------------------------------------*/

    if (ob.length > 0) {
        if (
            ob.attr("id") === "departure_date" ||
            ob.attr("id") === "arrival_date" ||
            ob.attr("id") === "travel_date" ||
            ob.attr("id") === "travel_date_back"
        ) {
            options["startDate"] = new Date();
        }

        if (ob.attr("id") === "departure_date_multiple") {
            options["multidate"] = true;
        }
        ob.datepicker(options)
            .on("hide", function (e) {
                if ($(this).parent().parent().hasClass("return-date")) {
                    if (e.dates.length === 0) {
                        let thiss = $(this).parents();
                        thiss.find(".one-way").addClass("active");
                        $(this)
                            .parent()
                            .parent()
                            .parent()
                            .addClass("transparentify")
                            .addClass("disabled-field");
                        thiss.find(".two-way").addClass("transparentify");
                        thiss.find(".one-way").next().removeClass("active");
                    }
                }
            })
            .on("clearDate", function () {
                $(this).datepicker("hide");
            })
            .on("changeDate", function (e) {
                if (e.dates.length === 0) {
                    $(this).datepicker("hide");
                }
            });
    }

    if (
        oz.attr("name") === "birth_date" ||
        oz.attr("name") === "date_of_registration"
    ) {
        options["startView"] = 2;
    }

    if (body.find(".datepicker").length) {
        $(".datepicker").each(function () {
            if (
                $(this).attr("id") === "departure_date" ||
                $(this).attr("id") === "arrival_date" ||
                $(this).attr("id") === "travel_date" ||
                $(this).attr("id") === "departure_date_multiple" ||
                $(this).attr("id") === "travel_date_back"
            ) {
                options["startDate"] = new Date();
            }
            if ($(this).attr("id") === "departure_date_multiple") {
                options["multidate"] = true;
            }
            $(this).datepicker(options);
        });
    }

    body.on("focus", ".datepicker", function () {
        if (
            $(this).attr("id") === "departure_date" ||
            $(this).attr("id") === "arrival_date" ||
            $(this).attr("id") === "travel_date" ||
            $(this).attr("id") === "departure_date_multiple" ||
            $(this).attr("id") === "travel_date_back"
        ) {
            options["startDate"] = new Date();
        }
        if ($(this).attr("id") === "departure_date_multiple") {
            options["multidate"] = true;
        }
        $(this).datepicker(options);
    });

    // body.on('focus', '#route_duration_hour', function () {
    //     $(this).datetimepicker({
    //         locale: lang,
    //         defaultDate: moment(new Date()).hours(0).minutes(0).seconds(0).milliseconds(0),
    //         tooltips: tooltipsDateTime,
    //         format: 'HH:mm'
    //     });
    // });

    $(".listing_search .page-link").click(function (e) {
        e.preventDefault();
        let pag = $(this).html();
        $("<input>", { type: "hidden", name: "page", value: pag }).appendTo(
            listingForm
        );
        listingForm.submit();
    });

    /*----------------------------------------------------*/
    // MENU SMOOTH SCROLLING
    /*----------------------------------------------------*/
    $(".scrollspy-menu li a").bind("click", function (event) {
        // $("#fixed-menu li a").removeClass('active');
        //$(this).addClass('active');
        let headerH = 0; //$('#top-inner').outerHeight();
        if ($(this).attr("href") === "#main") {
            $("html, body").animate(
                {
                    scrollTop: 0 + "px",
                },
                {
                    duration: 1200,
                    easing: "easeInOutExpo",
                }
            );
        } else {
            $("html, body").animate(
                {
                    scrollTop:
                        $($(this).attr("href")).offset().top - headerH + "px",
                },
                {
                    duration: 1200,
                    easing: "easeInOutExpo",
                }
            );
        }
        $(this).blur();
        event.preventDefault();
    });

    /*----------------------------------------------------*/
    // Select2
    /*----------------------------------------------------*/
    let oc = $(".select2");
    if (oc.length > 0) {
        let select2Parrent = oc.parent().attr("class") + "-dropdown";
        oc.select2({
            minimumResultsForSearch: Infinity,
            dropdownCssClass: select2Parrent,
        });
    }

    let route_type_field = $('[name="route_type_array[]"]');
    let listingForm = $("#listingForm");

    $("#check_all").click(function () {
        if ($(this).is(":checked")) {
            route_type_field.remove();
            $("#sort_1").attr("checked", "checked");
            $("#sort_2").attr("checked", "checked");
            //$('#sort_3').attr('checked', 'checked');

            $("<input>", {
                type: "hidden",
                name: "route_type_array[]",
                value: "1",
            }).appendTo(listingForm);
            $("<input>", {
                type: "hidden",
                name: "route_type_array[]",
                value: "2",
            }).appendTo(listingForm);
            //$('<input>', {type: "hidden", name: "route_type_array[]", value: "3"}).appendTo(listingForm);
            listingForm.submit();
        } else {
            route_type_field.remove();
            $("#sort_1").removeAttr("checked");
            $("#sort_2").removeAttr("checked");
            //$('#sort_3').removeAttr('checked');
        }
    });

    $("#sort_1").click(function () {
        let input = $("<input>", {
            type: "hidden",
            name: "route_type_array[]",
            id: "rt_1",
            value: "1",
        });
        if ($(this).is(":checked")) {
            input.appendTo(listingForm);
        } else {
            $("#rt_1").remove();
        }
        listingForm.submit();
    });

    $("#sort_2").click(function () {
        let input = $("<input>", {
            type: "hidden",
            name: "route_type_array[]",
            id: "rt_2",
            value: "2",
        });
        if ($(this).is(":checked")) {
            input.appendTo(listingForm);
        } else {
            $("#rt_2").remove();
        }
        listingForm.submit();
    });

    // $('#sort_3').click(function () {
    //     let input = $('<input>', {type: "hidden", name: "route_type_array[]", id: 'rt_3', value: "3"});
    //     if ($(this).is(':checked')) {
    //         input.appendTo(listingForm);
    //     } else {
    //         $('#rt_3').remove();
    //     }
    //     listingForm.submit();
    // });

    $(".listing_search #sort_change").change(function (e) {
        e.preventDefault();
        let thsv = $(this).val();
        $('input[name="sort_by"]').val(thsv);
        listingForm.submit();
    });

    $(".listing_page #sort_change").change(function (e) {
        e.preventDefault();
        let route_type = listingForm.find('input[name="route_type"]').val();
        let params = {};

        if ($(this).val() !== "date") {
            params["sort_by"] = $(this).val();
        }
        if (route_type.length) {
            params["route_type"] = route_type;
        }
        window.location.href = route("listings", params);
    });

    listingForm.submit(function (e) {
        let trd = $(this).find("#travel_date");
        let dpd = $(this).find('input[name="departure_date"]');
        dpd.val(moment(trd.datepicker("getDate")).format("YYYY-MM-DD"));
        let tdb = $(this).find("#travel_date_back");
        if (tdb.val() && tdb.val().length) {
            let ard = $(this).find('input[name="return_date"]');
            ard.val(moment(tdb.datepicker("getDate")).format("YYYY-MM-DD"));
        }
        return true;
    });

    $(document).on("click", ".booking-button", function (e) {
        e.preventDefault();
        $(this).parent().parent().find("#bookingListingForm").submit();
    });

    $(document).on("click", ".seat-chosen-pre", function (e) {
        e.preventDefault();
        $(this).removeClass(
            "seat-chosen-pre seat-active seat-chosen seat-man seat-woman"
        );
        $("#ticketReserve").append(
            "" +
                '<input type="hidden" name="deleteReserved[]" value="' +
                $(this).find("span").html().trim() +
                '">'
        );
        $(this).on("click", chooseSeat);
    });

    $(document).on("submit", "#ticketReserve", function (e) {
        e.preventDefault();
        let data = $(this).serializeArray();
        $(".response")
            .css("display", "none")
            .removeClass(
                "response-success response-danger response-warning response-info"
            );
        $.ajax({
            url: route("reserve"),
            method: "POST",
            dataType: "JSON",
            data: data,
            context: this,
            success: function (data) {
                if (data.status === 1) {
                    window.location.reload();
                } else {
                    $(this)
                        .parent()
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                }
            },
            error: function (data) {
                $(this)
                    .parent()
                    .find(".response")
                    .css("display", "inline-block")
                    .addClass("response-danger")
                    .html(data.responseJSON.text);
                $("html, body").animate(
                    {
                        scrollTop: $(".response").offset().top - 150,
                    },
                    1000
                );
            },
        });
    });

    $(document).on(
        "click",
        '#ticketBooking button[name="action"]',
        async function (e) {
            e.preventDefault();
            let data = $("#ticketBooking").serializeArray();
            selectedSeats.forEach(seat => {
                data.push({
                    name: "seats[]",
                    value: seat
                });
            });
            let num = 0;
            $("#ticketBooking .phone_number_inp").each(function () {
                num++;
                data.push({
                    name: "phone_number[]",
                    value: $(this).intlTelInput("getNumber"),
                });
            });
            $(".response")
                .css("display", "none")
                .removeClass(
                    "response-success response-danger response-warning response-info"
                );
            data.push({ name: "action", value: $(this).val() });
            if (
                data.find((item) => item.name === "phone_number[]").value === "" &&
                data.find((item) => item.name === "name[]").value === ""
            ) {
                window.location.href = "/signup";
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
            $.ajax({
                url: route("booking"),
                method: "POST",
                dataType: "JSON",
                data: data,
                context: this,
                success: function (data) {
                    if (data.status === 1) {
                        var imagePath = data.text;
                        let qrFileName = data.fileName // Assuming data.text contains the image URL

                        // Inline CSS for modal
                        var modalCss = `
                    .modal-popup {
                        display: none;
                        position: absolute;
                        z-index: 1000;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        padding: 20px;
                    }

                    .modal-content {
                        position: relative;
                        background-color: #fff;
                        margin: 10% auto;
                        padding: 40px 10px 0px 10px;
                        max-width: 400px;
                        width: 90%;
                            align-items: center;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                        text-align: center;
                    }

                    .modal-content img {
                        width: 65%;
                    }

                    .modal-image {
                        height: auto;
                        max-width: 100%;
                        border-radius: 5px;
                    }

                    .close-btn-popup {
                        position: absolute;
                        top: -3px;
                        right: 20px;
                        font-size: 30px;
                        cursor: pointer;
                        font-weight: bold;
                    }

                    .close-btn-popup:hover, home-btn-popup:hover {
                        color: #333;
                    }

                    .home-btn-popup {
                        position: absolute;
                        top: -3px;
                        font-size: 30px;
                        cursor: pointer;
                        font-weight: bold;
                        left: 20px;
                        right: unset;
                    }

                    .modal-btn {
                        font-size: 22px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        position: absolute;
                        top: 5px;
                        background: #ffffff;
                        color: #c9302c;
                        border: none;
                        font-weight: bold;
                    }
                        .modal-btn :hover {
                        border: none;
                }
                    .thank-class-p-1{
                        font-size: 16px;
                        margin-bottom: 0;
                        font-weight: 700;
                    }
                    .thank-class-p-2 {
                        margin-bottom: 0;
                    }
                    .thank-class-p-2 {
                        margin-bottom: 1rem;
                    }

                    .bottom-btn-section{
                        text-decoration: none;
                        font-family: 'Roboto Condensed';
                        font-weight: 600;
                        font-size: 11px;
                        text-transform: uppercase;
                        line-height: 36px;
                        padding: 0 15px;
                        margin: 0;
                        color: #fff;
                        letter-spacing: 0.1em;
                        background: linear-gradient(to right, #c9302c 0%, #720f0c 100%);
                        border-radius: 5px;
                        border: 0;
                        transition: all 0.3s ease-out;
                    }
                    .bottom-btn-section:hover{
                        color: #fff;
                        background: linear-gradient(to right, #720f0c 0%, #c9302c 100%);
                        border: 0;
                        cursor: pointer;
                    }
                    .bottom-btn-div-container{
                        justify-content: space-between;
                        display: flex;
                        padding: 15px 0;
                        align-items: center;
                        width: 65%;
                    }

                    .modal-btn:hover {
                        color: ##7a1212;
                    }
                    `;

                        // Create a style element and append the CSS to the document head
                        const style = $("<style></style>").text(modalCss);
                        $("head").append(style);

                        // Create modal structure
                        const modal = $('<div class="modal-popup"></div>');
                        const modalContent = $(
                            '<div class="modal-content"></div>'
                        );
                        var para = $(`
                        <div >
                            <p class="thank-class-p-1">Thank you for booking with us!</p>
                            <p class="thank-class-p-2">You can download or share your QR code now.</p>
                            <p class="thank-class-p-3">It will also be available under the "Ticket Booking" section for future reference.</p>
                        </div>
                    `);
                        const homeBotton = $(
                            '<span class="home-btn-popup modal-btn"><i class="fa fa-home" aria-hidden="true"></i></span>'
                        );
                        const closeBtn = $(
                            '<span class="close-btn-popup modal-btn"><i class="fa fa-times" aria-hidden="true"></i></span>'
                        );
                        const image = $(
                            '<img src="' +
                                imagePath +
                                '" alt="QR Code Image" class="modal-image" />'
                        );

                    const buttonContainer = $('<div class="bottom-btn-div-container"></div>');

                    const downloadBtn = $('<button class="download-btn bottom-btn-section"><i class="fa fa-download" aria-hidden="true"></i> Download  </button>');
                    downloadBtn.on('click',async function () {
                        const res = fetch(imagePath)
                        .then(response => response.blob())
                        .then(blob => {
                          const blobUrl = URL.createObjectURL(blob);
                          const img = document.createElement('img');
                          img.src = blobUrl;
                          document.body.appendChild(img);

                          const a = document.createElement('a');
                          a.href = blobUrl;
                          a.download = qrFileName;
                          a.click();
                        })
                        .catch(error => console.error('Error fetching the file:', error));
                    });

                    var shareBtn = $('<button class="share-btn bottom-btn-section"><i class="fa fa-share" aria-hidden="true"> </i> Share  </button>');
                    shareBtn.on('click', function () {
                        if (navigator.share) {
                            navigator.share({
                                title: 'QR Code',
                                text: 'Check out this QR code!',
                                url: imagePath
                            }).catch((error) => {
                                console.error('Error sharing:', error);
                            });
                        } else {
                            alert('Sharing is not supported on this browser.');
                        }
                    });

                    homeBotton.on('click', function () {
                        window.location.href = '/login';
                    });

                    buttonContainer.append(downloadBtn).append(shareBtn);
                    modalContent.append(homeBotton).append(para).append(closeBtn).append(image).append(buttonContainer);
                    modal.append(modalContent);

                        // Append the modal to the body
                        $("body").append(modal);

                        // Show the modal
                        modal.show();

                        // Close modal when the close button is clicked
                        closeBtn.on("click", function () {
                            modal.hide();
                        });

                        // Close modal if clicked outside of modal content
                        $(window).on("click", function (event) {
                            if ($(event.target).is(modal)) {
                                modal.hide();
                            }
                        });
                    } else if (data.status === -1) {
                        window.location.href = '../login';
                    } else if (data.status === 2) {
                        window.location.href = data.text;
                    } else if (data.status === 3) {
                        $(this)
                            .parents(".details-of-payment")
                            .find(".response")
                            .css("display", "inline-block")
                            .addClass("response-success")
                            .html(data.text);
                        let curc = $(".my_cart_button");
                        curc.find("span")
                            .addClass("new")
                            .html(parseInt(curc.find("span").html()) + num);
                        $("html, body").animate(
                            {
                                scrollTop: $(".response").offset().top - 150,
                            },
                            1000
                        );
                    } else {
                        $(this)
                            .parents(".details-of-payment")
                            .find(".response")
                            .css("display", "inline-block")
                            .addClass("response-danger")
                            .html(data.text);
                        $("html, body").animate(
                            {
                                scrollTop: $(".response").offset().top - 150,
                            },
                            1000
                        );
                    }
                },
                error: function (data) {

                    $(this)
                        .parents(".details-of-payment")
                        .find(".response")
                        .css("display", "inline-block")
                        .addClass("response-danger")
                        .html(data.responseJSON.text);
                    $("html, body").animate(
                        {
                            scrollTop: $(".response").offset().top - 150,
                        },
                        1000
                    );
                },
            });
        }
    );

    $(document).on("click", ".show_more", showMore);

    $(document).on("click", ".close-btn-popup", reloadPage);

    function reloadPage() {
        location.reload();
    }

    function showMore() {
        let ths = $(this);
        ths.off("click");
        let trd = $("#travel_date");
        let dpd = $('input[name="departure_date"]');
        dpd.val(moment(trd.datepicker("getDate")).format("YYYY-MM-DD"));
        let tdb = $("#travel_date_back");
        if (tdb.val().length > 0) {
            let ard = $('input[name="return_date"]');
            ard.val(moment(tdb.datepicker("getDate")).format("YYYY-MM-DD"));
        }

        $.ajax({
            url: $(this).attr("data-url"),
            data: listingForm.serializeArray(),
            method: "POST",
            dataType: "JSON",
            success: function (data) {
                if (
                    parseInt(data.skip) + parseInt(data.perPage) >=
                    parseInt(data.total_results)
                ) {
                    ths.remove();
                }
                if (data.results.length) {
                    $(".items").append(data.results);
                    listingForm
                        .find('input[name="zSkip"]')
                        .val(parseInt(data.skip) + parseInt(data.perPage));
                    ths.attr("data-url", data.url).on("click", showMore);
                } else {
                    ths.remove();
                }
            },
        });
    }

    $(document).on("click", ".show_more_notifications", showMoreNotifications);

    function showMoreNotifications() {
        let ths = $(this);

        $.ajax({
            url: $(this).attr("data-url"),
            data: { _token: CSRF_TOKEN, zSkip: $('input[name="zSkip"]').val() },
            method: "POST",
            dataType: "JSON",
            success: function (data) {
                if (
                    parseInt(data.skip) + parseInt(data.perPage) >=
                    parseInt(data.total_results)
                ) {
                    ths.remove();
                }
                if (data.results.length) {
                    $(".items").append(data.results);
                    $('input[name="zSkip"]').val(
                        parseInt(data.skip) + parseInt(data.perPage)
                    );
                    //ths.attr('data-url', data.url).on('click', showMoreNotifications());
                } else {
                    ths.remove();
                }
            },
        });
    }

    $(document).on("click", ".removeFromCart", function (e) {
        e.preventDefault();
        $.ajax({
            url: route("remove_cart"),
            method: "POST",
            dataType: "JSON",
            data: { _token: CSRF_TOKEN, id: $(this).attr("data-id") },
            success: function (data) {
                if (data.status === 1) {
                    location.reload();
                }
            },
        });
    });

    $(document).on("submit", "#cartCheckout", function (e) {
        e.preventDefault();
        let data = $(this).serializeArray();
        $.ajax({
            url: route("cart_checkout"),
            method: "POST",
            dataType: "JSON",
            data: data,
            success: function (data) {
                if (data.status === 1) {
                    $("body").append(data.text);
                    $("#creditCardForm").submit();
                } else if (data.status === 2) {
                    window.location.href = data.text;
                }
            },
        });
    });

    $(".vehicle-scheme .vehicle-seat:not(.seat-chosen)").on(
        "click",
        chooseSeat
    );

    let selectedSeats = [];

    let seat_counts = 0;
    function chooseSeat() {
        let that = $(this);
        if (
            !$(this).hasClass("ui-draggable") &&
            !$(this).parents(".vehicle-scheme-wrapper").hasClass("disabled")
        ) {
            let ticket_passengers = $(".ticket-passengers");
            let ticket_totals = $(".details-of-payment-total");
            let seat_number = that.find("span").html().replace(/\s/g, "");
            let ticket_passenger_seat = $(".ticket-passenger-seat");
            if (!that.hasClass("seat-active")) {
                let preserving;
                if ($(document).find("#ticketReserve").length) {
                    preserving = 1;
                } else {
                    preserving = 0;
                }
                that.off("click");
                if (seat_counts < 60) {
                    $.ajax({
                        url: route("choose_seat"),
                        method: "POST",
                        context: this,
                        data: {
                            _token: CSRF_TOKEN,
                            number: seat_counts + 1,
                            seat_number: seat_number,
                            preserving: preserving,
                        },
                        beforeSend: function () {
                            $(".loading-web").css("display", "none");
                        },
                        success: function (data) {
                            if (data && Object.keys(data).length > 0) {
                                if (data.status === 'error') {
                                    return;
                                }
                                ticket_totals.removeClass("hidden");
                                if (seat_counts === 1) {
                                    ticket_passengers
                                        .append(data)
                                        .removeClass("hidden");
                                }
                                selectedSeats.push(seat_number);
                                that.addClass("seat-active");
                                let oc = $(".select2");
                                let phone_number_input = $(
                                    "input.phone_number_inp"
                                );
                                let select2Parrent =
                                    oc.parent().attr("class") + "-dropdown";
                                oc.select2({
                                    minimumResultsForSearch: Infinity,
                                    dropdownCssClass: select2Parrent,
                                });
                                phone_number_input.intlTelInput({
                                    autoPlaceholder: "aggressive",
                                    defaultCountry: current_country_code,
                                    onlyCountries: ["lk"],
                                    utilsScript: "/js/utils.js",
                                });
                                that.on("click", chooseSeat);
                            } else {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                openLoginForm();
                            }
                        },
                    });
                }
                $("#amount").val(++seat_counts);
                // let totalTicketValue = (seat_counts) * parseFloat($('input[name="price"]').val()).toFixed(2)
                // $(".details-of-payment-total .txt2 .currency-div").html( totalTicketValue );
                updateCurrency()
            } else {
                selectedSeats = selectedSeats.filter(seat => seat !== seat_number);
                that.removeClass("seat-active");
                ticket_passenger_seat
                    .find("span")
                    .filter(function () {
                        return $(this).html() === seat_number;
                    })
                    .parents(".ticket-passenger")
                    .remove();
                // if (seat_counts < 60) {
                //     ticket_passengers.addClass("hidden");
                //     ticket_totals.addClass("hidden");
                // }
                $("#amount").val(--seat_counts);
                // let totalTicketValue = (seat_counts) * parseFloat($('input[name="price"]').val()).toFixed(2)
                // $(".details-of-payment-total .txt2 .currency-div").html( totalTicketValue );
                updateCurrency()
            }
        }
    }

    $(document).on("click", ".ticket-passenger-close a", function (e) {
        e.preventDefault();
        let this_seat = $(this)
            .parent()
            .parent()
            .find(".ticket-passenger-seat")
            .find("span")
            .html();
        $(this).parent().parent().remove();
        $(".vehicle-seat span:contains(" + this_seat + ")")
            .parent()
            .removeClass("seat-active");
        $("#amount").val(--seat_counts);
        $(".details-of-payment-total .txt2 span").html(
            (seat_counts) *
                parseFloat($('input[name="price"]').val()).toFixed(2)
        );
    });

    /*----------------------------------------------------*/
    // Ticket details info.
    /*----------------------------------------------------*/

    /*----------------------------------------------------*/
    // Fancybox
    /*----------------------------------------------------*/
    let od = $("a.fancybox");
    if (od.length > 0) {
        od.fancybox();
    }

    if ($("#profitsChart").length) {
        let ctx = document.getElementById("profitsChart").getContext("2d");
        $.ajax({
            data: { _token: CSRF_TOKEN },
            url: route("partner_profit_data"),
            dataType: "JSON",
            method: "POST",
            success: function (d) {
                let optionsChart = {
                    type: "line",
                    data: {
                        labels: d.labels,
                        datasets: [
                            {
                                data: d.data,
                                borderWidth: 1,
                                backgroundColor: "#f7990461",
                                borderColor: "#f79904",
                            },
                        ],
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                        legend: {
                            display: false,
                        },
                    },
                };
                new Chart(ctx, optionsChart);
            },
        });
    }

    if ($("#driverProfitsChart").length) {
        let ctx = document
            .getElementById("driverProfitsChart")
            .getContext("2d");
        $.ajax({
            data: { _token: CSRF_TOKEN },
            url: route("driver_profit_data"),
            dataType: "JSON",
            method: "POST",
            success: function (d) {
                let optionsChart = {
                    type: "line",
                    data: {
                        labels: d.labels,
                        datasets: [
                            {
                                data: d.data,
                                borderWidth: 1,
                                backgroundColor: "#f7990461",
                                borderColor: "#f79904",
                            },
                        ],
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                        legend: {
                            display: false,
                        },
                    },
                };
                new Chart(ctx, optionsChart);
            },
        });
    }

    let phone_number_input = $('input[name="phone_number"]');
    let current_country_code = "auto";
    if (phone_number_input.length) {
        $.ajax({
            data: { _token: CSRF_TOKEN },
            url: route("current_country_code"),
            dataType: "JSON",
            method: "POST",
            beforeSend: function () {
                $(".loading-web").css("display", "none");
            },
            success: function (data) {
                current_country_code = data;
            },
        });
        phone_number_input.intlTelInput({
            autoPlaceholder: "aggressive",
            defaultCountry: current_country_code,
            onlyCountries: ["lk"],
            utilsScript: "/js/utils.js",
        });
    }

    let ltmsgid = $(".ltst-msg[id]");
    if (ltmsgid.length) {
        $("html, body").animate(
            {
                scrollTop: $("#" + ltmsgid.attr("id")).offset().top - 155,
            },
            1000,
            function () {
                $("#" + ltmsgid.attr("id"))
                    .find("span.yellowOverlay")
                    .fadeOut();
            }
        );
    }

    /*----------------------------------------------------*/
    // Animate number
    /*----------------------------------------------------*/
    let oe = $(".animated-number");
    if (oe.length > 0) {
        oe.appear(function () {
            let elem = $(this);
            let b = elem.text();
            let d = elem.data("duration");
            let animationDelay = elem.data("animation-delay");
            if (!animationDelay) {
                animationDelay = 0;
            }
            elem.text("0");

            setTimeout(function () {
                elem.animate(
                    { num: b },
                    {
                        duration: d,
                        step: function (num) {
                            this.innerHTML = num.toFixed(0);
                        },
                    }
                );
            }, animationDelay);
        });
    }

    /*----------------------------------------------------*/
    // DataTable
    /*----------------------------------------------------*/

    $(".dataTables_length").addClass("bs-select");
});

/////////////////////// load
$(window).on("load", function () {

    let formGroups = mobileVerificationForm.find(".form-group");
    formGroups.last().hide();

    $(".vehicle-scheme-wrapper").css("display", "block");

    // Details.
    let og = $(".slider-for2");
    if (og.length > 0) {
        og.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: ".slider-nav2",
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 5000,
        });
    }

    let oh = $(".slider-nav2");
    if (oh.length > 0) {
        oh.slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: ".slider-for2",
            dots: false,
            centerMode: false,
            focusOnSelect: true,
            adaptiveHeight: false,
            fade: false,
            autoplay: true,
            autoplaySpeed: 5000,
            vertical: true,
            verticalSwiping: true,
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        vertical: false,
                        slidesToShow: 4,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 575,
                    settings: {
                        vertical: false,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        vertical: false,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
    }

    checkForVerifiedEmails()
});

function checkForVerifiedEmails() {
    const urlParams = new URLSearchParams(window.location.search);
    const verifiedEmail = urlParams.get('verified_email');

    if (verifiedEmail) {
        if (verifiedEmail == 'error') {
            openEmailVerificationForm()
            $(".email-verification-popup-wrapper .response")
            .css("display", "inline-block")
            .addClass("response-danger")
            .html('Something went wrong, please try again!');
        } else {
            openRegisterForm()
            document.getElementById('verified_email').value = verifiedEmail;
            $(".signup-popup-wrapper .response")
            .css({"display": "flex", "justify-content": "center"})
            .addClass("response-success")
            .html('Email verification process success!</br> Please complete the signup.');
        }
    } else {
        $(".email-verification-popup-wrapper .response")
        .css("display", "")
        .removeClass("response-danger response-success")
        .html("");
    }
}

window.addEventListener("message", function(event) {
    if (event.data && event.data.action === "open_mobile_verification") {
        closeEmailVerificationForm()
        openMobileVerificationForm();
    }
});

$(document).ready(function () {

  
    //Using fresh Slider
  $("#aged-value").freshslider({
      range: true,
      step: 1,
      min: 16,
      max: 40,
      value: [16, 40],
      onchange: function (low, high) {
        $('.aged-value').val(`${low} - ${high} Years`);
      }
    });

  $("#height-value").freshslider({
    range: true,
    step: 1,
    min: 155,
    max: 220,
    value: [155, 220],
    onchange: function (low, high) {
      $('.height-value').val(`${low} - ${high} CM`);
    }
  });

    // Datepicker
    $('#datetimepicker4').datetimepicker({
      format: 'L'
    });

  // Recruiter's form signing fee
  $('#amount_id').hide();
  $('.check_sf').change(function () {
    if ($(this).find(":checked").val() === 'Yes') {
        $('#amount_id').show();
    } else{
      $('#amount_id').hide();
    }
  });

  // fetch regions, countries and cities data from API ]
 
  const url = `http://country.io/names.json`;
  console.log(url);
  $.getJSON(url, (data, status) => {
    if (status === 'success') {
      $.each(data, function (index, item) {

        $('#club_country').append(
          `<option value="${item}" > ${item} </option>`
        );

        $('#player_country').append(
          `<option data-id="${item}" value="${item}" > ${item} </option>`
        );

        $('#player_country2').append(
          `<option data-id="${item}" value="${item}" > ${item} </option>`
        );
      });
    } else {
      console.log('something seem to be wrong');
    }
  });

  // Country selected --> update region list .
  // var selectedCountry = (selectedRegion = selectedCity = "");
  // $("#player_country").change(function () {

  //   selectedCountry = this.options[this.selectedIndex].text;
  //   countryCode = $(this).find(':selected').data('id');
  //   // Populate country select box from battuta API
  //   region_url = `https://battuta.medunes.net/api/region/${countryCode}/all/?key=${api}&callback=?`;
  //   $.getJSON(region_url, function (data, status) {
  //     if (status === 'success') {
  //       $("#player_region option").remove();
  //       $('#player_region').append('<option value="">Please select your region</option>');
  //         $.each(data, function (index, value) {
  //           // APPEND OR INSERT DATA TO SELECT ELEMENT.
  //           $("#player_region").append(
  //             `<option value="${value.region}">${value.region} </option>`
  //           );
  //         });
  //     } else {
  //     console.log('something seem to be wrong');
  //   }
  //   });
  // });

  // fetch currencies data from API
  const curr_url = 'https://free.currencyconverterapi.com/api/v5/currencies';
  $.getJSON(curr_url, (data, status) => {

    if (status === 'success') {

      $.each(data.results, function (index, item) {
        
        $('#player_currency').append(
          `<option id="curr" value=" ${item.currencyName}' '${item.id} " >  ` + (item.currencySymbol === "undefined" ? item.currencyName : item.currencySymbol) +` </option>`
        );

        $('#player_currency2').append(
          `<option id="curr" value=" ${item.currencyName}' '${item.id} " >  ` + (item.currencySymbol === "undefined" ? item.currencyName : item.currencySymbol) + ` </option>`
        );

      });
    } else {
      console.log('something seem to be wrong');
    }
  });

  
  //Multiple select 
  $('#player_position').multiselect();

  //Player/Recruiter Service Form

  //Identity
  $('.club').hide();
  $('.agent').hide();
  
  $('.identity').change(function () {

    if ($(this).find(":checked").val() === 'Club_Representative') {
      $('.club').show();
      $('#club').attr("required", "required");
    } else {
      $('.club').hide();
       $('#club').removeAttr("required", "required");
    }

    if ($(this).find(":checked").val() === 'Agent_(Agency)') {
      $('.agent').show();
      $('#agent').attr("required", "required");
    } else {
      $('.agent').hide();
      $('#agent').removeAttr("required", "required");
    }
  });




  //Career Status
  $('#duration_id').hide();
  $('.check_cs').change(function () {
    if ($(this).find(":checked").val() === 'Contracted') {
      $('#duration_id').show();
    } else {
      $('#duration_id').hide();
    }
  });

  //Representation
  $('.representation_id').hide();
  $('.check_rep').change(function () {
    if ($(this).find(":checked").val() === 'None') {    
      $('.representation_id').show();
    } else {
      $('.representation_id').hide();
    }
  });



  $(document).ready(function () {
    const max_fields = 5; //maximum input boxes allowed
    const wrapper = $(".input_form_wrapper"); //Fields wrapper
    const add_button = $(".add_field_button"); //Add button ID

    var x = 1; //initlal text box count
    $(add_button).click(function (e) { //on add input button click
      e.preventDefault();
      if (x < max_fields) { //max input box allowed
        x++; //text box increment
        $(wrapper).append(`
                        <div class="form-row removable_${x}">

                          <div class="form-group mb-4 pr-md-3 col-md-6 ">
                          
                              <input type="text" name="prev_club_name_${x}" class="form-control " placeholder="Club Name" id="" required>
                          </div>

                          <div class="form-group mb-4 pl-md-3 col-md-5 ">
                                
                                <input type="text" name="prev_club_division_${x}" class="form-control " placeholder="Club country/Divivsion" id="" required>
                            </div>
                            <div class="pb-md-1 col-md-1 text-center">
                                
                                <button data-id="${x}" class="btn btn-primary-outline remove_field"><i class="fa fa-minus"></i></button>
                            </div>

                        </div>
                        `); //add input box
      }
    });

    $(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
      e.preventDefault(); 
        $(`.removable_${$(this).data('id')}`).remove(); 
      x--;
    })
  });

 
});

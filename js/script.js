(function() {
  // UI hooks

  let site_hero_t = $(".sht"),
    site_hero_s = $(".shst"),
    site_hero_img = $(".site-hero-sub"),
    site_hero_sub = $(".append_subtitle");


  const partner_1 = $(".append_partners");


  // Using the fetch API
  // for site hero
  fetch("https://multiskills.herokuapp.com/siteheroes", { method: "GET" })
    .then(res => res.json())
    .then(data => {
     data.map((value)=>{
        site_hero_t.text(value.title);
        site_hero_s.text(value.subtitle);
        site_hero_img.css({
         'background': `linear-gradient(to right, rgba(87, 175, 255, 0.8705882352941177) 0%, rgba(26, 129, 219, 0.74) 75%,  rgb(26, 129, 219) 100%), url(${value.image.url})no-repeat`, 'background-size': 'cover',
         'background-position': 'center' 
        })
  
     });
    });
   
 

  // for site hero 2
  fetch("https://multiskills.herokuapp.com/sitesubheroes", { method: "GET" })
    .then(res => res.json())
    .then(data => {
      
      data.forEach((value) => {
            // firs
          
            let text = `
                 <div class="col-md-4 text-center pt-5 pb-5">
                            <img src="${value.image.url}" alt="" class="img-fluid img-circle mt-4 mb-4 sit">
                      
                       
                            <h4 class="site_1_hero_t_3">${value.title}</h4>
                           
                           
                                <p class="pt-3 pb-2 site_1_hero_desc_3">${value.subtitle}</p>
        
                                <button class="btn  btn-small btn-primary pl-4 pr-4 mr-4 button_custom_nxt" type="submit">Learn more</button>
                            </div>
            `;

        site_hero_sub.append(text);
           
          });
    });
    

  // for site hero 2
  fetch("https://multiskills.herokuapp.com/partners", { method: "GET" })
    .then(res => res.json())
    .then(data => {
      data.forEach((value) => {
        // firs
        
        let text = `
      <div class="col-md-3 text-center">
                  <img class="partner_1" src="${value.image["0"].url}"  alt="" srcset="">
                </div>
    `;

        partner_1.append(text);

      });
    });

    

})();


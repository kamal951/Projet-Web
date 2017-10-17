$('#annonce-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/annonces?' + search, function(data) {
    $('#annonce-grid').html('');
    data.forEach(function(annonce) {
      $('#annonce-grid').append(`
      <div class="panel panel-success col-md-12" style="padding-right:0;padding-left:0;">
        <div class="panel-heading text-center"><h4>${ annonce.name }</h4></div>
        <div class="panel-body">
            <div>
                <img src="${ annonce.image }" style="height:200px;width:200px;float:left;">
                <p style="color:black;">${ annonce.description }</p>
            </div>
            <p>
                <a href="/annonces/${ annonce._id }" class="btn btn-primary">Plus d'Info</a>
            </p>
        </div>
      </div>  
      `);
    });
  });
});

$('#annonce-search').submit(function(event) {
  event.preventDefault();
});
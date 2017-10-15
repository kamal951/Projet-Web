$('#annonce-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/annonces?' + search, function(data) {
    $('#annonce-grid').html('');
    data.forEach(function(annonce) {
      $('#annonce-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ annonce.image }">
            <div class="caption">
              <h4>${ annonce.name }</h4>
            </div>
            <p>
              <a href="/annonces/${ annonce._id }" class="btn btn-primary">More Info</a>
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